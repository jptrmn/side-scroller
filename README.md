# Pitzi Side-Scroller

A 2D platformer for speech therapy by **Pitzi-Games Studios**.

The player controls a Ninja Frog through a side-scrolling world. Hitting boxes from below breaks them and releases fruit or exercise coins. Collecting a coin pauses the game and shows a tongue-exercise illustration — the child holds the position through a 5-second countdown, then the game resumes. The level is complete when every last point is collected.

---

## Getting started

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production bundle → dist/
npm run preview   # preview the production build locally
```

Requires Node.js 18+.

---

## Controls

| Key | Action |
|-----|--------|
| Arrow Left / A | Move left |
| Arrow Right / D | Move right |
| Arrow Up / W / Space | Jump |
| Space (in overlay) | Start countdown / confirm exercise |

Double-jump and wall-jump are supported.

---

## Game mechanics

```
Run & jump through the level
        │
        ▼
  Hit a box from below
        │
   ┌────┴────┐
   │         │
  40%       60%
 Fruit    Exercise coin
   │         │
collect    collect (+5 pts)
   │         │
+1 pt     Game pauses
sparkle       │
  gone    Show tongue exercise
          (random, one of 6)
               │
           Press Space
               │
         5-second countdown
               │
        "SUPER!" + resume
```

All box outcomes are decided before the level starts — the score total shown in the HUD is fixed from frame one. The level ends when `current = total` (every fruit and coin collected).

### Exercises

| Label | Movement |
|-------|----------|
| Zunge zur Nase | Tongue up to nose |
| Zunge nach rechts | Tongue right |
| Zunge zum Kinn | Tongue down to chin |
| Backen aufpusten | Puff cheeks |
| Zunge nach rechts oben | Tongue upper-right |
| Zunge in die Wange links | Tongue into left cheek |

Illustrations are pixel-art sprites from `assets/spritepack-zunge.png` (5×2 grid, 290×368 per cell).

---

## Sound

All sound effects are synthesized at runtime via the Web Audio API — no audio files are bundled. Each SFX is a square-wave oscillator with a frequency ramp and gain envelope. The engine is initialized once in `BootScene` and called from game objects and UI components through the shared `SFX` object in `src/utils/sounds.js`.

| Sound | Trigger |
|-------|---------|
| Jump / double-jump | Player jumps |
| Land thud | Player touches ground |
| Fruit chime | Fruit collected |
| Box crunch | Box hit from below |
| Coin ring | Exercise coin collected |
| Countdown tick | Each second of the exercise countdown |
| C–E–G–C arpeggio | Exercise completed |
| C-major fanfare | Level finished |

---

## Tech stack

| | |
|-|-|
| Engine | [Phaser 3](https://phaser.io/) v3.80.1 |
| Bundler | [Vite](https://vitejs.dev/) v5 |
| Language | JavaScript (ES modules) |
| Assets | [Pixel Adventure](https://pixelfrog-assets.itch.io/pixel-adventure-1) by Pixel Frog |

Canvas: 400×240 logical pixels, `zoom: 2` → renders at 800×480.

---

## Project structure

```
src/
  main.js              Phaser.Game config
  constants.js         Tuning values (speeds, world size, probabilities)
  scenes/
    BootScene.js       Asset loading, spritesheet + texture setup, anims, sound init
    GameScene.js       World, physics, score total, completion check, dust emitter
  objects/
    Player.js          Ninja Frog — movement, jumps, coyote time, animation state machine
    Fruit.js           Collectible sprite
    Box.js             Breakable box — spawn type pre-rolled at construction, hit detection
    ExerciseCoin.js    Floating coin — spawn scale anim, float tween
  data/
    level.js           Fruit, box, and coin spawn positions
    exercises.js       6 exercise definitions {frame, label} — index into 'zunge' spritesheet
  ui/
    ExerciseOverlay.js Pause overlay — sprite illustration, 5s countdown, reward, resume
    ScoreHUD.js        Top-right score counter (current / total)
    FinishOverlay.js   End-of-level screen — confetti cannons, fireworks, score, restart
  utils/
    sounds.js          Web Audio API synthesizer — SFX object
assets/
  PixelAdventure/      Sprite pack (do not modify)
  spritepack-zunge.png Exercise face illustrations (5×2 grid, 290×368 per cell)
docs/
  architecture.md      Module map, scene lifecycle, physics overview
  state.md             Where all state and data live
  exercise-flow.md     The therapeutic mechanic in detail
```

---

## Documentation

- [Architecture](docs/architecture.md) — module graph, scene lifecycle, coordinate system
- [State & data](docs/state.md) — what lives where, player state machine
- [Exercise flow](docs/exercise-flow.md) — full sequence diagram, timing, where feedback lives
