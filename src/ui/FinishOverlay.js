export default class FinishOverlay {
  constructor(scene, score, total) {
    this._scene = scene;
    this._objs  = [];
    const cx = 200, cy = 120;

    // Backdrop
    const bd = scene.add.rectangle(cx, cy, 400, 240, 0x000000)
      .setScrollFactor(0).setDepth(65).setAlpha(0);
    this._track(bd);
    scene.tweens.add({ targets: bd, alpha: 0.78, duration: 300 });

    // Confetti — rains from top, reuses the 'dust' texture with tinting
    this._confetti = scene.add.particles(200, -10, 'dust', {
      tint:     [0xff4444, 0x44dd44, 0x4488ff, 0xffee44, 0xff44ff, 0x44ffee],
      speed:    { min: 30, max: 100 },
      angle:    { min: 70, max: 110 },
      scaleX:   { min: 0.5, max: 2.5 },
      scaleY:   { min: 0.5, max: 1.5 },
      lifespan: 3000,
      gravityY: 50,
      frequency: 40,
      quantity:  3,
    }).setScrollFactor(0).setDepth(66);

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
              this._confetti.destroy();
              scene.scene.restart();
            });
        });
      },
    });
  }

  _track(obj) { this._objs.push(obj); return obj; }
}
