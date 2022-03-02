// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constants = void 0;
var constants = {
  SCENES: {
    MENU: 'MENU',
    PLAY: 'PLAY'
  },
  IMAGES: {
    TITLE: 'title.png',
    BG: 'background.jpg',
    PLAY: 'play.png',
    DOT: 'dot.png',
    GAMEOVER: 'gameover.png',
    RESTART: 'restart.png',
    QUIT: 'quit.png'
  },
  COLORS: {
    RED: 0xD10003,
    ORANGE: 0xFF9C00,
    YELLOW: 0xFFFB00,
    BLUE: 0x0044FF,
    PURPLE: 0x8800FF,
    GREEN: 0x00C510,
    PINK: 0xFF4EF2,
    TURQUOISE: 0x14dba6
  },
  GAME_SETTINGS: {
    // Change game settings here.
    NUM_COLS: 8,
    NUM_ROWS: 6,
    NUM_COLORS: 8,
    TIME_LIMIT: 60,
    // In seconds.
    // Don't change below.
    EDGE_BUFFER: {
      X: 65,
      Y: 50
    },
    DOT_BUFFER: {
      X: 0,
      Y: 0
    }
  }
};
exports.constants = constants;
},{}],"src/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCoordinatesObj = getCoordinatesObj;
exports.getRandomColor = getRandomColor;
exports.loadImages = loadImages;

var _constants = require("./constants");

// Returns a random dot color (hex value)
function getRandomColor() {
  var colorHexList = Object.values(_constants.constants.COLORS);
  var randomIndex = Math.floor(Math.random() * _constants.constants.GAME_SETTINGS.NUM_COLORS);
  var colorHexValue = colorHexList[randomIndex];
  return colorHexValue;
} // loads all images from the provided folder.


function loadImages(scene, folder) {
  scene.load.setPath("assets/".concat(folder));

  for (var key in _constants.constants.IMAGES) {
    scene.load.image(_constants.constants.IMAGES[key], _constants.constants.IMAGES[key]);
  }
} // Create a coordinate obj for easier grid manipulation.


function getCoordinatesObj(col, row) {
  var coordinatesObj = {
    col: col,
    row: row
  };
  return coordinatesObj;
}
},{"./constants":"src/constants.js"}],"src/scenes/MenuScene.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuScene = void 0;

var _constants = require("../constants");

var _utils = require("../utils");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var MenuScene = /*#__PURE__*/function (_Phaser$Scene) {
  _inherits(MenuScene, _Phaser$Scene);

  var _super = _createSuper(MenuScene);

  function MenuScene() {
    _classCallCheck(this, MenuScene);

    return _super.call(this, {
      key: _constants.constants.SCENES.MENU
    });
  }

  _createClass(MenuScene, [{
    key: "preload",
    value: function preload() {
      (0, _utils.loadImages)(this, 'menu');
    }
  }, {
    key: "create",
    value: function create() {
      var _this = this;

      this.add.image(0, 0, _constants.constants.IMAGES.BG).setOrigin(0).setDepth(-1);
      this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.2, _constants.constants.IMAGES.TITLE);
      var playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, _constants.constants.IMAGES.PLAY);
      playButton.setInteractive();
      var playIndicators = this.createPlayIndicators(playButton);
      playIndicators.forEach(this.hideIndicator);
      playButton.on('pointerover', function () {
        playIndicators.forEach(_this.showIndicator);
      });
      playButton.on('pointerout', function () {
        playIndicators.forEach(_this.hideIndicator);
      });
      playButton.on('pointerup', function () {
        _this.scene.start(_constants.constants.SCENES.PLAY);
      });
    }
  }, {
    key: "createPlayIndicators",
    value: function createPlayIndicators(playButton) {
      var leftIndicator = this.add.circle(playButton.x - playButton.width, playButton.y - 5, 15, _constants.constants.COLORS.RED);
      var rightIndicator = this.add.circle(playButton.x + playButton.width, playButton.y - 5, 15, _constants.constants.COLORS.RED);
      return [leftIndicator, rightIndicator];
    } // Shows the play button indicators and sets them to a random Dot color.

  }, {
    key: "showIndicator",
    value: function showIndicator(indicator) {
      indicator.setFillStyle((0, _utils.getRandomColor)());
      indicator.setVisible(true);
    }
  }, {
    key: "hideIndicator",
    value: function hideIndicator(indicator) {
      indicator.setVisible(false);
    }
  }]);

  return MenuScene;
}(Phaser.Scene);

