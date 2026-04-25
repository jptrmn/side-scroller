import Phaser from 'phaser';
import Player from '../objects/Player.js';
import Fruit from '../objects/Fruit.js';
import Box from '../objects/Box.js';
import ExerciseCoin from '../objects/ExerciseCoin.js';
import ExerciseOverlay from '../ui/ExerciseOverlay.js';
import ScoreHUD from '../ui/ScoreHUD.js';
import FinishOverlay from '../ui/FinishOverlay.js';
import { TILE, WORLD_W, WORLD_H, GROUND_Y } from '../constants.js';
import { SFX } from '../utils/sounds.js';
import { FRUITS, BOXES, COINS } from '../data/level.js';

// [x, y, widthInTiles]  —  x/y in logical pixels, y = top surface of platform
const PLATFORMS = [
  [0,    GROUND_Y, 128],  // ground (full width)
  [180,  192,  5],
  [340,  176,  5],
  [520,  192,  4],
  [680,  160,  4],
  [840,  176,  6],
  [480,  208,  3],        // low stepping stone
  [1020, 160,  4],
  [1160, 192,  5],
  [1320, 176,  4],
  [1480, 160,  6],
  [1660, 192,  5],
  [1840, 176,  8],
];

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    // Background: fixed to camera, parallax via tilePositionX
    this.bg = this.add.tileSprite(0, 0, 400, 240, 'bg-green')
      .setOrigin(0, 0)
      .setScrollFactor(0);

    // Terrain
    this.terrain = this.physics.add.staticGroup();
    for (const [x, y, w] of PLATFORMS) {
      this._makePlatform(x, y, w);
    }

    // Player — spawns above ground and falls into place
    this.player = new Player(this, 48, 180);

    this.physics.add.collider(this.player, this.terrain);

    this._dustEmitter = this.add.particles(0, 0, 'dust', {
      speed:    { min: 20, max: 55 },
      angle:    { min: 200, max: 340 },
      scale:    { start: 1, end: 0 },
      lifespan: 320,
      gravityY: 80,
      emitting: false,
    });
    this._playerWasOnGround = false;

    // Fruits
    this.fruitGroup = this.add.group();
    for (const fd of FRUITS) {
      this.fruitGroup.add(new Fruit(this, fd.x, fd.y, fd.type));
    }
    this.physics.add.overlap(this.player, this.fruitGroup, (_player, fruit) => {
      fruit.collect();
      this.hud.add(1);
    });

    // Boxes — overlap-only (no collision): player passes through from below,
    // hit is detected by upward velocity + player center below box center.
    this.boxGroup = this.add.group();
    for (const bd of BOXES) {
      this.boxGroup.add(new Box(this, bd.x, bd.y, bd.type));
    }
    this.physics.add.overlap(
      this.player,
      this.boxGroup,
      (_player, box) => {
        if (this.player.body.velocity.y < -20 && this.player.body.y > box.body.y) {
          box.hitFromBelow((x, y, spawnType) => this._spawnFromBox(x, y, spawnType));
        }
      },
    );

    // Exercise coins — pre-placed in level + spawned dynamically when boxes break
    this.coinGroup = this.add.group();
    for (const cd of COINS) {
      this.coinGroup.add(new ExerciseCoin(this, cd.x, cd.y));
    }
    this.physics.add.overlap(this.player, this.coinGroup, (_player, coin) => {
      if (coin.body?.enable) this.triggerExercise(coin);
    });

    const initialTotal = FRUITS.length * 1 + COINS.length * 5;
    this.hud = new ScoreHUD(this, initialTotal);
    this._finished = false;

    this.cameras.main
      .setBounds(0, 0, WORLD_W, WORLD_H)
      .startFollow(this.player, true, 0.08, 0.08);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  _makePlatform(x, y, widthInTiles) {
    const w  = widthInTiles * TILE;
    const cx = x + w / 2;
    const cy = y + TILE / 2;

    // Visual — grass cap + earth fill
    if (w >= 3 * TILE) {
      this.add.image(x, y, 'tile-tl').setOrigin(0, 0);
      this.add.tileSprite(x + TILE, y, w - 2 * TILE, TILE, 'tile-top').setOrigin(0, 0);
      this.add.image(x + w - TILE, y, 'tile-tr').setOrigin(0, 0);
    } else {
      this.add.tileSprite(x, y, w, TILE, 'tile-top').setOrigin(0, 0);
    }
    // Earth fill row — purely decorative, hangs below the physics body
    this.add.tileSprite(x, y + TILE, w, TILE, 'tile-fill').setOrigin(0, 0);

    // Physics: generate a w×TILE texture so StaticBody gets the exact right size.
    const texKey = `plat-${w}`;
    if (!this.textures.exists(texKey)) {
      const gfx = this.add.graphics();
      gfx.fillStyle(0xffffff);
      gfx.fillRect(0, 0, w, TILE);
      gfx.generateTexture(texKey, w, TILE);
      gfx.destroy();
    }

    const ph = this.terrain.create(cx, cy, texKey);
    ph.setAlpha(0);
    ph.refreshBody();
  }

  _spawnFromBox(x, y, spawnType) {
    if (spawnType === 'exercise') {
      const coin = new ExerciseCoin(this, x, y);
      this.coinGroup.add(coin);
      this.hud.addToTotal(5);
    } else {
      const fruit = new Fruit(this, x, y, spawnType);
      this.fruitGroup.add(fruit);
      this.hud.addToTotal(1);
    }
  }

  triggerExercise(coin) {
    coin.body.enable = false;
    SFX.coin();
    this.hud.add(5);
    new ExerciseOverlay(this, coin);
  }

  update() {
    this.player.update(this.cursors);
    this.bg.tilePositionX = this.cameras.main.scrollX * 0.25;

    const nowOnGround = this.player.body.blocked.down;
    if (!this._playerWasOnGround && nowOnGround) {
      this._dustEmitter.explode(6, this.player.x, this.player.y + 14);
      SFX.land();
    }
    this._playerWasOnGround = nowOnGround;

    if (!this._finished && this.player.x > WORLD_W - 80) {
      this._finished = true;
      this.player._inputDisabled = true;
      this.physics.pause();
      this.anims.pauseAll();
      SFX.fanfare();
      new FinishOverlay(this, this.hud.current, this.hud.total);
    }
  }
}
