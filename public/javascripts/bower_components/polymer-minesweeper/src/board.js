'use strict';
Polymer({
  created() {
    this.gameOver = false;
    this.win = false;
    this.doneExploding = false;
    this.flagCount = 0;
    this.grid = null; // Grid object
  },
  /**
   * IMPORTANT: Attributes configured via an element e.g. <x-foo name="bar"></x-foo>
   * are not available in the `created`lifecycle method. They first become available
   * in the `ready` lifecycle method.
   */
  ready() {
    this.grid = new MSPolymer.Grid(this.rows, this.columns, this.mines);
  },
  computed: {
    'gameEndMessage': 'win ? "YOU WIN" : "GAME OVER"'
  },
  flaggedHandler(Event, object, element) {
    this.flagCount += object; // object is 1 or -1
    this.checkWin();
  },
  checkWin() {
    this.win = this.grid.hasWon();
    if (this.win) {
      this.gameOver = true;
    }
  },
  /**
   * Recursively self reveals cells as 0 risk cells are revealed.
   * Recursion is oddly handled through animation. See `propagate` on ms-cell.html.
   */
  revealNeighbors(Event, object, element) {
    let position = element.id.split('_').slice(-2); // get grid position from id
    let row = parseInt(position[0]);
    let col = parseInt(position[1]);
    let revealNeighbor = this.grid.forEachSurroudingCell(row, col);
    revealNeighbor((r, c) => {
      /**
       * Common Polymer gotcha:
       * Automatic node finding only works 1 level deep in the shadow DOM tree.
       * Anything deeper can be accessed by using `querySelector` on an
       * automatically found node.
       */
      let neighbor = this.$.board.querySelector('#cid_' + r + '_' + c);
      if (!neighbor.cell.flagged) {
        neighbor.revealed = true; // recursion via data-binding
      }
    }, this);
  },
  /**
   * As soon as any mine explodes, this method fires off the rest
   * to make it a board-wide explosion.
   */
  createExplosion(Event, object, element) {
    this.gameOver = true;

    let mineCellIds = this.grid.mineArray.map((id) => '#' + id).join(',');
    let minesArr = Array.from(this.$.board.querySelectorAll(mineCellIds));
    minesArr = shuffleArray(minesArr); // shuffle the mines for a random explosion effect

    // know when to show the game over message - after we're done exploding
    let explodedCount = 0;
    let explode = (e) => {
      if (e.animationName === 'explode') {
        explodedCount++;
        if (explodedCount === this.mines - this.flagCount) {
          this.doneExploding = true
        }
      }
    };
    this.addEventListener('webkitAnimationEnd', explode);
    this.addEventListener('MSAnimationEnd', explode);
    this.addEventListener('animationend', explode);

    minesArr.forEach((cell, i) => {
      setTimeout(() => {
        if (!cell.cell.flagged) {
          cell.revealed = true; // explode unflagged mines
        }
      }, i % 2 === 0 ? i * 15 : i * 12);
    });
  }
});

/*
Utils
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
