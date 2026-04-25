# Pitzi Side-Scroller

A 2D platformer for speech therapy by **Pitzi-Games Studios**.

The player controls a Ninja Frog through a side-scrolling world. Hitting boxes from below breaks them and releases fruit or exercise coins. Collecting a coin pauses the game and shows a tongue-exercise illustration — the child performs the exercise, presses Space, and the game resumes.

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
| Space (in overlay) | Mark exercise done, resume game |

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
  70%       30%
 Fruit    Exercise coin
   │         │
collect    collect
   │         │
sparkle   Game pauses
  gone         │
          Show tongue exercise
          (random, one of 5)
               │
           Press Space
               │
           Game resumes
```

### Exercises

| Label | Movement |
|-------|----------|
| Zunge zur Nase | Tongue up |
| Zunge zum Kinn | Tongue down |
| Zunge nach links | Tongue left |
| Zunge nach rechts | Tongue right |
| Zunge nach Hause | Tongue to rest position |

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
    BootScene.js       Asset loading, texture setup, animation definitions
    GameScene.js       World, physics, game loop
  objects/
    Player.js          Ninja Frog — movement, jumps, animation state machine
    Fruit.js           Collectible sprite
    Box.js             Breakable box — hit detection, spawn callback
    ExerciseCoin.js    Floating coin spawned by boxes
  data/
    level.js           Fruit and box spawn positions
    exercises.js       5 tongue-exercise definitions (label + canvas draw function)
  ui/
    ExerciseOverlay.js Pause overlay — illustration, label, Space to dismiss
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
