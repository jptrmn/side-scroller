import Phaser from 'phaser';
import { EXERCISES } from '../data/exercises.js';

const PA = 'assets/PixelAdventure';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const frog = `${PA}/Main Characters/Ninja Frog`;

    this.load.spritesheet('frog-idle',       `${frog}/Idle (32x32).png`,        { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('frog-run',        `${frog}/Run (32x32).png`,         { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('frog-jump',       `${frog}/Jump (32x32).png`,        { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('frog-fall',       `${frog}/Fall (32x32).png`,        { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('frog-doublejump', `${frog}/Double Jump (32x32).png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('frog-walljump',   `${frog}/Wall Jump (32x32).png`,   { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('frog-hit',        `${frog}/Hit (32x32).png`,         { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('terrain', `${PA}/Terrain/Terrain (16x16).png`, { frameWidth: 16, frameHeight: 16 });
    this.load.image('bg-blue',  `${PA}/Background/Blue.png`);
    this.load.image('bg-green', `${PA}/Background/Green.png`);

    // Fruits — all 17 frames @ 32×32; filename differs slightly from type key
    const fruits = `${PA}/Items/Fruits`;
    this.load.spritesheet('fruit-apple',      `${fruits}/Apple.png`,      { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fruit-banana',     `${fruits}/Bananas.png`,    { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fruit-cherry',     `${fruits}/Cherries.png`,   { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fruit-kiwi',       `${fruits}/Kiwi.png`,       { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fruit-melon',      `${fruits}/Melon.png`,      { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fruit-orange',     `${fruits}/Orange.png`,     { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fruit-pineapple',  `${fruits}/Pineapple.png`,  { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fruit-strawberry', `${fruits}/Strawberry.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fruit-collected',  `${fruits}/Collected.png`,  { frameWidth: 32, frameHeight: 32 });

    // Boxes — Idle is a single image; Hit=3 frames, Break=4 frames, all at 28×24
    const boxes = `${PA}/Items/Boxes`;
    for (const n of [1, 2, 3]) {
      this.load.image(      `box${n}-idle`,  `${boxes}/Box${n}/Idle.png`);
      this.load.spritesheet(`box${n}-hit`,   `${boxes}/Box${n}/Hit (28x24).png`,  { frameWidth: 28, frameHeight: 24 });
      this.load.spritesheet(`box${n}-break`, `${boxes}/Box${n}/Break.png`,        { frameWidth: 28, frameHeight: 24 });
    }
  }

  create() {
    this._registerTerrainTiles();
    this._registerExerciseTextures();
    this._defineAnims();
    this.scene.start('GameScene');
  }

  _registerExerciseTextures() {
    for (const { key, drawCanvas } of EXERCISES) {
      const canvas = document.createElement('canvas');
      canvas.width  = 64;
      canvas.height = 64;
      drawCanvas(canvas.getContext('2d'));
      this.textures.addCanvas(key, canvas);
    }
  }

  _registerTerrainTiles() {
    const src = this.textures.get('terrain').getSourceImage();
    const extract = (col, row, key) => {
      const c = document.createElement('canvas');
      c.width = 16; c.height = 16;
      c.getContext('2d').drawImage(src, col * 16, row * 16, 16, 16, 0, 0, 16, 16);
      this.textures.addCanvas(key, c);
    };
    extract(5, 0, 'tile-tl');
    extract(6, 0, 'tile-top');
    extract(7, 0, 'tile-tr');
    extract(6, 1, 'tile-fill');
  }

  _defineAnims() {
    const { anims } = this;

    anims.create({ key: 'frog-idle',       frames: anims.generateFrameNumbers('frog-idle',       { start: 0, end: 10 }), frameRate: 11, repeat: -1 });
    anims.create({ key: 'frog-run',        frames: anims.generateFrameNumbers('frog-run',        { start: 0, end: 11 }), frameRate: 12, repeat: -1 });
    anims.create({ key: 'frog-jump',       frames: anims.generateFrameNumbers('frog-jump',       { start: 0, end: 0  }), frameRate:  1, repeat:  0 });
    anims.create({ key: 'frog-fall',       frames: anims.generateFrameNumbers('frog-fall',       { start: 0, end: 0  }), frameRate:  1, repeat:  0 });
    anims.create({ key: 'frog-doublejump', frames: anims.generateFrameNumbers('frog-doublejump', { start: 0, end: 5  }), frameRate: 12, repeat:  0 });
    anims.create({ key: 'frog-walljump',   frames: anims.generateFrameNumbers('frog-walljump',   { start: 0, end: 4  }), frameRate: 10, repeat:  0 });
    anims.create({ key: 'frog-hit',        frames: anims.generateFrameNumbers('frog-hit',        { start: 0, end: 6  }), frameRate: 10, repeat:  0 });

    // Fruits — 17 looping frames each
    for (const type of ['apple', 'banana', 'cherry', 'kiwi', 'melon', 'orange', 'pineapple', 'strawberry']) {
      anims.create({ key: `fruit-${type}`, frames: anims.generateFrameNumbers(`fruit-${type}`, { start: 0, end: 16 }), frameRate: 8, repeat: -1 });
    }
    // Collected sparkle — plays once then sprite destroys itself
    anims.create({ key: 'fruit-collected', frames: anims.generateFrameNumbers('fruit-collected', { start: 0, end: 5 }), frameRate: 12, repeat: 0 });

    // Boxes — hit (3 frames) then break (4 frames), each plays once
    for (const n of [1, 2, 3]) {
      anims.create({ key: `box${n}-hit`,   frames: anims.generateFrameNumbers(`box${n}-hit`,   { start: 0, end: 2 }), frameRate: 12, repeat: 0 });
      anims.create({ key: `box${n}-break`, frames: anims.generateFrameNumbers(`box${n}-break`, { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
    }
  }
}
