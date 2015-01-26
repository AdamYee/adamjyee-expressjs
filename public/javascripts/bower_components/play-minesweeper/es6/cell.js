"use strict";

Polymer("ms-cell", {
  publish: {
    cell: null,
    revealed: {
      value: false,
      reflect: true
    }
  },
  computedDisplayVal: function computedDisplayVal(flagged, revealed) {
    if (flagged && !revealed) {
      return "F";
    } else {
      return this.cell.revealedVal();
    }
  },
  computed: {
    hide: "!cell.flagged && !revealed",
    displayVal: "computedDisplayVal(cell.flagged, revealed)"
  },
  ready: function ready() {
    var _this = this;
    this.color = this.cell.color();
    /**
     * Recursively reveal a 0 risk cell's neighbors.
     * And check for wins if revealing a risky cell.
     */
    var propagate = function () {
      // only need to fire reveal-neighbors once
      if (_this.revealed && !_this.cell.mine) {
        _this.removeEventListener("webkitAnimationEnd", propagate);
        _this.removeEventListener("MSAnimationEnd", propagate);
        _this.removeEventListener("animationend", propagate);
        if (_this.cell.risk === 0) {
          _this.fire("reveal-neighbors");
        } else {
          _this.fire("check-win");
        }
      }
    };
    this.addEventListener("webkitAnimationEnd", propagate);
    this.addEventListener("MSAnimationEnd", propagate);
    this.addEventListener("animationend", propagate);
  },
  revealedChanged: function revealedChanged() {
    if (this.revealed) {
      this.cell.revealed = true;
      this.setAttribute("class", this.cell.mine ? "explode" : "revealed");
    }
  },
  reveal: function reveal(event, detail, sender) {
    // do nothing if it's already revealed or if it's been flagged.
    if (this.revealed || this.cell.flagged) {
      return;
    }
    this.revealed = true;
    if (this.cell.mine) {
      this.fire("explosion");
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
      if (!this.cell.flagged) {
        this.$.content.setAttribute("class", "flagged drop-flag");
        this.cell.flagged = true;
        this.color = "orange";
        this.fire("flagged", 1);
      } else {
        (function () {
          var removeFlag = function () {
            _this2.cell.flagged = false;
            _this2.color = _this2.cell.color();
            _this2.fire("flagged", -1);
            _this2.$.content.setAttribute("class", "");
            _this2.removeEventListener("webkitAnimationEnd", removeFlag);
            _this2.removeEventListener("MSAnimationEnd", removeFlag);
            _this2.removeEventListener("animationend", removeFlag);
          };
          _this2.addEventListener("webkitAnimationEnd", removeFlag);
          _this2.addEventListener("MSAnimationEnd", removeFlag);
          _this2.addEventListener("animationend", removeFlag);
          /**
           * Animate the flag pickup:
           * Removing a class with animation (possible specific to reverse animation)
           * and then adding a class with animation on different cycles (eventloops)
           * seems to do the trick.
           */
          var content = _this2.$.content;
          content.setAttribute("class", "flagged");
          setTimeout(function () {
            content.setAttribute("class", "flagged pickup-flag");
          }, 0);
        })();
      }
    }
  }
});
//# sourceMappingURL=cell.js.map