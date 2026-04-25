import Phaser from 'phaser';

export default class ExerciseCoin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    if (!scene.textures.exists('exercise-coin')) {
      const gfx = scene.add.graphics();
      gfx.fillStyle(0xffd700);
      gfx.fillCircle(8, 8, 7);
      gfx.fillStyle(0xffaa00);
      gfx.fillCircle(8, 8, 4);
      gfx.fillStyle(0xffff99, 0.9);
      gfx.fillCircle(6, 6, 2);
      gfx.generateTexture('exercise-coin', 16, 16);
      gfx.destroy();
    }

    super(scene, x, y, 'exercise-coin');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.setSize(14, 14);

    // Gentle float tween
    scene.tweens.add({
      targets: this,
      y: y - 5,
      duration: 900,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }
}
