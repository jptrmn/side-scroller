let _scene = null;

export function initSounds(scene) {
  _scene = scene;
}

function blip(freq, endFreq, duration, startOffset = 0, vol = 0.22) {
  const ctx = _scene?.sound?.context;
  if (!ctx) return;
  const t    = ctx.currentTime + startOffset;
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.linearRampToValueAtTime(endFreq, t + duration);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration);
}

export const SFX = {
  jump:       () => blip(380,  640, 0.10),
  doublejump: () => blip(560,  860, 0.08),
  land:       () => blip(260,   70, 0.09),
  fruit:      () => blip(860, 1150, 0.13),
  boxHit:     () => { blip(220, 90, 0.12); blip(160, 50, 0.10, 0.03, 0.15); },
  coin:       () => { blip(880, 1760, 0.05, 0, 0.22); blip(1760, 1760, 0.12, 0.06, 0.18); },
  tick:       () => blip(660, 440, 0.04, 0, 0.12),
  reward:     () => {
    blip(523,  523,  0.09, 0.00, 0.22);
    blip(659,  659,  0.09, 0.10, 0.22);
    blip(784,  784,  0.09, 0.20, 0.22);
    blip(1047, 1047, 0.22, 0.30, 0.22);
  },
  fanfare:    () => {
    const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
    notes.forEach((f, i) => blip(f, f, i < 7 ? 0.09 : 0.30, i * 0.10, 0.22));
  },
};
