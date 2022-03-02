import { Dot } from './Dot';
import { getRandomColor, getCoordinatesObj } from '../utils';

export class HexaGrid {

  /**
 * Create a HexaGrid and initializes its grid to random dot objects.
   Hexagrid has access to all dots in play and keeps track of which dots are selected.
 * @param {Phaser.Scene} scene - The game scene that HexaGrid should interact with.
 * @param {Object} gameSettings - The game configuration that is set in /constants.js.
   Users can change the number of columns, rows, dot colors, and the time limit for each round.
 */

  constructor(scene, gameSettings) {
    this.scene = scene;
    this.numCols = gameSettings.NUM_COLS;
    this.numRows = gameSettings.NUM_ROWS;
    this.selectedDots = [];
    this.grid = this.initializeGrid(gameSettings.DOT_BUFFER, gameSettings.EDGE_BUFFER);
    this.fillGrid();
  }

  moveDotToCell(dot, col, row) {
    // Invoking dot drop animation.
    let dropPath = this.getDotDropPath(dot, row);
    dot.invokeDropAnimation(dropPath);

    // Logically moving dot object from current cell to target cell.
    this.removeDotFromCell(dot);
    let targetCell = this.grid[col][row];
    targetCell.dot = dot;
    dot.gridCell = getCoordinatesObj(col, row);
  }

  // Gets the path downwards from the dot's current row to the target row.
  getDotDropPath(dot, targetRow) {
    let col = dot.gridCell.col;
    let startRow = dot.gridCell.row;
    let points = [];

    for (let row = startRow; row <= targetRow; row++) {
      points.push(new Phaser.Math.Vector2(this.grid[col][row].x, this.grid[col][row].y));
    }

    let path = new Phaser.Curves.Path(this.grid[col][startRow].x, this.grid[col][startRow].y);
    path.splineTo(points);
    return path;
  }

  // Clears the grid cell that this dot is in.
  removeDotFromCell(dot) {
    let col = dot.gridCell.col;
    let row = dot.gridCell.row;
    this.grid[col][row].dot = null;
  }

  // Destroys all dots in current selection and returns the amount of destroyed.
  destroySelectedDots() {
    this.selectedDots.forEach((dot) => {
      this.removeDotFromCell(dot);
      dot.destroyedAnimation();
    })
    return this.selectedDots.length;
  }

  getClosestDotAbove(col, startRow) {
    for (let row = startRow; row >= 0; row--) {
      let dot = this.grid[col][row].dot;
      // If this cell has a dot.
      if (dot) { return dot; }
    }
    // There are no dots above in this column.
    return null;
  }

  // Shifts down dots with empty space below.
  shiftDotsDown() {
    // Search columns from bottom to top.
    for (let col = 0; col < this.numCols; col++) {
      for (let row = this.numRows-1; row >= 0; row--) {
        // If this cell doesn't have a dot, replace it with the closest dot above.
        if (!this.grid[col][row].dot) {
          let aboveDot = this.getClosestDotAbove(col, row);
          if (aboveDot) {
            this.moveDotToCell(aboveDot, col, row);
          }
        }
      }
    }
  }

  // Fills empty cells in the top row until the grid is full.
  fillGrid() {
    while (this.topRowHasEmpty() == true) {
      this.grid.forEach((col, colIndex) => {
        let topCell = col[0];
        // If the top of this column doesn't have a dot.
        if (!topCell.dot) {
          topCell.dot = new Dot(this.scene, topCell.x, topCell.y, getCoordinatesObj(colIndex, 0), getRandomColor());
          //topCell.dot.fadeIn();
        }
      })
      // Shift down newly added dots where possible.
      this.shiftDotsDown();
    }
  }

  // Checks if the top row is missing any dots.
  topRowHasEmpty() {
    let hasEmpty = false;
    this.grid.forEach((col) => {
      let topCell = col[0];
      // If the top of this column doesn't have a dot.
      if (!topCell.dot) { hasEmpty = true; }
    });
    return hasEmpty;
  }

