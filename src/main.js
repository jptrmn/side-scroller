import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 400,
  height: 240,
  zoom: 2,
  backgroundColor: '#1a1a2e',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: false,
    },
  },
  scene: [BootScene, GameScene],
});
