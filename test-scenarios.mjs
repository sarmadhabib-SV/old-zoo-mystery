import * as game from './server/game.js';
import { SCENARIOS } from './server/scenarios.js';
for (const sc of SCENARIOS) {
  for (const n of [2, 8]) {
    const host = game.createPlayer('h1', 'Host');
    const room = game.createRoom('TEST', host);
    for (let i = 1; i < n; i++) game.addPlayer(room, game.createPlayer('p' + i, 'P' + i));
    game.setupGame(room, sc);
    const suspects = game.allSuspects(room);
    const culprits = suspects.filter((s) => game.suspectTruth(room, s.name).isCulprit);
    const expected = Math.max(5, n);
    if (suspects.length !== expected) throw new Error(`${sc.title} n=${n}: ${suspects.length} suspects, want ${expected}`);
    if (culprits.length !== 1) throw new Error(`${sc.title} n=${n}: ${culprits.length} culprits`);
    if (sc.clues.length !== 3) throw new Error(`${sc.title}: ${sc.clues.length} clues`);
  }
  console.log('OK:', sc.title, '| animal:', sc.animal.slice(0, 40));
}
console.log('ALL SCENARIOS OK');
