import Phaser from 'phaser';
import { BOX_FRUIT_CHANCE } from '../constants.js';
import { SFX } from '../utils/sounds.js';

const FRUIT_TYPES = ['apple', 'banana', 'cherry', 'kiwi', 'melon', 'orange', 'pineapple', 'strawberry'];

export default class Box extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 1) {
    super(scene, x, y, `box${type}-idle`);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);  // static body

    this._type = type;
    this._breaking = false;
  }

  hitFromBelow(spawnCallback) {
    if (this._breaking) return;
    this._breaking = true;
    this.body.enable = false;
    SFX.boxHit();
    this.play(`box${this._type}-hit`);
    this.once('animationcomplete', () => {
      this.play(`box${this._type}-break`);
      this.once('animationcomplete', () => {
        const isExercise = Math.random() >= BOX_FRUIT_CHANCE;
        const spawnType = isExercise
          ? 'exercise'
          : FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];

        if (spawnCallback) spawnCallback(this.x, this.y - 20, spawnType);
        this.destroy();
      });
    });
  }
}
