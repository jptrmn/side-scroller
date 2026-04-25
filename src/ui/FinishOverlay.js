import Phaser from 'phaser';

const TINTS = [0xff4444, 0x44dd44, 0x4488ff, 0xffee44, 0xff44ff, 0x44ffee, 0xffa500, 0xffffff];

export default class FinishOverlay {
  constructor(scene, score, total) {
    this._scene    = scene;
    this._objs     = [];
    this._emitters = [];
    const cx = 200, cy = 120;

    // Backdrop
    const bd = scene.add.rectangle(cx, cy, 400, 240, 0x000000)
      .setScrollFactor(0).setDepth(65).setAlpha(0);
    this._track(bd);
    scene.tweens.add({ targets: bd, alpha: 0.78, duration: 300 });

    this._launchCannons();

    // Card
    const cardGfx = scene.add.graphics().setScrollFactor(0).setDepth(67).setAlpha(0);
    this._track(cardGfx);
    cardGfx.fillStyle(0xfff7ee);
    cardGfx.fillRoundedRect(cx - 80, cy - 80, 160, 160, 12);
    cardGfx.lineStyle(3, 0xddaa66);
    cardGfx.strokeRoundedRect(cx - 80, cy - 80, 160, 160, 12);
    scene.tweens.add({ targets: cardGfx, alpha: 1, duration: 280, delay: 200 });

    // Title
    const title = scene.add.text(cx, cy - 38, 'LEVEL\nGESCHAFFT!', {
      fontSize: '14px',
      fontFamily: 'Arial Black, Arial',
      fontStyle: 'bold',
      color: '#553300',
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(68).setAlpha(0);
    this._track(title);
    scene.tweens.add({ targets: title, alpha: 1, duration: 250, delay: 350 });

    // Score line
    const scoreLine = scene.add.text(cx, cy + 10,
      `Du hast ${score} von ${total} Punkten!`, {
        fontSize: '8px',
        fontFamily: 'Arial Black, Arial',
        fontStyle: 'bold',
        color: '#553300',
        align: 'center',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(68).setAlpha(0);
    this._track(scoreLine);
    scene.tweens.add({ targets: scoreLine, alpha: 1, duration: 250, delay: 500 });

    // Prompt
    const prompt = scene.add.text(cx, cy + 50, 'LEERTASTE  =  Nochmal?', {
      fontSize: '7px',
      fontFamily: 'Arial',
      color: '#226622',
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(68).setAlpha(0);
    this._track(prompt);

    scene.tweens.add({
      targets: prompt, alpha: 1, duration: 200, delay: 700,
      onComplete: () => {
        scene.tweens.add({
          targets: prompt,
          alpha: 0.15,
          duration: 550,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
        scene.time.delayedCall(400, () => {
          scene.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .once('down', () => {
              this._emitters.forEach(e => e.destroy());
              scene.scene.restart();
            });
        });
      },
    });
  }

  _launchCannons() {
    const scene = this._scene;

    // Left cannon — bottom-left, fan upward-right
    const left = scene.add.particles(22, 252, 'dust', {
      tint:     TINTS,
      speed:    { min: 150, max: 280 },
      angle:    { min: 282, max: 342 },
      scaleX:   { min: 1.0, max: 3.2 },
      scaleY:   { min: 0.3, max: 1.0 },
      rotate:   { min: -180, max: 180 },
      lifespan: { min: 1600, max: 2800 },
      gravityY: 220,
      emitting: false,
    }).setScrollFactor(0).setDepth(66);
    this._emitters.push(left);

    // Right cannon — bottom-right, fan upward-left
    const right = scene.add.particles(378, 252, 'dust', {
      tint:     TINTS,
      speed:    { min: 150, max: 280 },
      angle:    { min: 198, max: 258 },
      scaleX:   { min: 1.0, max: 3.2 },
      scaleY:   { min: 0.3, max: 1.0 },
      rotate:   { min: -180, max: 180 },
      lifespan: { min: 1600, max: 2800 },
      gravityY: 220,
      emitting: false,
    }).setScrollFactor(0).setDepth(66);
    this._emitters.push(right);

    // Initial blast
    left.explode(40);
    right.explode(40);

    // Four follow-up salvos
    scene.time.addEvent({
      delay: 1100,
      repeat: 4,
      callback: () => {
        left.explode(22);
        right.explode(22);
      },
    });

    // Firework pops across the upper screen, staggered
    const pops = [[80, 45], [320, 50], [200, 35], [110, 80], [295, 68], [200, 52]];
    pops.forEach(([x, y], i) => {
      scene.time.delayedCall(200 + i * 380, () => {
        const fw = scene.add.particles(x, y, 'dust', {
          tint:     TINTS,
          speed:    { min: 55, max: 140 },
          angle:    { min: 0,   max: 360 },
          scale:    { start: 2.2, end: 0 },
          alpha:    { start: 1,   end: 0 },
          lifespan: { min: 380,  max: 680 },
          gravityY: 55,
          emitting: false,
        }).setScrollFactor(0).setDepth(66);
        fw.explode(24);
        this._emitters.push(fw);
        scene.time.delayedCall(800, () => {
          const idx = this._emitters.indexOf(fw);
          if (idx !== -1) this._emitters.splice(idx, 1);
          fw.destroy();
        });
      });
    });
  }

  _track(obj) { this._objs.push(obj); return obj; }
}
