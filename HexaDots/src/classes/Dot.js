import { constants } from '../constants';

export class Dot extends Phaser.GameObjects.Image {

  /**
 * Creates a single Dot object used to populate HexaGrid.grid. Extends Image.
 * @param {Phaser.Scene} scene - The game scene that this dot is in.
 * @param {number} x - The dots x coordinate in worldspace.
 * @param {number} y - The dots y coordinate in worldspace.
 * @param {Object} gridCell - An object that holds the row and column indexes of the grid cell that this dot is currently in.
 * @param {String} - The hex value of this dots color.
 */
  constructor(scene, x, y, gridCell, color) {
    super(scene, x, y, constants.IMAGES.DOT);
    this.gridCell = gridCell;
    this.color = color;
    this.scale = Dot.getDotScale();
    this.t = 0; // timestep variable for driving dot animations.
    this.setTint(color);
    this.setScale(this.scale);
    this.setInteractive();
    this.createdAnimation();
    scene.add.existing(this);

  }

  // Checks if this dot and otherDot are hexadjacent in the game grid.
  isAdjacent(otherDot) {
    let xDiff = this.gridCell.col - otherDot.gridCell.col;
    let yDiff = this.gridCell.row - otherDot.gridCell.row;

    // If the other dot is to the immediate left/right.
    if (yDiff == 0 && Math.abs(xDiff) == 1) {
      return true;
    }
    // If the other dot is above/below.
    if (Math.abs(yDiff) == 1) {
      // Adjusting for x offset that occurs from alternating rows.
      if (this.gridCell.row % 2 == 0 && ((otherDot.gridCell.col == this.gridCell.col) || (otherDot.gridCell.col == this.gridCell.col - 1))) {
        return true;
      }
      if (this.gridCell.row % 2 != 0 && ((otherDot.gridCell.col == this.gridCell.col) || (otherDot.gridCell.col == this.gridCell.col + 1))) {
        return true;
      }
    }

    return false;
  }

  static getDotScale() {
    let numCols = constants.GAME_SETTINGS.NUM_COLS;
    let numRows = constants.GAME_SETTINGS.NUM_COLS;
    let dotScale = 7 / (numCols + numRows);
    return dotScale;
  }

  // Update function to drive dot animation. Must be called manually.
  update() {
    if (this.dropPath && this.t >= 0) {
      let nextPosition = new Phaser.Math.Vector2();
      this.dropPath.getPoint(this.t, nextPosition);
      this.setPosition(nextPosition.x, nextPosition.y);
    }
  }

  selectedAnimation() {
    this.tween = this.scene.tweens.add({
      targets: this,
      scaleX: {from: this.scale, to: this.scale*1.3},
      scaleY: {from: this.scale, to: this.scale*1.3},
      ease: 'Circle.out',
      yoyo: true,
      repeat: 1000,
      duration: 1000,
    })
  }

  createdAnimation() {
    this.scene.tweens.add({
      targets: this,
      scaleX: {from: 0, to: this.scale},
      scaleY: {from: 0, to: this.scale},
      ease: 'Circular.out',
      duration: 300,
    });
  }

  destroyedAnimation() {
    this.scene.tweens.add({
      targets: this,
      scaleX: {from: this.scale, to: 0},
      scaleY: {from: this.scale, to: 0},
      ease: 'Circular.in',
      duration: 300,
    })
    .setCallback('onComplete', () => {
      this.destroy();
    }, []);
  }

  // Invoke this dots dropping animation. It then continues execution in this dot's update function.
  invokeDropAnimation(dropPath) {
    this.dropPath = dropPath;
    this.scene.tweens.add({
      targets: this,
      t: {from: 0, to: 1},
      ease: 'Circular.out',
      duration: 300
    })
    .setCallback('onComplete', () => {
      this.t = -1; // Stops this dot's update from being called once complete.
    }, []);
  }

  // Stops any animation attached to the dot.
  stopAnimation() {
    if (this.tween) {
      this.tween.stop();
      this.setScale(this.scale);
    }
  }
}
