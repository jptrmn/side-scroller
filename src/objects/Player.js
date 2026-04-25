import Phaser from 'phaser';
import {
  PLAYER_SPEED,
  JUMP_VEL, DOUBLE_JUMP_VEL,
  WALL_JUMP_VEL_Y, WALL_JUMP_VEL_X, WALL_SLIDE_VEL,
} from '../constants.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'frog-idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Tighter hitbox than the 32×32 sprite frame
    this.body.setSize(20, 28);
    this.body.setOffset(6, 4);
    this.setCollideWorldBounds(true);
    this.setDepth(1);

    this._jumpsLeft = 2;
    this._wasOnGround = false;
    this._wallLockFrames = 0;  // suppresses horizontal input after wall jump
    this._animLocked = false;
    this._inputDisabled = false;

    this.on('animationcomplete', (anim) => {
      if (anim.key === 'frog-doublejump' || anim.key === 'frog-walljump') {
        this._animLocked = false;
      }
    });

    this.play('frog-idle');
  }

  update(cursors) {
    if (this._inputDisabled) return;
    const { body } = this;
    const onGround = body.blocked.down;
    const onLeft   = body.blocked.left;
    const onRight  = body.blocked.right;
    const inAir    = !onGround;

    if (onGround && !this._wasOnGround) {
      this._jumpsLeft = 2;
    }
    this._wasOnGround = onGround;

    const jumpJustDown =
      Phaser.Input.Keyboard.JustDown(cursors.up) ||
      Phaser.Input.Keyboard.JustDown(cursors.space) ||
      (cursors.w && Phaser.Input.Keyboard.JustDown(cursors.w));

    // Wall jump: in air, touching wall, jump pressed
    if (inAir && (onLeft || onRight) && jumpJustDown) {
      const dir = onLeft ? 1 : -1;
      body.setVelocityY(WALL_JUMP_VEL_Y);
      body.setVelocityX(WALL_JUMP_VEL_X * dir);
      this._wallLockFrames = 18;
      this.setFlipX(dir < 0);
      this._playLocked('frog-walljump');
    }
    // First jump or double jump
    else if (jumpJustDown && this._jumpsLeft > 0) {
      const isFirst = this._jumpsLeft === 2;
      body.setVelocityY(isFirst ? JUMP_VEL : DOUBLE_JUMP_VEL);
      this._jumpsLeft--;
      if (isFirst) {
        this.play('frog-jump', true);
      } else {
        this._playLocked('frog-doublejump');
      }
    }

    // Horizontal movement (locked briefly after wall jump)
    if (this._wallLockFrames > 0) {
      this._wallLockFrames--;
    } else {
      const goLeft  = cursors.left.isDown  || (cursors.a?.isDown ?? false);
      const goRight = cursors.right.isDown || (cursors.d?.isDown ?? false);
      if (goLeft) {
        body.setVelocityX(-PLAYER_SPEED);
        this.setFlipX(true);
      } else if (goRight) {
        body.setVelocityX(PLAYER_SPEED);
        this.setFlipX(false);
      } else {
        body.setVelocityX(0);
      }
    }

    // Wall slide: cap downward velocity when pressed against wall mid-air
    if (inAir && (onLeft || onRight) && body.velocity.y > WALL_SLIDE_VEL) {
      body.setVelocityY(WALL_SLIDE_VEL);
    }

    this._stepAnim(onGround, body);
  }

  _playLocked(key) {
    this._animLocked = true;
    this.play(key, true);
  }

  _stepAnim(onGround, body) {
    if (this._animLocked) return;

    const cur = this.anims.currentAnim?.key;

    if (onGround) {
      const want = Math.abs(body.velocity.x) > 10 ? 'frog-run' : 'frog-idle';
      if (cur !== want) this.play(want);
    } else {
      const want = body.velocity.y < 0 ? 'frog-jump' : 'frog-fall';
      if (cur !== want) this.play(want);
    }
  }
}
