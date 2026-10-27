// server/index.js — The Old Zoo Mystery game server.
// Serves the static client and runs the Socket.IO game state machine.
// Zero-API: scenarios come from server/scenarios.js, interrogation answers
// and hints are scripted. Run: npm install && npm start
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { Server } from 'socket.io';
import * as game from './game.js';
import { pickScenario, scriptedAnswer, gmHint } from './scenarios.js';

const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(__dirname, '..', 'client');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// ---------------------------------------------------------------------------
// Static file server
// ---------------------------------------------------------------------------
function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.normalize(path.join(CLIENT_DIR, urlPath));
  if (!filePath.startsWith(CLIENT_DIR)) {
    res.writeHead(403); res.end('forbidden'); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}

const httpServer = http.createServer((req, res) => {
  if (req.method === 'GET') return serveStatic(req, res);
  res.writeHead(405); res.end('method not allowed');
});

const io = new Server(httpServer, { cors: { origin: '*' } });

// ---------------------------------------------------------------------------
// Room registry
// ---------------------------------------------------------------------------
const rooms = new Map(); // code -> room
const socketMap = new Map(); // socketId -> { code, playerId }

const CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I/O (confusable)
function genCode() {
  let code;
  do {
    code = Array.from({ length: 4 }, () => CODE_LETTERS[Math.floor(Math.random() * CODE_LETTERS.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function emitState(room) {
  const base = game.publicState(room);
  for (const p of room.players) {
    if (!p.socketId) continue;
    const sock = io.sockets.sockets.get(p.socketId);
    if (!sock) continue;
    sock.emit('roomState', { ...base, myVote: room.votes[p.id] || null, you: p.id });
  }
}

function clearTimer(room) {
  if (room.timer) {
    clearTimeout(room.timer.id);
    room.timer = null;
  }
}

function startTimer(room, seconds, label, onEnd) {
  clearTimer(room);
  const endsAt = Date.now() + seconds * 1000;
  const id = setTimeout(() => {
    room.timer = null;
    io.to(room.code).emit('timerEnded');
    onEnd();
  }, seconds * 1000);
  room.timer = { id, endsAt, label };
  io.to(room.code).emit('timerStarted', { endsAt, label, seconds });
}

function getRoom(code) {
  return rooms.get(String(code || '').toUpperCase()) || null;
}

function isHost(room, playerId) {
  return room.hostId === playerId;
}

function hostOf(room) {
  return game.getPlayer(room, room.hostId);
}

function ensureHost(room) {
  const h = hostOf(room);
  if (h && h.connected) return;
  const next = room.players.find((p) => p.connected) || room.players[0];
  if (next) {
    for (const p of room.players) p.isHost = false;
    next.isHost = true;
    room.hostId = next.id;
  }
}

// ---------------------------------------------------------------------------
// Game flow
// ---------------------------------------------------------------------------

function startGame(room) {
  const scenario = pickScenario(room.lastScenarioTitle);
  room.lastScenarioTitle = scenario.title;
  game.setupGame(room, scenario);
  // Short cinematic beat: setting + what vanished + how (kept under ~60 words).
  room.vanishingNarration = `${scenario.setting} ${scenario.animal} is gone. ${scenario.method}`;
  room.phase = 'vanishing';
  room.lastActive = Date.now();
  emitState(room);
  // private cards
  for (const p of room.players) {
    if (!p.socketId) continue;
    const sock = io.sockets.sockets.get(p.socketId);
    if (sock) sock.emit('yourCard', game.playerCard(room, p.id));
  }
}

function advanceFromVanishing(room) {
  room.phase = 'characters';
  emitState(room);
}

function beginInvestigation(room) {
  room.phase = 'investigation';
  emitState(room);
  startClueRound(room, 1);
}

function startClueRound(room, n) {
  room.clueRound = n;
  const clue = room.scenario.clues[n - 1];
  room.revealedClues.push({ round: n, text: clue });
  room.lastActive = Date.now();
  emitState(room);
  startTimer(room, 90, `Round ${n} discussion`, () => endClueRound(room));
}

function endClueRound(room) {
  if (room.phase !== 'investigation') return;
  if (room.clueRound < 3) {
    startClueRound(room, room.clueRound + 1);
  } else {
    clearTimer(room);
    room.phase = 'interrogation';
    room.lastActive = Date.now();
    emitState(room);
  }
}

function beginVote(room) {
  clearTimer(room);
  room.phase = 'vote';
  room.votes = {};
  room.lastActive = Date.now();
  emitState(room);
}

function maybeFinishVoting(room) {
  if (room.phase !== 'vote') return;
  if (game.connectedHumans(room).length === 0) return;
  const cast = Object.keys(room.votes).filter((pid) => {
    const v = game.getPlayer(room, pid);
    return v && v.connected;
  }).length;
  if (cast >= game.votesNeeded(room)) finishVoting(room);
}

function finishVoting(room) {
  if (room.phase !== 'vote') return;
  clearTimer(room);
  const result = game.tallyVotes(room);
  room.result = result;
  room.phase = 'plea';
  emitState(room);

  const accusedName = result.top; // may be null on zero votes
  const truth = room.scenario.truth;
  let pleaText = null;
  let pleaBy = accusedName || 'The accused';

  if (accusedName) {
    const t = game.suspectTruth(room, accusedName);
    if (t && !t.isAI && t.player && t.player.connected && t.player.socketId) {
      // Human plea: ask them, 30s timer, host can skip.
      const sock = io.sockets.sockets.get(t.player.socketId);
      if (sock) {
        sock.emit('pleaRequested', { suspectName: accusedName });
        startTimer(room, 30, 'Final plea', () => {
          deliverPlea(room, pleaBy, fallbackPleaText(pleaBy));
        });
        return;
      }
    }
    if (t) pleaText = t.plea || null;
  }
  deliverPlea(room, pleaBy, pleaText || fallbackPleaText(pleaBy));
}

function fallbackPleaText(name) {
  return `"${name} looks every one of you in the eye. "I'm innocent — I swear it. Look at the clues, not at me. You've got one chance to get this right."`;
}

function deliverPlea(room, by, text) {
  if (room.phase !== 'plea') return;
  clearTimer(room);
  room.plea = { by, text };
  room.lastActive = Date.now();
  emitState(room);
  // beat, then the reveal
  setTimeout(() => doReveal(room), 7000);
}

function doReveal(room) {
  if (room.phase === 'reveal') return;
  room.phase = 'revealing';
  emitState(room);
  const truth = room.scenario.truth;
  const culprit = game.culpritName(room);
  const caught = room.result ? room.result.culpritCaught : false;
  const winners = room.players
    .filter((p) => (caught ? !p.isCulprit : p.isCulprit))
    .map((p) => p.name);
  room.reveal = {
    narration: room.scenario.reveal,
    culprit,
    story: truth,
    animal: room.scenario.animal,
    caught,
    tied: room.result ? room.result.tied : false,
    winners,
    playerResults: room.players.map((p) => ({
      name: p.name,
      suspectName: p.suspectName,
      isCulprit: p.isCulprit,
      won: caught ? !p.isCulprit : p.isCulprit,
    })),
    secrets: game.allSuspects(room).map((s) => {
      const t = game.suspectTruth(room, s.name);
      return { name: s.name, secret: t ? t.secret : '' };
    }),
    votes: room.result ? room.result.counts : {},
  };
  room.phase = 'reveal';
  room.lastActive = Date.now();
  emitState(room);
}

// ---------------------------------------------------------------------------
// Socket handlers
// ---------------------------------------------------------------------------
io.on('connection', (socket) => {
  const ctx = () => socketMap.get(socket.id) || {};
  const myRoom = () => {
    const c = ctx();
    const room = c.code ? rooms.get(c.code) : null;
    const player = room ? game.getPlayer(room, c.playerId) : null;
    return { room, player };
  };

  socket.on('createRoom', ({ name } = {}) => {
    const clean = String(name || '').trim().slice(0, 24) || 'Keeper';
    const code = genCode();
    const player = game.createPlayer(randomUUID(), clean);
    player.socketId = socket.id;
    const room = game.createRoom(code, player);
    rooms.set(code, room);
    socketMap.set(socket.id, { code, playerId: player.id });
    socket.join(code);
    socket.emit('roomCreated', { code, playerId: player.id });
    emitState(room);
  });

  socket.on('joinRoom', ({ code, name } = {}) => {
    const room = getRoom(code);
    if (!room) return socket.emit('joinError', { message: 'No room with that code. Check the letters and try again.' });
    if (room.phase !== 'lobby') return socket.emit('joinError', { message: 'That game already started. Ask the host for the next one.' });
    if (room.players.length >= 8) return socket.emit('joinError', { message: 'That room is full (8 players max).' });
    const clean = String(name || '').trim().slice(0, 24) || 'Keeper';
    const player = game.createPlayer(randomUUID(), clean);
    player.socketId = socket.id;
    game.addPlayer(room, player);
    socketMap.set(socket.id, { code: room.code, playerId: player.id });
    socket.join(room.code);
    socket.emit('joined', { playerId: player.id });
    emitState(room);
  });

  socket.on('rejoin', ({ code, playerId } = {}) => {
    const room = getRoom(code);
    const player = room ? game.getPlayer(room, playerId) : null;
    if (!room || !player) return socket.emit('rejoinError', {});
    player.socketId = socket.id;
    player.connected = true;
    ensureHost(room);
    socketMap.set(socket.id, { code: room.code, playerId: player.id });
    socket.join(room.code);
    socket.emit('rejoined', { playerId: player.id });
    socket.emit('yourCard', game.playerCard(room, player.id));
    emitState(room);
    maybeFinishVoting(room);
  });

  socket.on('startGame', () => {
    const { room, player } = myRoom();
    if (!room || !player || !isHost(room, player.id) || room.phase !== 'lobby') return;
    if (room.players.length < 2) {
      return socket.emit('errorMsg', { message: 'Need at least 2 players to start.' });
    }
    startGame(room);
  });

  // Host advances: vanishing → characters → investigation → interrogation → vote
  socket.on('advancePhase', () => {
    const { room, player } = myRoom();
    if (!room || !player || !isHost(room, player.id)) return;
    room.lastActive = Date.now();
    if (room.phase === 'vanishing') advanceFromVanishing(room);
    else if (room.phase === 'characters') beginInvestigation(room);
    else if (room.phase === 'interrogation') beginVote(room);
  });

  socket.on('skipTimer', () => {
    const { room, player } = myRoom();
    if (!room || !player || !isHost(room, player.id)) return;
    if (room.timer) {
      clearTimer(room);
      io.to(room.code).emit('timerEnded');
      if (room.phase === 'investigation') endClueRound(room);
      else if (room.phase === 'plea' && room.plea === null) {
        const accused = room.result && room.result.top;
        deliverPlea(room, accused || 'The accused', fallbackPleaText(accused || 'The accused'));
      }
    }
  });

  socket.on('chat', ({ text } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player) return;
    const clean = String(text || '').trim().slice(0, 300);
    if (!clean) return;
    room.chat.push({ from: player.name, text: clean, ts: Date.now() });
    room.lastActive = Date.now();
    emitState(room);
  });

  socket.on('askSuspect', ({ suspectName, question } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player || room.phase !== 'interrogation') return;
    const q = String(question || '').trim().slice(0, 300);
    if (!q || !suspectName) return;
    const target = game.suspectTruth(room, suspectName);
    if (!target) return socket.emit('errorMsg', { message: 'Unknown suspect.' });

    room.interrogation.push({ kind: 'q', suspectName, by: player.name, text: q, ts: Date.now() });
    emitState(room);

    if (!target.isAI && target.player && target.player.connected && target.player.socketId) {
      const sock = io.sockets.sockets.get(target.player.socketId);
      if (sock) {
        sock.emit('questionForYou', { from: player.name, question: q, suspectName });
        return;
      }
    }
    if (!target.isAI) {
      room.interrogation.push({ kind: 'sys', text: `${suspectName} is away from the table.`, ts: Date.now() });
      emitState(room);
      return;
    }
    // Scripted staff suspect answers in character.
    const answer = scriptedAnswer(
      { name: target.name, occupation: target.occupation, secret: target.secret, isCulprit: target.isCulprit, tells: target.tells },
      q
    );
    if (room.phase === 'interrogation') {
      room.interrogation.push({ kind: 'a', suspectName, by: `${suspectName}`, text: answer, ts: Date.now() });
      emitState(room);
    }
  });

  socket.on('answerQuestion', ({ text } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player || !player.suspectName) return;
    const clean = String(text || '').trim().slice(0, 500);
    if (!clean) return;
    room.interrogation.push({ kind: 'a', suspectName: player.suspectName, by: player.name, text: clean, ts: Date.now() });
    room.lastActive = Date.now();
    emitState(room);
  });

  socket.on('askGM', ({ question } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player || room.phase !== 'interrogation') return;
    const q = String(question || '').trim().slice(0, 300);
    if (!q) return;
    room.interrogation.push({ kind: 'q', suspectName: 'Head Keeper', by: player.name, text: q, ts: Date.now() });
    emitState(room);
    const answer = gmHint(room.interrogation.length);
    if (room.phase === 'interrogation') {
      room.interrogation.push({ kind: 'gm', suspectName: 'Head Keeper', by: 'Head Keeper', text: answer, ts: Date.now() });
      emitState(room);
    }
  });

  socket.on('vote', ({ suspectName } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player || room.phase !== 'vote') return;
    if (!game.suspectTruth(room, suspectName)) return socket.emit('errorMsg', { message: 'Unknown suspect.' });
    game.recordVote(room, player.id, suspectName);
    emitState(room);
    maybeFinishVoting(room);
  });

  socket.on('submitPlea', ({ text } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player || room.phase !== 'plea') return;
    const accused = room.result && room.result.top;
    if (!accused || player.suspectName !== accused) return; // only the accused speaks
    const clean = String(text || '').trim().slice(0, 500) || fallbackPleaText(accused);
    deliverPlea(room, accused, clean);
  });

  socket.on('rematch', () => {
    const { room, player } = myRoom();
    if (!room || !player || !isHost(room, player.id)) return;
    clearTimer(room);
    game.resetForRematch(room);
    ensureHost(room);
    emitState(room);
    for (const p of room.players) {
      if (!p.socketId) continue;
      const sock = io.sockets.sockets.get(p.socketId);
      if (sock) sock.emit('yourCard', null);
    }
  });

  socket.on('disconnect', () => {
    const { room, player } = myRoom();
    socketMap.delete(socket.id);
    if (!room || !player) return;
    player.connected = false;
    player.socketId = null;
    room.lastActive = Date.now();
    ensureHost(room);
    maybeFinishVoting(room);
    if (room.phase === 'plea' && room.plea === null && room.result && room.result.top) {
      const accused = game.suspectTruth(room, room.result.top);
      if (accused && !accused.isAI && accused.player && accused.player.id === player.id) {
        clearTimer(room);
        deliverPlea(room, accused.name, accused.plea || fallbackPleaText(accused.name));
      }
    }
    emitState(room);
  });
});

// Sweep dead rooms every 10 minutes.
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    const anyone = room.players.some((p) => p.connected);
    if (!anyone && now - room.lastActive > 30 * 60 * 1000) {
      clearTimer(room);
      rooms.delete(code);
    }
  }
}, 10 * 60 * 1000);

httpServer.listen(PORT, () => {
  console.log(`The Old Zoo Mystery running at http://localhost:${PORT}`);
});
