export default class ScoreHUD {
  constructor(scene, initialTotal) {
    this.current = 0;
    this.total   = initialTotal;
    this._scene  = scene;

    this._bg   = scene.add.graphics().setScrollFactor(0).setDepth(50);
    this._text = scene.add.text(392, 8, '', {
      fontSize: '8px',
      fontFamily: 'Arial Black, Arial',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(51);

    this._redraw();
  }

  add(pts) {
    this.current += pts;
    this._redraw();
    this._text.setScale(1.4);
    this._scene.tweens.add({
      targets: this._text,
      scaleX: 1, scaleY: 1,
      duration: 180,
      ease: 'Back.Out',
    });
  }

  _redraw() {
    this._text.setText(`${this.current} / ${this.total}`);
    const b = this._text.getBounds();
    this._bg.clear();
    this._bg.fillStyle(0x000000, 0.45);
    this._bg.fillRoundedRect(b.x - 4, b.y - 3, b.width + 8, b.height + 6, 4);
  }
}