exports.MenuScene = MenuScene;
},{"../constants":"src/constants.js","../utils":"src/utils.js"}],"src/classes/Dot.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dot = void 0;

var _constants = require("../constants");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Dot = /*#__PURE__*/function (_Phaser$GameObjects$I) {
  _inherits(Dot, _Phaser$GameObjects$I);

  var _super = _createSuper(Dot);

  /**
  * Creates a single Dot object used to populate HexaGrid.grid. Extends Image.
  * @param {Phaser.Scene} scene - The game scene that this dot is in.
  * @param {number} x - The dots x coordinate in worldspace.
  * @param {number} y - The dots y coordinate in worldspace.
  * @param {Object} gridCell - An object that holds the row and column indexes of the grid cell that this dot is currently in.
  * @param {String} - The hex value of this dots color.
  */
  function Dot(scene, x, y, gridCell, color) {
    var _this;

    _classCallCheck(this, Dot);

    _this = _super.call(this, scene, x, y, _constants.constants.IMAGES.DOT);
    _this.gridCell = gridCell;
    _this.color = color;
    _this.scale = Dot.getDotScale();
    _this.t = 0; // timestep variable for driving dot animations.

    _this.setTint(color);

    _this.setScale(_this.scale);

    _this.setInteractive();

    _this.createdAnimation();

    scene.add.existing(_assertThisInitialized(_this));
    return _this;
  } // Checks if this dot and otherDot are hexadjacent in the game grid.


  _createClass(Dot, [{
    key: "isAdjacent",
    value: function isAdjacent(otherDot) {
      var xDiff = this.gridCell.col - otherDot.gridCell.col;
      var yDiff = this.gridCell.row - otherDot.gridCell.row; // If the other dot is to the immediate left/right.

      if (yDiff == 0 && Math.abs(xDiff) == 1) {
        return true;
      } // If the other dot is above/below.


      if (Math.abs(yDiff) == 1) {
        // Adjusting for x offset that occurs from alternating rows.
        if (this.gridCell.row % 2 == 0 && (otherDot.gridCell.col == this.gridCell.col || otherDot.gridCell.col == this.gridCell.col - 1)) {
          return true;
        }

        if (this.gridCell.row % 2 != 0 && (otherDot.gridCell.col == this.gridCell.col || otherDot.gridCell.col == this.gridCell.col + 1)) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "update",
    value: // Update function to drive dot animation. Must be called manually.
    function update() {
      if (this.dropPath && this.t >= 0) {
        var nextPosition = new Phaser.Math.Vector2();
        this.dropPath.getPoint(this.t, nextPosition);
        this.setPosition(nextPosition.x, nextPosition.y);
      }
    }
  }, {
    key: "selectedAnimation",
    value: function selectedAnimation() {
      this.tween = this.scene.tweens.add({
        targets: this,
        scaleX: {
          from: this.scale,
          to: this.scale * 1.3
        },
        scaleY: {
          from: this.scale,
          to: this.scale * 1.3
        },
        ease: 'Circle.out',
        yoyo: true,
        repeat: 1000,
        duration: 1000
      });
    }
  }, {
    key: "createdAnimation",
    value: function createdAnimation() {
      this.scene.tweens.add({
        targets: this,
        scaleX: {
          from: 0,
          to: this.scale
        },
        scaleY: {
          from: 0,
          to: this.scale
        },
        ease: 'Circular.out',
        duration: 300
      });
    }
  }, {
    key: "destroyedAnimation",
    value: function destroyedAnimation() {
      var _this2 = this;

      this.scene.tweens.add({
        targets: this,
        scaleX: {
          from: this.scale,
          to: 0
        },
        scaleY: {
          from: this.scale,
          to: 0
        },
        ease: 'Circular.in',
        duration: 300
      }).setCallback('onComplete', function () {
        _this2.destroy();
      }, []);
    } // Invoke this dots dropping animation. It then continues execution in this dot's update function.

  }, {
    key: "invokeDropAnimation",
    value: function invokeDropAnimation(dropPath) {
      var _this3 = this;

      this.dropPath = dropPath;
      this.scene.tweens.add({
        targets: this,
        t: {
          from: 0,
          to: 1
        },
        ease: 'Circular.out',
        duration: 300
      }).setCallback('onComplete', function () {
        _this3.t = -1; // Stops this dot's update from being called once complete.
      }, []);
    } // Stops any animation attached to the dot.

  }, {
    key: "stopAnimation",
    value: function stopAnimation() {
      if (this.tween) {
        this.tween.stop();
        this.setScale(this.scale);
      }
    }
  }], [{
    key: "getDotScale",
    value: function getDotScale() {
      var numCols = _constants.constants.GAME_SETTINGS.NUM_COLS;
      var numRows = _constants.constants.GAME_SETTINGS.NUM_COLS;
      var dotScale = 7 / (numCols + numRows);
      return dotScale;
    }
  }]);

  return Dot;
}(Phaser.GameObjects.Image);

exports.Dot = Dot;
},{"../constants":"src/constants.js"}],"src/classes/HexaGrid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HexaGrid = void 0;

