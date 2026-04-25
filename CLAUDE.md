# Pitzi Side-Scroller — Claude Context

## Project
Speech-therapy platformer by Pitzi-Games Studios. Ninja Frog runs, jumps, collects fruit, hits boxes. Boxes spawn fruit or exercise coins. Collecting a coin pauses the game and shows a tongue-exercise illustration; Space marks it done and resumes.

## Stack
- Phaser 3.80.1 + Vite 5.4.0, plain JavaScript (ES modules)
- `npm run dev` — dev server
- No test suite

## Coordinate system
- Logical canvas: 400×240, zoom:2 → displays at 800×480
- All coordinates in logical pixels; never work in display pixels
- `pixelArt: true`, `gravity.y: 400`, logical tile = 16px, world = 2048×240

## Source layout
```
src/
  main.js                  Phaser game config
  constants.js             TILE, WORLD_W/H, GROUND_Y, speeds, jump vels
  scenes/
    BootScene.js           load all assets → extract terrain tile → register exercise textures → define anims → initSounds → start GameScene
    GameScene.js           platforms, player, fruit/box/coin groups, camera, dust emitter, triggerExercise(), finish detection
  objects/
    Player.js              Ninja Frog: run/jump/double-jump/wall-jump/coyote-time state machine, _inputDisabled flag
    Fruit.js               animated sprite, collect() → sparkle anim → destroy
    Box.js                 hit-from-below detection, hit→break anim sequence, spawns fruit or coin
    ExerciseCoin.js        gold coin texture (generated once), float tween + spawn scale anim, disables body on overlap
  data/
    level.js               FRUITS, BOXES, COINS spawn lists [{x,y,type}]
    exercises.js           EXERCISES array: {key, label, drawCanvas(ctx)} — 5 tongue exercises
  ui/
    ExerciseOverlay.js     pause overlay: backdrop + card + illustration zoom + countdown (5→0) + reward
    ScoreHUD.js            top-right score counter (current / total), bumps on collect
    FinishOverlay.js       end-of-level screen: confetti, score, Space to restart
  utils/
    sounds.js              Web Audio API synthesizer — initSounds() + SFX object
assets/PixelAdventure/     sprite pack (do not modify)
```

## Key implementation details

### Physics
- Terrain uses `StaticGroup`. Each platform generates a `plat-${w}` texture sized exactly `w×TILE` so the StaticBody inherits the correct dimensions automatically — do not call `setSize` + `refreshBody()` on static bodies (refreshBody resets size from texture).
- Boxes use `physics.add.overlap` (not collider) — player passes through; hit is detected by `velocity.y < -20 && player.body.y > box.body.y`.

### Exercise textures
- Drawn with HTML Canvas 2D API in `exercises.js`, registered via `textures.addCanvas(key, canvas)` in BootScene.
- tongue-nose draws the tongue **before** `drawBase()` so the face overlaps the tongue root; all others draw tongue after.

### Exercise overlay
- `new ExerciseOverlay(scene, coin)` — called from `GameScene.triggerExercise(coin)`
- Pauses `scene.physics` + `scene.anims`, sets `player._inputDisabled = true`
- 400ms delay before Space listener to prevent accidental skip
- Space starts a 5-second countdown (SFX.tick each second); at 0 → SFX.reward + "SUPER!" + auto-dismiss after 800ms
- On dismiss: 180ms input lockout so Space can't also trigger a jump

### Sound engine
- `src/utils/sounds.js` — no audio files; all SFX synthesized via Web Audio API (square-wave oscillator + gain envelope)
- `initSounds(scene)` — called once in `BootScene.create()`; binds module-level `_scene` to Phaser's `AudioContext`
- `blip(freq, endFreq, duration, startOffset, vol)` — core primitive: linear frequency ramp + exponential gain decay
- `SFX` object — named callables used across the codebase:

| Key | Callers | Character |
|-----|---------|-----------|
| `jump` | Player.js | rising pitch |
| `doublejump` | Player.js | higher rising pitch |
| `land` | GameScene.js | falling thud |
| `fruit` | Fruit.js | bright chime |
| `boxHit` | Box.js | two-layer crunch |
| `coin` | GameScene.js | two-stage ascending ring |
| `tick` | ExerciseOverlay.js | short click (each countdown second) |
| `reward` | ExerciseOverlay.js | C–E–G–C arpeggio (exercise complete) |
| `fanfare` | GameScene.js | C-major scale ascent (level complete) |

### Player input
- `player._inputDisabled = true/false` disables the full `update()` loop
- Jump keys: Up, Space, W
- Wall jump fires when in-air + touching wall + jump pressed; locks horizontal input for 18 frames
- Double-jump and wall-jump animations lock `_animLocked`; released on `animationcomplete`

## Stage status
- Stage 1 (character + terrain) — done
- Stage 2 (fruits) — done
- Stage 3 (boxes + coins) — done
- Stage 4 (exercise overlay) — done
- Stage 5 (level polish: coyote time, spawn anim, dust particles, sound engine) — done
- Stage 6 (ScoreHUD, FinishOverlay, exercise countdown) — done
- Stage 7 (?) — not started
