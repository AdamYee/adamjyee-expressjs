'use strict';
var PlayMS = Polymer({
  is: 'ms-board',
  properties: {
    rows: Number,
    columns: Number,
    mines: Number,
    flagCount: { type: Number, value: 0 },
    gameOver: { type: Boolean, value: false },
    win: { type: Boolean, value: false },
    doneExploding: { type: Boolean, value: false },
    grid: Object,

    alreadyRevealed: {
      type: Object,
      value: function value() {
        return {};
      }
    },
    _gameEndMessage: {
      type: String, computed: 'computedEndMessage(win)'
    },
    _gameEndCss: {
      type: String, computed: 'computedEndCss(doneExploding, win)'
    },
    _gameEndColor: {
      type: String, computed: 'computedEndColor(win)'
    }
  },
  computedEndMessage: function computedEndMessage(win) {
    return win ? 'YOU WIN' : 'GAME OVER';
  },
  computedEndCss: function computedEndCss(doneExploding, win) {
    if (doneExploding || win) {
      Polymer.dom(this.$['game-end']).classList.add('show');
    } else {
      Polymer.dom(this.$['game-end']).classList.remove('show');
    }
  },
  computedEndColor: function computedEndColor(win) {
    return 'color:' + (win ? 'green' : 'red');
  },
  /**
   * IMPORTANT: Attributes configured via an element e.g. <x-foo name="bar"></x-foo>
   * are not available in the `created`lifecycle method. They first become available
   * in the `ready` lifecycle method.
   */
  ready: function ready() {
    this.isPlaying = false;
  },
  play: function play() {
    this.gameOver = this.win = this.doneExploding = false;
    this.flagCount = 0;
    this.grid = new MSPolymer.Grid(this.rows, this.columns, this.mines);
    if (this.isPlaying) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          var cell = Polymer.dom(this.$.board).querySelector('#cid_' + i + '_' + j);
          if (cell) {
            cell.reset();
          }
        }
      }
      this.alreadyRevealed = {};
    }
    this.isPlaying = true;
  },
  flaggedHandler: function flaggedHandler(e) {
    this.flagCount += e.detail; // 1 or -1
    this.checkWin();
  },
  checkWin: function checkWin() {
    this.win = this.grid.hasWon();
    if (this.win) {
      this.gameOver = true;
    }
  },
  /**
   * Recursively self reveals cells as 0 risk cells are revealed.
   * Recursion is oddly handled through animation. See `propagate` on ms-cell.html.
   */
  revealNeighbors: function revealNeighbors(e) {
    var _this = this;

    var position = e.target.id.split('_').slice(-2); // get grid position from id
    var row = parseInt(position[0]);
    var col = parseInt(position[1]);
    var revealNeighbor = this.grid.forEachSurroudingCell(row, col);
    revealNeighbor(function (r, c) {
      if (_this.alreadyRevealed.hasOwnProperty('#cid_' + r + '_' + c)) {
        return;
      }
      _this.alreadyRevealed['#cid_' + r + '_' + c] = true;
      /**
       * Common Polymer gotcha:
       * Automatic node finding only works 1 level deep in the shadow DOM tree.
       * Anything deeper can be accessed by using `querySelector` on an
       * automatically found node.
       */
      var neighbor = Polymer.dom(_this.$.board).querySelector('#cid_' + r + '_' + c);
      if (!neighbor.cell.flagged) {
        neighbor.revealed = true; // recursion via data-binding
      }
    }, this);
  },
  /**
   * As soon as any mine explodes, this method fires off the rest
   * to make it a board-wide explosion.
   */
  createExplosion: function createExplosion(e) {
    var _this2 = this;

    this.gameOver = true;

    var unflaggedMines = 0;
    var explodedCount = 0;
    var mineCellIds = this.grid.mineArray.map(function (id) {
      return '#' + id;
    }).join(',');
    var minesArr = Array.from(Polymer.dom(this.$.board).querySelectorAll(mineCellIds));
    minesArr = shuffleArray(minesArr); // shuffle the mines for a random explosion effect

    // know when to show the game over message - after we're done exploding
    var explode = function explode(e) {
      if (e.animationName === 'explode') {
        explodedCount++;
        if (explodedCount === unflaggedMines) {
          _this2.doneExploding = true;
          _this2.removeEventListener('webkitAnimationEnd', explode);
          _this2.removeEventListener('MSAnimationEnd', explode);
          _this2.removeEventListener('animationend', explode);
        }
      }
    };
    this.addEventListener('webkitAnimationEnd', explode);
    this.addEventListener('MSAnimationEnd', explode);
    this.addEventListener('animationend', explode);

    minesArr.forEach(function (cell, i) {
      setTimeout(function () {
        if (!cell.cell.flagged) {
          unflaggedMines++;
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
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
//# sourceMappingURL=board.js.map