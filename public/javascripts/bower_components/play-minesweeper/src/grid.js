/**
 * ECMAScript 2015 (ES6) version of grid.js
 */
((root, factory) => {
  root.MSPolymer = factory(root, {});
}(this || window /* environment global */, (root, MSPolymer) => {

  class Cell {
    constructor(i, j) {
      this.mine = false;
      this.revealed = false;
      this.flagged = false;
      this.risk = 0;
      this.id = `cid_${i}_${j}`;
      this.memoizedRevealedVal; // memoized display value
    }

    revealedVal() {
      if (this.memoizedRevealedVal !== undefined) {
        return this.memoizedRevealedVal;
      } else if(this.mine) {
        this.memoizedRevealedVal = '*';
      } else if(this.risk === 0) {
        this.memoizedRevealedVal = '';
      } else {
        this.memoizedRevealedVal = this.risk;
      }
      return this.memoizedRevealedVal;
    }

    color() {
      if(this.mine) {
        return '#000';
      }
      let color = '';
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
    }
  }

  class Grid {
    constructor(rows, columns, mines) {
      this.grid = [];
      this.mineArray = [];
      this.rows = rows;
      this.columns = columns;
      this.mines = mines;
      
      // Generate grid of empty Cell Objects
      for(let i = 0; i < rows; i++) {
        this.grid[i] = [];
        for(let j = 0; j < columns; j++) {
          this.grid[i][j] = new Cell(i, j);
        }
      }

      // Seed mines randomly in grid and calculate each cell's risk
      for(let c = 0; c < mines; c++) {
        let a = Math.floor(rows * Math.random());
        let b = Math.floor(columns * Math.random());
        if (this.grid[a][b].mine === true) {
          c--;
          continue;
        }
        this.grid[a][b].mine = true;
        this.mineArray.push(this.grid[a][b].id)
        let incrementRisk = this.forEachSurroudingCell(a, b);
        incrementRisk((r, c) => this.grid[r][c].risk += 1);
      }
    }
    
    /**
     * A curry helper method that captures the target cell location
     * in a closure to be used later by the callback(row, column).
     * The curried method will invoke the callback for each surrounding cell
     * that is inside the grid.
     * @param  {number}  row
     * @param  {number}  col
     */
    forEachSurroudingCell(row, col) {
      /**
       * Invokes the callback for each neighboring cell that is inside the grid
       * @param {Function} callback - takes optional (row, column) arguments
       * @param {Object} context - if no context is passed, it will default to the grid.
       */
      return (callback, context = this) => {
        let isInsideGrid = false;
        for(let i = -1; i <= 1; i++) {
          for(let j = -1; j <= 1; j++) {
            isInsideGrid = (row + i >= 0 && col + j >= 0 && row + i < this.rows && col + j < this.columns);
            if(isInsideGrid && !(i === 0 && j === 0)) {
              callback.call(context, row + i, col + j);
            }
          }
        }
      };
    }

    /**
     * Maps and reduces the grid's 2d array using each cell's
     * `revealed` and `flagged` attributes as counters.
     * @return {Boolean} - true if rows * columns equals # of revealed cells + # of flagged cells
     */
    hasWon() {
      function sumCounters(p, c) {
        return { revealed: p.revealed + c.revealed, flagged: p.flagged + c.flagged };
      }
      let counters = this.grid
        .map((row) =>
          row.map((cell) => {
            return { revealed: cell.revealed ? 1 : 0, flagged: cell.flagged ? 1 : 0 };
          })
          .reduce(sumCounters))
        .reduce(sumCounters);
      return this.rows * this.columns === counters.revealed + counters.flagged;
    }
  }

  MSPolymer.Grid = Grid;

  return MSPolymer;
}));