var _Dot = require("./Dot");

var _utils = require("../utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var HexaGrid = /*#__PURE__*/function () {
  /**
  * Create a HexaGrid and initializes its grid to random dot objects.
   Hexagrid has access to all dots in play and keeps track of which dots are selected.
  * @param {Phaser.Scene} scene - The game scene that HexaGrid should interact with.
  * @param {Object} gameSettings - The game configuration that is set in /constants.js.
   Users can change the number of columns, rows, dot colors, and the time limit for each round.
  */
  function HexaGrid(scene, gameSettings) {
    _classCallCheck(this, HexaGrid);

    this.scene = scene;
    this.numCols = gameSettings.NUM_COLS;
    this.numRows = gameSettings.NUM_ROWS;
    this.selectedDots = [];
    this.grid = this.initializeGrid(gameSettings.DOT_BUFFER, gameSettings.EDGE_BUFFER);
    this.fillGrid();
  }

  _createClass(HexaGrid, [{
    key: "moveDotToCell",
    value: function moveDotToCell(dot, col, row) {
      // Invoking dot drop animation.
      var dropPath = this.getDotDropPath(dot, row);
      dot.invokeDropAnimation(dropPath); // Logically moving dot object from current cell to target cell.

      this.removeDotFromCell(dot);
      var targetCell = this.grid[col][row];
      targetCell.dot = dot;
      dot.gridCell = (0, _utils.getCoordinatesObj)(col, row);
    } // Gets the path downwards from the dot's current row to the target row.

  }, {
    key: "getDotDropPath",
    value: function getDotDropPath(dot, targetRow) {
      var col = dot.gridCell.col;
      var startRow = dot.gridCell.row;
      var points = [];

      for (var row = startRow; row <= targetRow; row++) {
        points.push(new Phaser.Math.Vector2(this.grid[col][row].x, this.grid[col][row].y));
      }

      var path = new Phaser.Curves.Path(this.grid[col][startRow].x, this.grid[col][startRow].y);
      path.splineTo(points);
      return path;
    } // Clears the grid cell that this dot is in.

  }, {
    key: "removeDotFromCell",
    value: function removeDotFromCell(dot) {
      var col = dot.gridCell.col;
      var row = dot.gridCell.row;
      this.grid[col][row].dot = null;
    } // Destroys all dots in current selection and returns the amount of destroyed.

  }, {
    key: "destroySelectedDots",
    value: function destroySelectedDots() {
      var _this = this;

      this.selectedDots.forEach(function (dot) {
        _this.removeDotFromCell(dot);

        dot.destroyedAnimation();
      });
      return this.selectedDots.length;
    }
  }, {
    key: "getClosestDotAbove",
    value: function getClosestDotAbove(col, startRow) {
      for (var row = startRow; row >= 0; row--) {
        var dot = this.grid[col][row].dot; // If this cell has a dot.

        if (dot) {
          return dot;
        }
      } // There are no dots above in this column.


      return null;
    } // Shifts down dots with empty space below.

  }, {
    key: "shiftDotsDown",
    value: function shiftDotsDown() {
      // Search columns from bottom to top.
      for (var col = 0; col < this.numCols; col++) {
        for (var row = this.numRows - 1; row >= 0; row--) {
          // If this cell doesn't have a dot, replace it with the closest dot above.
          if (!this.grid[col][row].dot) {
            var aboveDot = this.getClosestDotAbove(col, row);

            if (aboveDot) {
              this.moveDotToCell(aboveDot, col, row);
            }
          }
        }
      }
    } // Fills empty cells in the top row until the grid is full.

  }, {
    key: "fillGrid",
    value: function fillGrid() {
      var _this2 = this;

      while (this.topRowHasEmpty() == true) {
        this.grid.forEach(function (col, colIndex) {
          var topCell = col[0]; // If the top of this column doesn't have a dot.

          if (!topCell.dot) {
            topCell.dot = new _Dot.Dot(_this2.scene, topCell.x, topCell.y, (0, _utils.getCoordinatesObj)(colIndex, 0), (0, _utils.getRandomColor)()); //topCell.dot.fadeIn();
          }
        }); // Shift down newly added dots where possible.

        this.shiftDotsDown();
      }
    } // Checks if the top row is missing any dots.

  }, {
    key: "topRowHasEmpty",
    value: function topRowHasEmpty() {
      var hasEmpty = false;
      this.grid.forEach(function (col) {
        var topCell = col[0]; // If the top of this column doesn't have a dot.

        if (!topCell.dot) {
          hasEmpty = true;
        }
      });
      return hasEmpty;
    } // Checks if the current dot selection forms a loop.

  }, {
    key: "selectionIsLoop",
    value: function selectionIsLoop() {
      // A loop must have at least 3 dot selections.
      if (this.selectedDots.length > 2) {
        var firstDot = this.selectedDots[0];
        var lastDot = this.selectedDots.slice(-1)[0]; // If first and last selection are the same dot.

        if (firstDot.gridCell.col == lastDot.gridCell.col && firstDot.gridCell.row == lastDot.gridCell.row) {
          return true;
        }
      }

      return false;
    } // Destroys all dots of the provided color and returns the destroyed amount.

  }, {
    key: "destroyAllDotsWithColor",
    value: function destroyAllDotsWithColor(color) {
      // gamemanager increment score... might need to use events here???
      this.selectedDots = this.getDotsWithSelectionColor();
      this.destroySelectedDots();
      return this.selectedDots.length;
    } // Returns an array of all dots of the provided color and starts their selection animation.

  }, {
    key: "getDotsWithSelectionColor",
    value: function getDotsWithSelectionColor() {
      var selectionColor = this.selectedDots[0].color;
      var filteredDots = [];
      this.grid.forEach(function (column) {
        column.forEach(function (cell) {
          if (cell.dot.color === selectionColor) {
            filteredDots.push(cell.dot);
            cell.dot.selectedAnimation();
          }
        });
      });
      return filteredDots;
    } // Verify that the attempted seleciton is valid and add it to the current selection.

  }, {
    key: "verifyDotSelection",
    value: function verifyDotSelection(dot) {
      var selectedDots = this.selectedDots;

      if (selectedDots.length > 0 && !this.selectionIsLoop()) {
        // The most recently selected dot.
        var prevDot = selectedDots.slice(-1)[0]; // Check if new dot is a valid connection.

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
    } // Adds this dot to the selection and starts its selected animation.

  }, {
    key: "addDotToSelection",
    value: function addDotToSelection(dot) {
      this.selectedDots.push(dot);
      dot.selectedAnimation();
    } // Updates the grid after given the selection and returns the amount of destroyed dots.

  }, {
    key: "updateGrid",
    value: function updateGrid() {
      var dotsDestroyed = 0;

      if (this.selectionIsLoop()) {
        dotsDestroyed = this.destroyAllDotsWithColor(this.selectedDots[0].color);
      } else {
        dotsDestroyed = this.destroySelectedDots();
      }

      this.shiftDotsDown();
      this.fillGrid();
      return dotsDestroyed;
    } // Stops each dot animation if exists.

  }, {
    key: "stopDotAnimations",
    value: function stopDotAnimations() {
      this.grid.forEach(function (column) {
        column.forEach(function (cell) {
          if (cell.dot) {
            cell.dot.stopAnimation();
          }
        });
      });
    } // Initialize this Hexagrid's grid[][] and sets each cell's worldspace position.

  }, {
    key: "initializeGrid",
    value: function initializeGrid(dotBuffer, edgeBuffer) {
      var gridCenter = {
        x: this.scene.cameras.main.centerX,
        y: this.scene.cameras.main.centerY * (3 / 4) // Want to leave 1/4 of screen for UI

      };
      var cellDistance = {
        x: gridCenter.x * 2 / (this.numCols + 1) - dotBuffer.X,
        y: gridCenter.y * 2 / (this.numRows + 1) - dotBuffer.Y
      }; // Initializing grid to 2D array.

      var grid = new Array(this.numCols);

      for (var col = 0; col < this.numCols; col++) {
        grid[col] = new Array(this.numRows);

        for (var row = 0; row < this.numRows; row++) {
          // Setting this cell's world position.
          var cellPosition = {
            x: cellDistance.x * col + edgeBuffer.X,
            y: cellDistance.y * row + edgeBuffer.Y
          }; // offset odd rows to be halfway between even rows.

          if (row % 2 === 1) cellPosition.x += cellDistance.x / 2;
          grid[col][row] = {
            x: cellPosition.x,
            y: cellPosition.y,
            dot: null
          };
        }
      }

      return grid;
    }
  }]);

  return HexaGrid;
}();

exports.HexaGrid = HexaGrid;
},{"./Dot":"src/classes/Dot.js","../utils":"src/utils.js"}],"src/classes/GameManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameManager = void 0;

