"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

/**
 * ECMAScript 2015 (ES6) version of grid.js
 */
(function (root, factory) {
  root.MSPolymer = factory(root, {});
})(this, /* environment global */function (root, MSPolymer) {
  var Cell = (function () {
    function Cell(i, j) {
      this.mine = false;
      this.revealed = false;
      this.flagged = false;
      this.risk = 0;
      this.id = "cid_" + i + "_" + j;
      this.memoizedRevealedVal; // memoized display value
    }

    _prototypeProperties(Cell, null, {
      revealedVal: {
        value: function revealedVal() {
          if (this.memoizedRevealedVal !== undefined) {
            return this.memoizedRevealedVal;
          } else if (this.mine) {
            this.memoizedRevealedVal = "*";
          } else if (this.risk === 0) {
            this.memoizedRevealedVal = "";
          } else {
            this.memoizedRevealedVal = this.risk;
          }
          return this.memoizedRevealedVal;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      color: {
        value: function color() {
          if (this.mine) {
            return "#000";
          }
          var color = "";
          switch (this.risk) {
            case 1:
              color = "blue";break;
            case 2:
              color = "green";break;
            case 3:
              color = "red";break;
            case 4:
              color = "purple";break;
            case 5:
              color = "maroon";break;
            case 6:
              color = "turquoise";break;
            case 7:
              color = "black";break;
            case 8:
              color = "grey";break;
          }
          return color;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Cell;
  })();

  var Grid = (function () {
    function Grid(rows, columns, mines) {
      var _this = this;
      this.cells = [];
      this.mineArray = [];
      this.rows = rows;
      this.columns = columns;
      this.mines = mines;

      // Generate grid of empty Cell Objects
      for (var i = 0; i < rows; i++) {
        this.cells[i] = [];
        for (var j = 0; j < columns; j++) {
          this.cells[i][j] = new Cell(i, j);
        }
      }

      // Seed mines randomly in grid and calculate each cell's risk
      for (var c = 0; c < mines; c++) {
        var a = Math.floor(rows * Math.random());
        var b = Math.floor(columns * Math.random());
        if (this.cells[a][b].mine === true) {
          c--;
          continue;
        }
        this.cells[a][b].mine = true;
        this.mineArray.push(this.cells[a][b].id);
        var incrementRisk = this.forEachSurroudingCell(a, b);
        incrementRisk(function (r, c) {
          return _this.cells[r][c].risk += 1;
        });
      }
    }

    _prototypeProperties(Grid, null, {
      forEachSurroudingCell: {

        /**
         * A curry helper method that captures the target cell location
         * in a closure to be used later by the callback(row, column).
         * The curried method will invoke the callback for each surrounding cell
         * that is inside the grid.
         * @param  {number}  row
         * @param  {number}  col
         */
        value: function forEachSurroudingCell(row, col) {
          var _this2 = this;
          /**
           * Invokes the callback for each neighboring cell that is inside the grid
           * @param {Function} callback - takes optional (row, column) arguments
           * @param {Object} context - if no context is passed, it will default to the grid.
           */
          return function (callback) {
            var context = arguments[1] === undefined ? _this2 : arguments[1];
            var isInsideGrid = false;
            for (var i = -1; i <= 1; i++) {
              for (var j = -1; j <= 1; j++) {
                isInsideGrid = row + i >= 0 && col + j >= 0 && row + i < _this2.rows && col + j < _this2.columns;
                if (isInsideGrid && !(i === 0 && j === 0)) {
                  callback.call(context, row + i, col + j);
                }
              }
            }
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      hasWon: {

        /**
         * Maps and reduces the grid's 2d array using each cell's
         * `revealed` and `flagged` attributes as counters.
         * @return {Boolean} - true if rows * columns equals # of revealed cells + # of flagged cells
         */
        value: function hasWon() {
          var counters = function (p, c) {
            return { revealed: p.revealed + c.revealed, flagged: p.flagged + c.flagged };
          };

          var counters = this.cells.map(function (row) {
            return row.map(function (cell) {
              return { revealed: cell.revealed ? 1 : 0, flagged: cell.flagged ? 1 : 0 };
            }).reduce(counters);
          }).reduce(counters);
          return this.rows * this.columns === counters.revealed + counters.flagged;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Grid;
  })();

  MSPolymer.Grid = Grid;

  return MSPolymer;
});
//# sourceMappingURL=grid.js.map