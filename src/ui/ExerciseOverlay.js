import Phaser from 'phaser';
import { EXERCISES } from '../data/exercises.js';
import { SFX } from '../utils/sounds.js';

export default class ExerciseOverlay {
  constructor(scene, coin) {
    this._scene  = scene;
    this._coin   = coin;
    this._objs   = [];
    this._illo   = null;

    scene.physics.pause();
    scene.anims.pauseAll();
    scene.player._inputDisabled = true;

    this._exercise = EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
    this._show();
  }

  _show() {
    const scene = this._scene;
    const cam   = scene.cameras.main;
    const cx    = 200, cy = 120;
    const cardW = 112, cardH = 148;

    // ── Coin: shrink and disappear ──────────────────────────────────────────
    scene.tweens.add({
      targets: this._coin,
      scaleX: 0, scaleY: 0,
      alpha: 0,
      duration: 200,
      ease: 'Back.easeIn',
    });

    // ── Dark backdrop ────────────────────────────────────────────────────────
    const backdrop = scene.add.rectangle(cx, cy, 400, 240, 0x000000)
      .setScrollFactor(0).setDepth(60).setAlpha(0);
    this._track(backdrop);
    scene.tweens.add({ targets: backdrop, alpha: 0.72, duration: 220 });

    // ── Card ─────────────────────────────────────────────────────────────────
    const cardGfx = scene.add.graphics()
      .setScrollFactor(0).setDepth(61).setAlpha(0);
    this._track(cardGfx);
    cardGfx.fillStyle(0xfff7ee);
    cardGfx.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 10);
    cardGfx.lineStyle(3, 0xddaa66);
    cardGfx.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 10);
    scene.tweens.add({ targets: cardGfx, alpha: 1, duration: 220, delay: 160 });

    // ── Illustration — zooms in from coin world-position ─────────────────────
    const coinScreenX = this._coin.x - cam.scrollX;
    const coinScreenY = this._coin.y - cam.scrollY;

    this._illo = scene.add.image(coinScreenX, coinScreenY, this._exercise.key)
      .setScrollFactor(0).setDepth(62).setScale(0.15).setAlpha(0);
    this._track(this._illo);

    scene.tweens.add({
      targets: this._illo,
      x: cx, y: cy - 20,
      scaleX: 1.25, scaleY: 1.25,
      alpha: 1,
      duration: 380,
      delay: 260,
      ease: 'Back.easeOut',
      onComplete: () => this._showText(),
    });
  }

  _showText() {
    const scene = this._scene;
    const cx = 200, cy = 120;

    const nameText = scene.add.text(cx, cy + 50, this._exercise.label, {
      fontSize: '9px',
      fontFamily: 'Arial Black, Arial',
      fontStyle: 'bold',
      color: '#553300',
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(62).setAlpha(0);
    this._track(nameText);

    const prompt = scene.add.text(cx, cy + 65, 'LEERTASTE  =  Start  ▶', {
      fontSize: '7px',
      fontFamily: 'Arial',
      color: '#226622',
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(62).setAlpha(0);
    this._track(prompt);

    scene.tweens.add({ targets: nameText, alpha: 1, duration: 200 });
    scene.tweens.add({
      targets: prompt, alpha: 1, duration: 200, delay: 120,
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
            .once('down', () => this._startCountdown(prompt));
        });
      },
    });
  }

  _startCountdown(promptObj) {
    const scene = this._scene;
    const cx = 200, cy = 120;

    scene.tweens.killTweensOf(promptObj);
    scene.tweens.add({ targets: promptObj, alpha: 0, duration: 150 });

    let count = 5;
    const countText = scene.add.text(cx, cy + 58, '5', {
      fontSize: '22px',
      fontFamily: 'Arial Black, Arial',
      fontStyle: 'bold',
      color: '#553300',
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(62).setScale(1.8);
    this._track(countText);

    scene.tweens.add({ targets: countText, scaleX: 1, scaleY: 1, duration: 200, ease: 'Back.Out' });
    SFX.tick();

    const tick = () => {
      count--;
      if (count <= 0) {
        countText.setText('0');
        scene.tweens.add({
          targets: countText,
          scaleX: 1.5, scaleY: 1.5,
          duration: 120,
          ease: 'Quad.Out',
          onComplete: () => this._showReward(countText),
        });
        return;
      }
      countText.setText(String(count));
      countText.setScale(1.5);
      scene.tweens.add({ targets: countText, scaleX: 1, scaleY: 1, duration: 200, ease: 'Back.Out' });
      SFX.tick();
    };

    scene.time.addEvent({ delay: 1000, callback: tick, repeat: 4 });
  }

  _showReward(countText) {
    const scene = this._scene;
    const cx = 200, cy = 120;

    SFX.reward();
    scene.tweens.add({ targets: countText, alpha: 0, duration: 150 });

    scene.tweens.add({
      targets: this._illo,
      scaleX: 1.6, scaleY: 1.6,
      duration: 200,
      ease: 'Quad.Out',
      yoyo: true,
      onComplete: () => { this._illo.setScale(1.25); },
    });

    const doneText = scene.add.text(cx, cy + 58, '✓  SUPER!', {
      fontSize: '14px',
      fontFamily: 'Arial Black, Arial',
      fontStyle: 'bold',
      color: '#226622',
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(62).setScale(0);
    this._track(doneText);

    scene.tweens.add({ targets: doneText, scaleX: 1, scaleY: 1, duration: 250, ease: 'Back.Out' });

    scene.time.delayedCall(800, () => this._dismiss());
  }

  _dismiss() {
    const scene = this._scene;
    scene.tweens.add({
      targets: this._objs,
      alpha: 0,
      duration: 220,
      ease: 'Linear',
      onComplete: () => {
        this._objs.forEach(o => o.destroy());
        this._coin.destroy();
        scene.physics.resume();
        scene.anims.resumeAll();
        scene.player._inputDisabled = true;
        scene.time.delayedCall(180, () => {
          scene.player._inputDisabled = false;
        });
      },
    });
  }

  _track(obj) { this._objs.push(obj); return obj; }
}