var _constants = require("../constants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var GameManager = /*#__PURE__*/function () {
  /**
  * Creates a GameManager that handles the round logic.
  * @param {Phaser.Scene} scene - The game scene that this class manages.
  * @param {number} timeLimit - The amount of time the player gets each round (seconds).
  */
  function GameManager(scene, timeLimit) {
    _classCallCheck(this, GameManager);

    this.scene = scene;
    this.timer = this.scene.time.delayedCall(timeLimit * 1000, this.endGame, {}, this);
    this.score = 0;
    this.gameOver = false;
  }

  _createClass(GameManager, [{
    key: "incrementScore",
    value: function incrementScore(amount) {
      this.score += amount;
      this.scoreText.text = this.score;
    }
  }, {
    key: "resetScore",
    value: function resetScore() {
      this.score = 0;
      this.scoreText.text = this.score;
    }
  }, {
    key: "startGame",
    value: function startGame() {
      this.screenCenter = {
        x: this.scene.cameras.main.centerX,
        y: this.scene.cameras.main.centerY * (4 / 3)
      };
      var fontConfig = {
        fontFamily: 'Monospace',
        fontSize: 48,
        color: '#2f3030'
      };
      this.timerText = this.scene.add.text(150, this.screenCenter.y + 75, this.getFormattedTime(), fontConfig).setOrigin(0.5, 0.5);
      this.scoreText = this.scene.add.text(this.screenCenter.x * 2 - 125, this.screenCenter.y + 75, this.score, fontConfig).setOrigin(0.5, 0.5);
    }
  }, {
    key: "endGame",
    value: function endGame() {
      var _this = this;

      this.gameOver = true;
      this.scene.add.image(this.screenCenter.x, this.screenCenter.y / 2, _constants.constants.IMAGES.GAMEOVER).setOrigin(0.5, 0.5);
      var restartButton = this.scene.add.image(this.screenCenter.x, this.screenCenter.y + 50, _constants.constants.IMAGES.RESTART).setOrigin(0.5, 0.5).setScale(0.5);
      restartButton.setInteractive();
      restartButton.on('pointerup', function () {
        _this.scene.scene.start(_constants.constants.SCENES.PLAY);
      });
      var quitButton = this.scene.add.image(this.screenCenter.x, this.screenCenter.y + 100, _constants.constants.IMAGES.QUIT).setOrigin(0.5, 0.5).setScale(0.5);
      quitButton.setInteractive();
      quitButton.on('pointerup', function () {
        _this.scene.scene.start(_constants.constants.SCENES.MENU);
      });
    }
  }, {
    key: "getFormattedTime",
    value: function getFormattedTime() {
      var timeRemaining = Phaser.Math.FloorTo(this.timer.getRemainingSeconds());
      var min = Phaser.Math.FloorTo(timeRemaining / 60);
      var sec = timeRemaining % 60;

      if (sec < 10) {
        sec = '0' + sec;
      }

      return min + ':' + sec;
    }
  }, {
    key: "update",
    value: function update() {
      this.timerText.text = this.getFormattedTime();
    }
  }]);

  return GameManager;
}();

