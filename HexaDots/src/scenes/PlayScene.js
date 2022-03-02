import { HexaGrid } from '../classes/HexaGrid';
import { GameManager } from '../classes/GameManager';
import { GraphicsManager } from '../classes/GraphicsManager';
import { constants } from '../constants';
import { loadImages } from '../utils';

export class PlayScene extends Phaser.Scene {

  constructor() {
    super({
      key: constants.SCENES.PLAY
    });
  }

  preload() {
    loadImages(this, 'game');
  }

  create() {
    this.hexaGrid = new HexaGrid(this, constants.GAME_SETTINGS);
    this.gameManager = new GameManager(this, constants.GAME_SETTINGS.TIME_LIMIT);
    this.gameManager.startGame();

    this.add.image(0, 0, constants.IMAGES.BG).setOrigin(0).setDepth(-1);
    this.graphicsManager = new GraphicsManager(this);
    this.graphicsManager.drawColumnLines();

    this.input.on('gameobjectdown', this.startSelection.bind(this));
    this.input.on('gameobjectover', this.appendSelection.bind(this));
    this.input.on('pointerup', this.confirmSelection.bind(this));
  }

  update() {
    this.graphicsManager.drawPointerLine();
    this.graphicsManager.updateDots();
    this.gameManager.update();
  }

  startSelection(pointer, dot) {
    if (!this.gameManager.gameOver) {
      this.hexaGrid.addDotToSelection(dot);
    }
  }

  appendSelection(pointer, dot) {
    if (!this.gameManager.gameOver) {
      this.hexaGrid.verifyDotSelection(dot);
      this.graphicsManager.drawSelectionLines();
    }
  }

  confirmSelection() {
    if (this.hexaGrid.selectedDots.length > 1) {
      let pointsScored = this.hexaGrid.updateGrid();
      this.gameManager.incrementScore(pointsScored);
    } else {
      this.hexaGrid.stopDotAnimations();
    }

    this.hexaGrid.selectedDots = [];
    this.graphicsManager.selectionGraphics.clear();
  }
}
