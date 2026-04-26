# Sound Engine

All sound effects are synthesized at runtime via the Web Audio API. No audio files — every sound is generated from code in `src/utils/sounds.js`.

---

## How it works

The engine exposes one primitive function: **`blip()`**. Every SFX is one or more `blip()` calls scheduled on a shared `AudioContext`.

```
blip(freq, endFreq, duration, startOffset, vol)
  │
  ├─ OscillatorNode (square wave)
  │     frequency: freq → linearRamp → endFreq  over `duration` seconds
  │
  └─ GainNode
        gain: vol → exponentialRamp → ~0          over `duration` seconds
```

A square wave has a bright, buzzy, 8-bit character. The frequency sweeps linearly from start to end while the volume decays exponentially from full to silence — so the sound always self-terminates cleanly with no click.

---

## The `blip()` parameters

```js
blip(freq, endFreq, duration, startOffset = 0, vol = 0.22)
```

| Parameter | Unit | What it controls |
|-----------|------|-----------------|
| `freq` | Hz | Starting pitch |
| `endFreq` | Hz | Ending pitch (linear sweep over `duration`) |
| `duration` | seconds | How long the sound lasts |
| `startOffset` | seconds | When to start, relative to *now* — use this to sequence multiple blips |
| `vol` | 0–1 | Peak volume at the moment the sound starts |

### Frequency → pitch direction

| freq vs endFreq | Character | Used for |
|-----------------|-----------|----------|
| `freq < endFreq` | rising sweep | jump, collect, positive feedback |
| `freq > endFreq` | falling sweep | land, thud, crunch |
| `freq === endFreq` | pure tone (no sweep) | notes in a melody |

### Volume guide

`0.22` is the default — comfortable for a game. Keep individual blips below `0.30` to avoid harshness. When stacking multiple simultaneous blips (e.g. `boxHit`), lower each slightly so they don't clip.

### Duration guide

| Range | Feel |
|-------|------|
| 0.03–0.06 s | instant click / tick |
| 0.08–0.13 s | snappy hit / collect |
| 0.18–0.22 s | sustained note |
| 0.25–0.35 s | long final note |

---

## Note → Hz reference

Musical notes are just frequencies. The reward and fanfare sounds use these:

| Note | Hz |
|------|----|
| C5   | 523 |
| D5   | 587 |
| E5   | 659 |
| F5   | 698 |
| G5   | 784 |
| A5   | 880 |
| B5   | 988 |
| C6   | 1047 |
| C4   | 262 |
| G4   | 392 |
| A4   | 440 |

For pitches between notes (or sound-design frequencies that aren't musical), just use any Hz value — `blip` doesn't care.

---

## All current SFX

```js
jump:       blip(380,  640, 0.10)             // short rising sweep
doublejump: blip(560,  860, 0.08)             // higher, quicker rising sweep
land:       blip(260,   70, 0.09)             // falling thud
fruit:      blip(860, 1150, 0.13)             // bright rising chime
boxHit:     blip(220, 90, 0.12)              // low crunch layer 1
          + blip(160, 50, 0.10, 0.03, 0.15)  // lower crunch layer 2, offset 30ms
coin:       blip(880, 1760, 0.05)             // quick octave jump
          + blip(1760, 1760, 0.12, 0.06)      // sustained high ring, offset 60ms
tick:       blip(660, 440, 0.04, 0, 0.12)    // short falling click, quieter
reward:     blip(523, 523, 0.09, 0.00)        // C5 — arpeggio note 1
          + blip(659, 659, 0.09, 0.10)        // E5 — note 2, +100ms
          + blip(784, 784, 0.09, 0.20)        // G5 — note 3, +200ms
          + blip(1047,1047, 0.22, 0.30)       // C6 — note 4 (long), +300ms
fanfare:    C5 D5 E5 F5 G5 A5 B5 C6          // C-major scale, 100ms apart,
            each 90ms except final note 300ms // final note held longer
```

---

## How to edit an existing sound

Open `src/utils/sounds.js` and find the entry in `SFX`. Changes take effect immediately on the dev server — just reload the browser.

**Make it higher-pitched:** increase both `freq` and `endFreq` proportionally.  
**Make it lower:** decrease both.  
**Longer / shorter:** change `duration`.  
**Punchier sweep:** widen the gap between `freq` and `endFreq`.  
**Flatter / more tonal:** narrow the gap (or make them equal for a pure note).  
**Quieter:** lower `vol`. Don't go above ~0.30 for a single blip.

Example — making `fruit` feel more "sparkly" (higher, faster, wider sweep):
```js
// before
fruit: () => blip(860, 1150, 0.13),

// after: starts higher, sweeps further, slightly shorter
fruit: () => blip(1000, 1600, 0.10),
```

---

## How to add a new sound

**1. Add a key to `SFX`** in `src/utils/sounds.js`:

```js
export const SFX = {
  // ... existing entries ...
  mySound: () => blip(440, 880, 0.12),
};
```

**2. Call it** from wherever the event happens:

```js
import { SFX } from '../utils/sounds.js';

// somewhere in your game object or scene:
SFX.mySound();
```

That's it. `initSounds()` has already bound the `AudioContext` at boot.

---

## How to compose a multi-note or layered sound

Pass a `startOffset` (seconds) to stagger blips. All scheduled at the same moment via the Web Audio clock — no `setTimeout` needed.

**Layered hit** (two simultaneous tones for a richer crunch):
```js
myHit: () => {
  blip(300, 100, 0.15);               // main thud
  blip(200,  60, 0.12, 0.02, 0.15);  // sub layer, 20ms later, slightly quieter
},
```

**Short melody** (four notes, 80ms apart):
```js
melody: () => {
  blip(523, 523, 0.10, 0.00);   // C5
  blip(659, 659, 0.10, 0.08);   // E5
  blip(784, 784, 0.10, 0.16);   // G5
  blip(523, 523, 0.20, 0.24);   // C5 again, longer
},
```

**Rising fanfare pattern** (loop over a note array):
```js
const notes = [262, 330, 392, 523];   // C4 E4 G4 C5
notes.forEach((f, i) =>
  blip(f, f, i < 3 ? 0.08 : 0.25, i * 0.09, 0.22)
);
```

---

## Limitations

- **Square wave only.** The oscillator type is hardcoded to `'square'`. Changing it to `'sine'` gives a softer, rounder tone; `'sawtooth'` gives a buzzier, more aggressive one. Edit the `osc.type` line in `blip()` to experiment — but note this affects all sounds globally.
- **Mono.** All sounds go to `ctx.destination` with no panning.
- **No loop / sustain.** `blip()` always decays to silence within `duration`. For looping sounds (e.g. background music), a different approach would be needed.
- **AudioContext autoplay policy.** Browsers require a user gesture before audio can play. Phaser handles this automatically — the context is unlocked on the first click or key press.
