import { MenuScene } from './scenes/MenuScene';
import { PlayScene } from './scenes/PlayScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    MenuScene,
    PlayScene
  ]
};

const game = new Phaser.Game(config);
