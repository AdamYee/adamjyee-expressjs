(function(root, factory) {
  root.MSPolymer = factory(root, {});
}(this, function (root, MSPolymer) {

  function Cell(i, j) {
    // public
    this.mine = false;
    this.revealed = false;
    this.flagged = false;
    this.risk = 0;
    this.id = "cid_" + i + '_' + j;
    // private
    var revealedVal; // memoized display value

    this.revealedVal = function () {
      if (revealedVal !== undefined) {
        return revealedVal;
      } else if(this.mine) {
        revealedVal = '*';
      } else if(this.risk === 0) {
        revealedVal = '';
      } else {
        revealedVal = this.risk;
      }
      return revealedVal;
    };

    this.color = function () {
      if(this.mine) {
        return '#000';
      }
      var color = '';
      switch(this.risk) {
        case 1: color = 'blue'; break;
        case 2: color = 'green'; break;
        case 3: color = 'red'; break;
        case 4: color = 'purple'; break;
        case 5: color = 'maroon'; break;
        case 6: color = 'turquoise'; break;
        case 7: color = 'black'; break;
        case 8: color = 'grey'; break;
      }
      return color;
    };
  }

  function Grid(rows, columns, mines) {
    this.cells = [];
    this.mineArray = [];
    var a;
    var b;
    
    /**
     * A curry helper method that captures the target cell location
     * in a closure to be used later by the callback(row, column).
     * The curried method will invoke the callback for each surrounding cell
     * that is inside the grid.
     * @param  {number}  row
     * @param  {number}  col
     */
    this.forEachSurroudingCell = function(row, col) {
      var self = this;
      /**
       * Performs the callback for each neighboring cell that is inside the grid
       * @param {Function} callback - takes optional (row, column) arguments
       * @param {Object} context - if no context is passed, it will default to the grid.
       */
      return function (callback, context) {
        context = context || self;
        var isInsideGrid = false;
        for(var i = -1; i <= 1; i++) {
          for(var j = -1; j <= 1; j++) {
            isInsideGrid = (row + i >= 0 && col + j >= 0 && row + i < rows && col + j < columns);
            if(isInsideGrid && !(i === 0 && j === 0)) {
              callback.call(context, row + i, col + j);
            }
          }
        }
      };
    };

    /**
     * Maps and reduces the grid's 2d array using each cell's
     * `revealed` and `flagged` attributes as counters.
     * @return {Boolean} - true if rows * columns equals # of revealed cells + # of flagged cells
     */
    this.hasWon = function () {
      function counters (p, c) {
        return { revealed: p.revealed + c.revealed, flagged: p.flagged + c.flagged };
      }
      var counters = this.cells.map(function (row) {
        return row.map(function (cell) {
          return { revealed: cell.revealed ? 1 : 0, flagged: cell.flagged ? 1 : 0 };
        })
        .reduce(counters);
      })
      .reduce(counters);
      return rows * columns === counters.revealed + counters.flagged;
    };

    /*
    Initialize
     */
    
    // Generate grid of empty Cell Objects
    for(var i = 0; i < rows; i++) {
      this.cells[i] = [];
      for(var j = 0; j < columns; j++) {
        this.cells[i][j] = new Cell(i, j);
      }
    }

    // Seed mines randomly in grid and calculate each cell's risk
    for(var c = 0; c < mines; c++) {
      a = Math.floor(rows * Math.random());
      b = Math.floor(columns * Math.random());
      if (this.cells[a][b].mine === true) {
        c--;
        continue;
      }
      this.cells[a][b].mine = true;
      this.mineArray.push(this.cells[a][b].id)
      this.forEachSurroudingCell(a, b)(function (r, c) {
        this.cells[r][c].risk += 1;
      });
    }
  }

  MSPolymer.Grid = Grid;

  return MSPolymer;
}));

