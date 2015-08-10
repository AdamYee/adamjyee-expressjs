'use strict';
Polymer({
  is: 'play-minesweeper',
  properties: {
    rows: {
      type: Number,
      value: 10
    },
    columns: {
      type: Number,
      value: 10
    },
    mines: {
      type: Number,
      value: 10
    },
    board: Object
  },

  ready: function ready() {
    this.board = document.createElement('ms-board');
    Polymer.dom(this.$.board).appendChild(this.board);
  },

  play: function play() {
    this.rows = parseInt(this.$$('#rows').value);
    this.columns = parseInt(this.$$('#columns').value);
    this.mines = parseInt(this.$$('#mines').value);
    var max = this.rows * this.columns;
    if (this.mines > max) {
      this.mines = max - 1;
    }
    if (this.mines < 1) {
      this.mines = 1;
    }
    this.board.rows = this.rows;
    this.board.columns = this.columns;
    this.board.mines = this.mines;
    this.board.play();
  }
});
//# sourceMappingURL=play.js.map