exports.GameManager = GameManager;
},{"../constants":"src/constants.js"}],"src/classes/GraphicsManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphicsManager = void 0;

var _constants = require("../constants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var GraphicsManager = /*#__PURE__*/function () {
  /**
  * Creates a GraphicsManager that handles all graphics objects and updates animations.
  * @param {Phaser.Scene} scene - The game scene that this class draws to.
  */
  function GraphicsManager(scene) {
    _classCallCheck(this, GraphicsManager);

    this.scene = scene;
    this.backgroundGraphics = this.scene.add.graphics();
    this.selectionGraphics = this.scene.add.graphics();
    this.pointerGraphics = this.scene.add.graphics();
  } // Draw curves on the scene to separate columns.


  _createClass(GraphicsManager, [{
    key: "drawColumnLines",
    value: function drawColumnLines() {
      var hexaGrid = this.scene.hexaGrid;
      var points = [];
      var xDistance = hexaGrid.grid[0][1].x - hexaGrid.grid[0][0].x;

      for (var col = 0; col < hexaGrid.numCols - 1; col++) {
        for (var row = 0; row < hexaGrid.numRows; row++) {
          var hexaGridx = hexaGrid.grid[col][row].x;
          var hexaGridy = hexaGrid.grid[col][row].y;
          points.push(new Phaser.Math.Vector2(hexaGridx + xDistance, hexaGridy)); // (hexaGridx + 50
        }

        var curve = new Phaser.Curves.Spline(points);
        this.backgroundGraphics.lineStyle(2, 0xA3A2A2, 1);
        curve.draw(this.backgroundGraphics, 64);
        points = [];
      }
    } // Draw lines between all selected dots in order.

  }, {
    key: "drawSelectionLines",
    value: function drawSelectionLines() {
      var selectedDots = this.scene.hexaGrid.selectedDots;
      var graphics = this.selectionGraphics;
      graphics.clear();

      if (selectedDots.length > 1) {
        graphics.lineStyle(3.5, selectedDots[0].color);
        graphics.beginPath();
        graphics.moveTo(selectedDots[0].x, selectedDots[0].y);

        for (var i = 1; i < selectedDots.length; i++) {
          graphics.lineTo(selectedDots[i].x, selectedDots[i].y);
        }

        graphics.strokePath();
      }
    } // Draw a line where the mouse is when making a selection.

  }, {
    key: "drawPointerLine",
    value: function drawPointerLine() {
      var hexaGrid = this.scene.hexaGrid;
      var graphics = this.pointerGraphics;
      graphics.clear();
      var selectedDots = hexaGrid.selectedDots;
      var pointer = this.scene.input.activePointer;
      if (selectedDots.length === 0 || hexaGrid.selectionIsLoop()) return;
      if (pointer.x === 0 || pointer.y === 0) return;

      if (selectedDots.length > 0 && !hexaGrid.selectionIsLoop()) {
        graphics.lineStyle(3.5, selectedDots[0].color);
        graphics.beginPath();
        graphics.moveTo(selectedDots[selectedDots.length - 1].x, selectedDots[selectedDots.length - 1].y);
        graphics.lineTo(pointer.x, pointer.y);
        graphics.strokePath();
      }
    } // Call each dots update function to show animations.

  }, {
    key: "updateDots",
    value: function updateDots() {
      var grid = this.scene.hexaGrid.grid;
      grid.forEach(function (column) {
        column.forEach(function (cell) {
          cell.dot.update();
        });
      });
    } // delete this
    // Tint screen the selection color once a loop is detected.

  }, {
    key: "tintScreen",
    value: function tintScreen() {
      var colorOverlay = this.uiHandler.colorOverlay;

      if (this.selection.loop) {
        colorOverlay.fillColor = DOT_COLORS[this.selection.colorId]._color;
        colorOverlay.setVisible(true);
      } else {
        colorOverlay.setVisible(false);
      }
    }
  }]);

  return GraphicsManager;
}();

