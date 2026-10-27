# THE OLD ZOO MYSTERY — Game Design Document

A multiplayer zoo mystery party game for Handshake, modeled on Plot
Twist's architecture and rebuilt zero-API.

## The pitch
2–8 players join a room from their phones via a 4-letter code. In the
fictional old city of Velmara, a star animal has vanished overnight
from the Old Zoo's locked enclosure. One player is secretly the
culprit; the rest are zoo staff, each with a personal secret. Six
hand-written cases, no API key, fully playable.

## Why it works
- **Execution**: instant join, no signup, works on phone + laptop, real-time.
- **Creativity**: a fresh fictional world (Velmara, founded 1894 zoo),
  six distinct cases, scripted in-character interrogation answers.
- **Usefulness/value**: endlessly replayable party game; playable with
  just 2 humans (scripted staff fill the table).
- **Polish**: vintage zoo-poster aesthetic, cinematic narration,
  dramatic reveal.

## Players & roles
- 2–8 humans per room. Total suspect count = max(5, human count).
- If humans < 5, scripted staff suspects fill the table (names,
  occupations, secrets, keyword-matched in-character answers).
- One suspect is secretly the culprit (can be human or scripted).
  Everyone else is innocent but each has a personal secret (red
  herrings + flavor).

## Game flow (host advances phases; discussion has a 90s skippable timer)
1. **Lobby** — host creates room, 4-letter code shown big. Players join
   with a name. Host starts when 2+ players are in.
2. **The Vanishing** — the case opens: setting, missing animal, method,
   timeline. Short cinematic narration.
3. **Character cards** — each player receives a secret card: staff name,
   job, relation to the case, personal secret, and whether they are
   the culprit. Scripted staff suspects are introduced publicly.
4. **Investigation** (3 rounds) — one clue per round, then open
   discussion in room chat.
5. **Interrogation** — players question any suspect. Humans answer for
   themselves; scripted suspects answer in character from keyword
   tells; the Head Keeper gives spoiler-free hints.
6. **Accusation & vote** — each player votes. The accused gets a
   30-second final plea (fun!). Majority rules; ties = culprit survives.
7. **The Reveal** — the true story is narrated: who did it, how, and
   how the clues pointed there. Winners announced (staff wins if the
   culprit is caught, culprit wins otherwise). Rematch button.

## Tech
- **Server**: Node.js + Socket.IO (rooms, events, timers). Serves the client.
- **Client**: single-page app, vanilla JS, mobile-first, vintage
  zoo-poster aesthetic. No login, no signup — name + room code only.
- **Deploy**: one unit (server serves static client). Target: Render
  free tier (WebSocket-friendly). Cold starts acceptable.
- **Cost**: $0. No API dependency of any kind.

## Anti-frustration rules
- Game must be joinable and playable in under 60 seconds from landing.
- Host can skip any timer. Disconnects: player marked away, game continues.
- No text walls: narration capped at ~60 words per beat.
- Scripted answers always return instantly; the game never soft-locks.
