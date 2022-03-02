import { constants } from '../constants';

export class GraphicsManager {

  /**
 * Creates a GraphicsManager that handles all graphics objects and updates animations.
 * @param {Phaser.Scene} scene - The game scene that this class draws to.
 */
  constructor(scene) {
    this.scene = scene;
    this.backgroundGraphics = this.scene.add.graphics();
    this.selectionGraphics = this.scene.add.graphics();
    this.pointerGraphics = this.scene.add.graphics();
  }

  // Draw curves on the scene to separate columns.
  drawColumnLines() {
    let hexaGrid = this.scene.hexaGrid;
    let points = []
    let xDistance = hexaGrid.grid[0][1].x - hexaGrid.grid[0][0].x;

    for (let col = 0; col < hexaGrid.numCols-1; col++) {
      for (let row = 0; row < hexaGrid.numRows; row++) {
        let hexaGridx = hexaGrid.grid[col][row].x;
        let hexaGridy = hexaGrid.grid[col][row].y;
        points.push(new Phaser.Math.Vector2(hexaGridx + xDistance, hexaGridy)); // (hexaGridx + 50
      }

      let curve = new Phaser.Curves.Spline(points);
      this.backgroundGraphics.lineStyle(2, 0xA3A2A2, 1);
      curve.draw(this.backgroundGraphics, 64);
      points = []
    }
  }

  // Draw lines between all selected dots in order.
  drawSelectionLines() {
    let selectedDots = this.scene.hexaGrid.selectedDots;
    let graphics = this.selectionGraphics;
    graphics.clear();

    if (selectedDots.length > 1) {
      graphics.lineStyle(3.5, selectedDots[0].color);
      graphics.beginPath();
      graphics.moveTo(selectedDots[0].x, selectedDots[0].y);
      for (let i = 1; i < selectedDots.length; i++) {
        graphics.lineTo(selectedDots[i].x, selectedDots[i].y);
      }
      graphics.strokePath();
    }
  }

  // Draw a line where the mouse is when making a selection.
  drawPointerLine() {
    let hexaGrid = this.scene.hexaGrid;
    let graphics = this.pointerGraphics;

    graphics.clear();

    let selectedDots = hexaGrid.selectedDots;
    let pointer = this.scene.input.activePointer;

    if ( selectedDots.length === 0 || hexaGrid.selectionIsLoop() ) return;
    if ( pointer.x === 0 || pointer.y === 0 ) return;

    if (selectedDots.length > 0 && !hexaGrid.selectionIsLoop()) {
      graphics.lineStyle(3.5, selectedDots[0].color);
      graphics.beginPath();
      graphics.moveTo(selectedDots[selectedDots.length-1].x, selectedDots[selectedDots.length-1].y);
      graphics.lineTo(pointer.x, pointer.y);
      graphics.strokePath();
    }
  }

  // Call each dots update function to show animations.
  updateDots() {
    let grid = this.scene.hexaGrid.grid;

    grid.forEach((column) => {
      column.forEach((cell) => {
        cell.dot.update();
      })
    })
  }

  // delete this
  // Tint screen the selection color once a loop is detected.
  tintScreen() {
    let colorOverlay = this.uiHandler.colorOverlay;
    if (this.selection.loop) {
      colorOverlay.fillColor = DOT_COLORS[this.selection.colorId]._color;
      colorOverlay.setVisible(true);
    }
    else {
      colorOverlay.setVisible(false);
    }
  }
}
