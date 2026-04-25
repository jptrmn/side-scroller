import Phaser from 'phaser';

export default class Fruit extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, `fruit-${type}`);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    // Tight hitbox so collection feels fair, not frustrating
    this.body.setSize(16, 16);

    this.play(`fruit-${type}`);
  }

  collect() {
    this.body.enable = false;  // prevent double-collection
    this.play('fruit-collected', true);
    this.once('animationcomplete', () => this.destroy());
  }
}
