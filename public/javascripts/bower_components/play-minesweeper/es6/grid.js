/**
 * ECMAScript 2015 (ES6) version of grid.js
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (root, factory) {
  root.MSPolymer = factory(root, {});
})(undefined || window /* environment global */, function (root, MSPolymer) {
  var Cell = (function () {
    function Cell(i, j) {
      _classCallCheck(this, Cell);

      this.mine = false;
      this.revealed = false;
      this.flagged = false;
      this.risk = 0;
      this.id = 'cid_' + i + '_' + j;
      this.memoizedRevealedVal; // memoized display value
    }

    _createClass(Cell, [{
      key: 'revealedVal',
      value: function revealedVal() {
        if (this.memoizedRevealedVal !== undefined) {
          return this.memoizedRevealedVal;
        } else if (this.mine) {
          this.memoizedRevealedVal = '*';
        } else if (this.risk === 0) {
          this.memoizedRevealedVal = '';
        } else {
          this.memoizedRevealedVal = this.risk;
        }
        return this.memoizedRevealedVal;
      }
    }, {
      key: 'color',
      value: function color() {
        if (this.mine) {
          return '#000';
        }
        var color = '';
        switch (this.risk) {
          case 1:
            color = 'blue';break;
          case 2:
            color = 'green';break;
          case 3:
            color = 'red';break;
          case 4:
            color = 'purple';break;
          case 5:
            color = 'maroon';break;
          case 6:
            color = 'turquoise';break;
          case 7:
            color = 'black';break;
          case 8:
            color = 'grey';break;
        }
        return color;
      }
    }]);

    return Cell;
  })();

  var Grid = (function () {
    function Grid(rows, columns, mines) {
      var _this = this;

      _classCallCheck(this, Grid);

      this.grid = [];
      this.mineArray = [];
      this.rows = rows;
      this.columns = columns;
      this.mines = mines;

      // Generate grid of empty Cell Objects
      for (var i = 0; i < rows; i++) {
        this.grid[i] = [];
        for (var j = 0; j < columns; j++) {
          this.grid[i][j] = new Cell(i, j);
        }
      }

      // Seed mines randomly in grid and calculate each cell's risk
      for (var c = 0; c < mines; c++) {
        var a = Math.floor(rows * Math.random());
        var b = Math.floor(columns * Math.random());
        if (this.grid[a][b].mine === true) {
          c--;
          continue;
        }
        this.grid[a][b].mine = true;
        this.mineArray.push(this.grid[a][b].id);
        var incrementRisk = this.forEachSurroudingCell(a, b);
        incrementRisk(function (r, c) {
          return _this.grid[r][c].risk += 1;
        });
      }
    }

    _createClass(Grid, [{
      key: 'forEachSurroudingCell',

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
      }
    }, {
      key: 'hasWon',

      /**
       * Maps and reduces the grid's 2d array using each cell's
       * `revealed` and `flagged` attributes as counters.
       * @return {Boolean} - true if rows * columns equals # of revealed cells + # of flagged cells
       */
      value: function hasWon() {
        function sumCounters(p, c) {
          return { revealed: p.revealed + c.revealed, flagged: p.flagged + c.flagged };
        }
        var counters = this.grid.map(function (row) {
          return row.map(function (cell) {
            return { revealed: cell.revealed ? 1 : 0, flagged: cell.flagged ? 1 : 0 };
          }).reduce(sumCounters);
        }).reduce(sumCounters);
        return this.rows * this.columns === counters.revealed + counters.flagged;
      }
    }]);

    return Grid;
  })();

  MSPolymer.Grid = Grid;

  return MSPolymer;
});
//# sourceMappingURL=grid.js.map