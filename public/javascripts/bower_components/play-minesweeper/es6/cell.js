'use strict';

Polymer({
  is: 'ms-cell',
  properties: {
    cell: Object,
    color: {
      type: String,
      notify: true
    },
    revealed: {
      type: Boolean,
      value: false,
      observer: 'revealedChanged'
    },
    hide: {
      type: Boolean,
      computed: 'computedHide(cell.flagged, revealed)'
    },
    showFlag: { type: Boolean, value: false },
    displayVal: {
      type: String,
      computed: 'computedDisplayVal(cell.flagged, revealed)'
    }
  },
  observers: ['colorChanged(cell.color)'],
  colorChanged: function colorChanged() {
    this.color = 'color: ' + this.cell.color();
  },
  computedHide: function computedHide(flagged, revealed) {
    return !flagged && !revealed;
  },
  computedDisplayVal: function computedDisplayVal(flagged, revealed) {
    if (flagged && !revealed) {
      return 'F';
    } else {
      return this.cell.revealedVal();
    }
  },
  ready: function ready() {
    this.color = 'color:' + this.cell.color();
    this.bindPropagate();
  },
  bindPropagate: function bindPropagate() {
    var _this = this;

    /**
     * Recursively reveal a 0 risk cell's neighbors.
     * And check for wins if revealing a risky cell.
     */
    var propagate = function propagate() {
      // only need to fire reveal-neighbors once
      if (_this.revealed && !_this.cell.mine) {
        _this.removeEventListener('webkitAnimationEnd', propagate);
        _this.removeEventListener('MSAnimationEnd', propagate);
        _this.removeEventListener('animationend', propagate);
        if (_this.cell.risk === 0) {
          _this.fire('reveal-neighbors');
        } else {
          _this.fire('check-win');
        }
      }
    };
    this.addEventListener('webkitAnimationEnd', propagate);
    this.addEventListener('MSAnimationEnd', propagate);
    this.addEventListener('animationend', propagate);
  },
  revealedChanged: function revealedChanged() {
    if (this.revealed) {
      this.cell.revealed = true;
      Polymer.dom(this).classList.add(this.cell.mine ? 'explode' : 'revealed');
    }
  },
  reveal: function reveal(event, detail, sender) {
    // do nothing if it's already revealed or if it's been flagged.
    if (this.revealed || this.cell.flagged) {
      return;
    }
    this.revealed = true;
    if (this.cell.mine) {
      this.fire('explosion');
    }
  },
  /**
   * Event handler for context menu clicks (flagging mines)
   */
  flag: function flag(e) {
    var _this2 = this;

    e.preventDefault();
    if (this.revealed) {
      return;
    } else {
      (function () {
        var flag = _this2.$$('#flag');
        if (!_this2.cell.flagged) {
          Polymer.dom(flag).classList.add('flagged', 'drop-flag');
          _this2.cell.flagged = _this2.showFlag = true;
          _this2.color = 'color:orange';
          _this2.fire('flagged', 1);
        } else {
          (function () {
            var removeFlag = function removeFlag() {
              _this2.cell.flagged = _this2.showFlag = false;
              Polymer.dom(flag).classList.remove('flagged', 'pickup-flag');
              _this2.color = 'color:' + _this2.cell.color();
              _this2.fire('flagged', -1);
              _this2.removeEventListener('webkitAnimationEnd', removeFlag);
              _this2.removeEventListener('MSAnimationEnd', removeFlag);
              _this2.removeEventListener('animationend', removeFlag);
            };
            _this2.addEventListener('webkitAnimationEnd', removeFlag);
            _this2.addEventListener('MSAnimationEnd', removeFlag);
            _this2.addEventListener('animationend', removeFlag);
            /**
             * Animate the flag pickup:
             * Removing a class with animation (possible specific to reverse animation)
             * and then adding a class with animation on different cycles (eventloops)
             * to prevent flicker and conflicting animation rules.
             */
            Polymer.dom(flag).classList.remove('drop-flag');
            setTimeout(function () {
              Polymer.dom(flag).classList.add('pickup-flag');
            }, 0);
          })();
        }
      })();
    }
  },

  reset: function reset() {
    // hide
    this.revealed = false;
    Polymer.dom(this).classList.remove('explode', 'revealed');
    // unflag
    this.cell.flagged = this.showFlag = false;
    var flag = this.$$('#flag');
    Polymer.dom(flag).classList.remove('flagged', 'drop-flag');
    // rebind event listeners
    this.bindPropagate();
  }
});
//# sourceMappingURL=cell.js.map