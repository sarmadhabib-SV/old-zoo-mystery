// /tmp/zoo-test.mjs — full playthrough test for The Old Zoo Mystery.
// Host creates a room, guest joins by code, host drives phases, both chat,
// interrogate a scripted staff suspect, vote for that suspect, expect reveal.
import { io } from 'socket.io-client';

const URL = 'http://localhost:3210';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let lastHostState = null;
const oncePhase = (sock, phase, getLast) => new Promise((res) => {
  if (getLast && getLast() && getLast().phase === phase) return res(getLast());
  const h = (st) => { if (st.phase === phase) { sock.off('roomState', h); res(st); } };
  sock.on('roomState', h);
});
const awaitConnected = (sock) => sock.connected ? Promise.resolve() : new Promise((r) => sock.on('connect', r));

const host = io(URL);
const guest = io(URL);
let code, hostCard, guestCard, lastState, interrogationAnswered = false, gmAnswered = false;

host.on('roomCreated', ({ code: c }) => { code = c; console.log('room code:', code); });
host.on('yourCard', (c) => { hostCard = c; });
guest.on('yourCard', (c) => { guestCard = c; });
host.on('roomState', (s) => {
  lastState = s; lastHostState = s;
  if (s.phase === 'interrogation') {
    const hits = s.interrogation.filter((m) => m.kind === 'a');
    if (hits.length && !interrogationAnswered) { interrogationAnswered = true; console.log('scripted answer:', hits[0].text.slice(0, 80)); }
    const gm = s.interrogation.filter((m) => m.kind === 'gm');
    if (gm.length && !gmAnswered) { gmAnswered = true; console.log('head keeper hint:', gm[0].text.slice(0, 80)); }
  }
});
guest.on('roomState', (s) => { lastState = s; });

await awaitConnected(host);
host.emit('createRoom', { name: 'TestHost' });
await wait(500);
if (!code) throw new Error('no room code');
await awaitConnected(guest);
guest.emit('joinRoom', { code, name: 'TestGuest' });
await wait(500);
console.log('players:', lastState.players.map((p) => p.name).join(', '));

host.emit('startGame');
const vanishing = await oncePhase(host, 'vanishing', () => lastHostState);
console.log('case:', vanishing.vanishingFacts.animal);
console.log('narration:', vanishing.vanishingNarration.slice(0, 120));
await wait(300);
host.emit('advancePhase'); // -> characters
const chars = await oncePhase(host, 'characters', () => lastHostState);
console.log('host card:', JSON.stringify(hostCard));
console.log('suspects:', chars.suspects.map((s) => `${s.name}${s.isAI ? ' (staff)' : ''}`).join(' | '));
host.emit('advancePhase'); // -> investigation
const inv = await new Promise((res) => {
  const check = (st) => { if (st.phase === 'investigation' && st.revealedClues.length >= 1) { host.off('roomState', check); res(st); } };
  if (lastHostState && lastHostState.phase === 'investigation' && lastHostState.revealedClues.length >= 1) return res(lastHostState);
  host.on('roomState', check);
});
console.log('clue 1:', inv.revealedClues[0].text.slice(0, 80));
guest.emit('chat', { text: 'That dart clue is interesting.' });
await wait(300);
host.emit('skipTimer'); // round 2
await wait(300);
host.emit('skipTimer'); // round 3
await wait(300);
host.emit('skipTimer'); // -> interrogation
const inter = await oncePhase(host, 'interrogation', () => lastHostState);
console.log('clues revealed:', inter.revealedClues.length);
const staff = inter.suspects.find((s) => s.isAI);
if (!staff) throw new Error('no scripted staff suspect found');
console.log('interrogating staff suspect:', staff.name);
host.emit('askSuspect', { suspectName: staff.name, question: 'Where were you that night?' });
host.emit('askGM', { question: 'Any hint for us?' });
await wait(800);
if (!interrogationAnswered) throw new Error('no scripted interrogation answer');
if (!gmAnswered) throw new Error('no head keeper hint');
host.emit('advancePhase'); // -> vote
await oncePhase(host, 'vote', () => lastHostState);
host.emit('vote', { suspectName: staff.name });
guest.emit('vote', { suspectName: staff.name });
const reveal = await oncePhase(host, 'reveal', () => lastHostState);
console.log('REVEAL culprit:', reveal.reveal.culprit);
console.log('caught:', reveal.reveal.caught, '| winners:', reveal.reveal.winners.join(', '));
console.log('narration:', reveal.reveal.narration.slice(0, 120));
console.log('secrets revealed:', reveal.reveal.secrets.length);
if (!reveal.reveal.culprit) throw new Error('no culprit in reveal');
console.log('PLAYTHROUGH OK');
process.exit(0);