  // Checks if the current dot selection forms a loop.
  selectionIsLoop() {
    // A loop must have at least 3 dot selections.
    if (this.selectedDots.length > 2) {
      let firstDot = this.selectedDots[0];
      let lastDot = this.selectedDots.slice(-1)[0];
      // If first and last selection are the same dot.
      if (firstDot.gridCell.col == lastDot.gridCell.col &&
          firstDot.gridCell.row == lastDot.gridCell.row) {
            return true;
      }
    }

    return false;
  }

  // Destroys all dots of the provided color and returns the destroyed amount.
  destroyAllDotsWithColor(color) {
    // gamemanager increment score... might need to use events here???
    this.selectedDots = this.getDotsWithSelectionColor();
    this.destroySelectedDots();
    return this.selectedDots.length;
  }

  // Returns an array of all dots of the provided color and starts their selection animation.
  getDotsWithSelectionColor() {
    let selectionColor = this.selectedDots[0].color;
    let filteredDots = []
    this.grid.forEach((column) => {
      column.forEach((cell) => {
        if (cell.dot.color === selectionColor) {
          filteredDots.push(cell.dot);
          cell.dot.selectedAnimation();
        }
      })
    })

    return filteredDots;
  }

  // Verify that the attempted seleciton is valid and add it to the current selection.
  verifyDotSelection(dot) {
    let selectedDots = this.selectedDots;

    if (selectedDots.length > 0 && !this.selectionIsLoop()) {
      // The most recently selected dot.
      let prevDot = selectedDots.slice(-1)[0];
      // Check if new dot is a valid connection.
      if (selectedDots.length > 2) {
        // Omitting the first dot from the includes-check since a loop is allowed here.
        if (dot.isAdjacent(prevDot) && dot.color === prevDot.color && !selectedDots.slice(1).includes(dot)) {
          this.addDotToSelection(dot);
          if (this.selectionIsLoop()) {
            this.getDotsWithSelectionColor();
          }
        }
      } else {
        // Loop is not allowed here so perform full includes-check.
        if (dot.isAdjacent(prevDot) && dot.color === prevDot.color && !selectedDots.includes(dot)) {
          this.addDotToSelection(dot);
        }
      }
    }
  }

  // Adds this dot to the selection and starts its selected animation.
  addDotToSelection(dot) {
    this.selectedDots.push(dot);
    dot.selectedAnimation();
  }

  // Updates the grid after given the selection and returns the amount of destroyed dots.
  updateGrid() {
    let dotsDestroyed = 0;

    if (this.selectionIsLoop()) {
      dotsDestroyed = this.destroyAllDotsWithColor(this.selectedDots[0].color);
    } else {
      dotsDestroyed = this.destroySelectedDots();
    }

    this.shiftDotsDown();
    this.fillGrid();
    return dotsDestroyed;
  }

  // Stops each dot animation if exists.
  stopDotAnimations() {
    this.grid.forEach((column) => {
      column.forEach((cell) => {
        if (cell.dot) {
          cell.dot.stopAnimation();
        }
      })
    })
  }

  // Initialize this Hexagrid's grid[][] and sets each cell's worldspace position.
  initializeGrid(dotBuffer, edgeBuffer) {
    let gridCenter = {
      x: this.scene.cameras.main.centerX,
      y: this.scene.cameras.main.centerY * (3/4) // Want to leave 1/4 of screen for UI
    };

    let cellDistance = {
      x: ((gridCenter.x * 2) / (this.numCols + 1)) - dotBuffer.X,
      y: ((gridCenter.y * 2) / (this.numRows + 1)) - dotBuffer.Y
    }
    // Initializing grid to 2D array.
    let grid = new Array(this.numCols);

    for (let col = 0; col < this.numCols; col++) {

      grid[col] = new Array(this.numRows);

      for (let row = 0; row < this.numRows; row++) {
        // Setting this cell's world position.
        let cellPosition = {
          x: (cellDistance.x * col) + edgeBuffer.X,
          y: (cellDistance.y * row) + edgeBuffer.Y
        }
        // offset odd rows to be halfway between even rows.
        if (row % 2 === 1)
          cellPosition.x += cellDistance.x / 2;

        grid[col][row] = {
          x: cellPosition.x,
          y: cellPosition.y,
          dot: null
        };
      }
    }

    return grid;
  }
}
