# Pitzi Side-Scroller — Claude Context

## Project
Speech-therapy platformer by Pitzi-Games Studios. Ninja Frog runs, jumps, collects fruit, hits boxes. Boxes spawn fruit or exercise coins. Collecting a coin pauses the game and shows a tongue-exercise illustration; the child holds the position through a 5-second countdown, then the game resumes.

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
  constants.js             TILE, WORLD_W/H, GROUND_Y, speeds, jump vels, BOX_FRUIT_CHANCE
  scenes/
    BootScene.js           load all assets (incl. 'zunge' spritesheet) → terrain tiles →
                           dust texture → define anims → initSounds → start GameScene
    GameScene.js           platforms, player, fruit/box/coin groups, camera, dust emitter,
                           triggerExercise(), _checkFinish(), _overlayActive flag
  objects/
    Player.js              Ninja Frog: run/jump/double-jump/wall-jump/coyote-time state machine,
                           _inputDisabled flag
    Fruit.js               animated sprite, collect() → sparkle anim → destroy
    Box.js                 spawnType pre-rolled in constructor; hit-from-below → hit+break anim → spawn
    ExerciseCoin.js        gold coin texture (generated once), float tween + spawn scale anim,
                           disables body on overlap
  data/
    level.js               FRUITS, BOXES, COINS spawn lists [{x,y,type}]
    exercises.js           EXERCISES array: {frame, label} — 6 entries, index into 'zunge' spritesheet
  ui/
    ExerciseOverlay.js     pause overlay: backdrop + card + sprite zoom + countdown (5→0) + reward
                           on dismiss: clears _overlayActive, calls _checkFinish()
    ScoreHUD.js            top-right score counter (current / total), bumps on collect
    FinishOverlay.js       end-of-level: confetti cannons + firework pops, score, Space to restart
                           resumes anims+physics before restart to avoid frozen-animation bug
  utils/
    sounds.js              Web Audio API synthesizer — initSounds() + SFX object
assets/PixelAdventure/     sprite pack (do not modify)
assets/spritepack-zunge.png  5×2 grid of 290×368 face sprites for exercise illustrations
```

## Key implementation details

### Scoring & finish condition
- Box `spawnType` (`'exercise'` or a fruit type) is **pre-rolled in the constructor** so the full score total is known before the first frame
- `GameScene.create()` computes `initialTotal = FRUITS.length + COINS.length*5 + boxes.reduce(spawnType === 'exercise' ? 5 : 1)` after all boxes are built
- The HUD total is fixed — it never changes during play
- Game ends when `hud.current >= hud.total` (all collectibles gathered), NOT on player position
- `_checkFinish()` is called after every `hud.add()`. If `_overlayActive` is true (ExerciseOverlay is open), the check is deferred — `_dismiss()` calls `_checkFinish()` after closing

### Physics
- Terrain uses `StaticGroup`. Each platform generates a `plat-${w}` texture sized exactly `w×TILE` so the StaticBody inherits the correct dimensions automatically — do not call `setSize` + `refreshBody()` on static bodies (refreshBody resets size from texture).
- Boxes use `physics.add.overlap` (not collider) — player passes through; hit is detected by `velocity.y < -20 && player.body.y > box.body.y`.

### Exercise sprites
- `assets/spritepack-zunge.png` — 1450×736, 5 columns × 2 rows, each cell 290×368
- Loaded as spritesheet key `'zunge'` in BootScene; no canvas drawing needed
- `EXERCISES` entries use `{ frame, label }` where `frame` is the 0-based row-major index
- `ExerciseOverlay` displays via `scene.add.image(x, y, 'zunge', exercise.frame)` at scale 0.27

### Exercise overlay
- `new ExerciseOverlay(scene, coin)` — called from `GameScene.triggerExercise(coin)`
- `triggerExercise` sets `scene._overlayActive = true` **before** `hud.add(5)` so `_checkFinish` is blocked if this was the last item
- Pauses `scene.physics` + `scene.anims`, sets `player._inputDisabled = true`
- 400ms delay before Space listener to prevent accidental skip
- Space starts a 5-second countdown (SFX.tick each second); at 0 → SFX.reward + "SUPER!" + auto-dismiss after 800ms
- On dismiss: `_overlayActive = false`, 180ms input lockout, then `_checkFinish()`

### Scene restart
- `FinishOverlay` calls `scene.anims.resumeAll()` + `scene.physics.resume()` before `scene.scene.restart()`
- Critical: `anims.pauseAll()` sets a global (game-level) flag that survives a scene restart; without resuming first, the new game starts with all animations frozen

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
- Stage 7 (sprite exercises, confetti cannons, pre-calculated score, completion-based finish) — done
- Stage 8 (?) — not started
