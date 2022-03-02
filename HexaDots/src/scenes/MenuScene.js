import { constants } from '../constants';
import { getRandomColor, loadImages } from '../utils';

export class MenuScene extends Phaser.Scene {

  constructor() {
    super({
      key: constants.SCENES.MENU
    });
  }

  preload() {
    loadImages(this, 'menu');
  }

  create() {
    this.add.image(0, 0, constants.IMAGES.BG).setOrigin(0).setDepth(-1);
    this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.2, constants.IMAGES.TITLE);

    let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, constants.IMAGES.PLAY);
    playButton.setInteractive();

    let playIndicators = this.createPlayIndicators(playButton);
    playIndicators.forEach(this.hideIndicator);

    playButton.on('pointerover', ()=> { playIndicators.forEach(this.showIndicator) });
    playButton.on('pointerout', ()=> { playIndicators.forEach(this.hideIndicator) });
    playButton.on('pointerup', ()=> { this.scene.start(constants.SCENES.PLAY) });
  }

  createPlayIndicators(playButton) {
    let leftIndicator = this.add.circle(playButton.x - playButton.width, playButton.y - 5, 15, constants.COLORS.RED)
    let rightIndicator = this.add.circle(playButton.x + playButton.width, playButton.y - 5, 15, constants.COLORS.RED);
    return [leftIndicator, rightIndicator]
  }

  // Shows the play button indicators and sets them to a random Dot color.
  showIndicator(indicator) {
    indicator.setFillStyle(getRandomColor());
    indicator.setVisible(true);
  }

  hideIndicator(indicator) {
    indicator.setVisible(false);
  }
}