exports.GraphicsManager = GraphicsManager;
},{"../constants":"src/constants.js"}],"src/scenes/PlayScene.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayScene = void 0;

var _HexaGrid = require("../classes/HexaGrid");

var _GameManager = require("../classes/GameManager");

var _GraphicsManager = require("../classes/GraphicsManager");

var _constants = require("../constants");

var _utils = require("../utils");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var PlayScene = /*#__PURE__*/function (_Phaser$Scene) {
  _inherits(PlayScene, _Phaser$Scene);

  var _super = _createSuper(PlayScene);

  function PlayScene() {
    _classCallCheck(this, PlayScene);

    return _super.call(this, {
      key: _constants.constants.SCENES.PLAY
    });
  }

  _createClass(PlayScene, [{
    key: "preload",
    value: function preload() {
      (0, _utils.loadImages)(this, 'game');
    }
  }, {
    key: "create",
    value: function create() {
      this.hexaGrid = new _HexaGrid.HexaGrid(this, _constants.constants.GAME_SETTINGS);
      this.gameManager = new _GameManager.GameManager(this, _constants.constants.GAME_SETTINGS.TIME_LIMIT);
      this.gameManager.startGame();
      this.add.image(0, 0, _constants.constants.IMAGES.BG).setOrigin(0).setDepth(-1);
      this.graphicsManager = new _GraphicsManager.GraphicsManager(this);
      this.graphicsManager.drawColumnLines();
      this.input.on('gameobjectdown', this.startSelection.bind(this));
      this.input.on('gameobjectover', this.appendSelection.bind(this));
      this.input.on('pointerup', this.confirmSelection.bind(this));
    }
  }, {
    key: "update",
    value: function update() {
      this.graphicsManager.drawPointerLine();
      this.graphicsManager.updateDots();
      this.gameManager.update();
    }
  }, {
    key: "startSelection",
    value: function startSelection(pointer, dot) {
      if (!this.gameManager.gameOver) {
        this.hexaGrid.addDotToSelection(dot);
      }
    }
  }, {
    key: "appendSelection",
    value: function appendSelection(pointer, dot) {
      if (!this.gameManager.gameOver) {
        this.hexaGrid.verifyDotSelection(dot);
        this.graphicsManager.drawSelectionLines();
      }
    }
  }, {
    key: "confirmSelection",
    value: function confirmSelection() {
      if (this.hexaGrid.selectedDots.length > 1) {
        var pointsScored = this.hexaGrid.updateGrid();
        this.gameManager.incrementScore(pointsScored);
      } else {
        this.hexaGrid.stopDotAnimations();
      }

      this.hexaGrid.selectedDots = [];
      this.graphicsManager.selectionGraphics.clear();
    }
  }]);

  return PlayScene;
}(Phaser.Scene);

exports.PlayScene = PlayScene;
},{"../classes/HexaGrid":"src/classes/HexaGrid.js","../classes/GameManager":"src/classes/GameManager.js","../classes/GraphicsManager":"src/classes/GraphicsManager.js","../constants":"src/constants.js","../utils":"src/utils.js"}],"src/main.js":[function(require,module,exports) {
"use strict";

var _MenuScene = require("./scenes/MenuScene");

var _PlayScene = require("./scenes/PlayScene");

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [_MenuScene.MenuScene, _PlayScene.PlayScene]
};
var game = new Phaser.Game(config);
},{"./scenes/MenuScene":"src/scenes/MenuScene.js","./scenes/PlayScene":"src/scenes/PlayScene.js"}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51821" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/main.js"], null)
//# sourceMappingURL=/main.1e43358e.js.map