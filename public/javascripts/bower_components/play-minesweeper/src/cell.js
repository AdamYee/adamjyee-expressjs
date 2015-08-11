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
  observers: [
    'colorChanged(cell.color)'
  ],
  colorChanged() {
    this.color = `color: ${this.cell.color()}`
  },
  computedHide(flagged, revealed) {
    return !flagged && !revealed;
  },
  computedDisplayVal(flagged, revealed) {
    if(flagged && !revealed) {
      return 'F';
    } else {
      return this.cell.revealedVal();
    }
  },
  ready() {
    this.color = 'color:' + this.cell.color();
    this.bindPropagate();
  },
  bindPropagate() {
    /**
     * Recursively reveal a 0 risk cell's neighbors.
     * And check for wins if revealing a risky cell.
     */
    let propagate = () => {
      // only need to fire reveal-neighbors once
      if(this.revealed && !this.cell.mine) {
        this.removeEventListener('webkitAnimationEnd', propagate);
        this.removeEventListener('MSAnimationEnd', propagate);
        this.removeEventListener('animationend', propagate);
        if(this.cell.risk === 0) {
          this.fire('reveal-neighbors');
        } else {
          this.fire('check-win');
        }
      }
    };
    this.addEventListener('webkitAnimationEnd', propagate);
    this.addEventListener('MSAnimationEnd', propagate);
    this.addEventListener('animationend', propagate);
  },
  revealedChanged() {
    if(this.revealed) {
      this.cell.revealed = true;
      Polymer.dom(this).classList.add(this.cell.mine ? 'explode' : 'revealed');
    }
  },
  reveal(event, detail, sender) {
    // do nothing if it's already revealed or if it's been flagged.
    if(this.revealed || this.cell.flagged) {
      return;
    }
    this.revealed = true;
    if(this.cell.mine) {
      this.fire('explosion');
    }
  },
  /**
   * Event handler for context menu clicks (flagging mines)
   */
  flag(e) {
    e.preventDefault();
    if(this.revealed) {
      return;
    } else {
      let flag = this.$$('#flag');
      if(!this.cell.flagged) {
        Polymer.dom(flag).classList.add('flagged', 'drop-flag');
        this.cell.flagged = this.showFlag = true;
        this.color = 'color:orange';
        this.fire('flagged', 1);
      } else {
        let removeFlag = () => {
          this.cell.flagged = this.showFlag = false;
          Polymer.dom(flag).classList.remove('flagged', 'pickup-flag');
          this.color = 'color:' + this.cell.color();
          this.fire('flagged', -1);
          this.removeEventListener('webkitAnimationEnd', removeFlag);
          this.removeEventListener('MSAnimationEnd', removeFlag);
          this.removeEventListener('animationend', removeFlag);
        };
        this.addEventListener('webkitAnimationEnd', removeFlag);
        this.addEventListener('MSAnimationEnd', removeFlag);
        this.addEventListener('animationend', removeFlag);
        /**
         * Animate the flag pickup:
         * Removing a class with animation (possible specific to reverse animation)
         * and then adding a class with animation on different cycles (eventloops)
         * to prevent flicker and conflicting animation rules.
         */
        Polymer.dom(flag).classList.remove('drop-flag');
        setTimeout(() => {
          Polymer.dom(flag).classList.add('pickup-flag');
        }, 0);
      }
    }
  },

  reset() {
    // hide
    this.revealed = false;
    Polymer.dom(this).classList.remove('explode', 'revealed');
    // unflag
    this.cell.flagged = this.showFlag = false;
    let flag = this.$$('#flag');
    Polymer.dom(flag).classList.remove('flagged', 'drop-flag');
    // rebind event listeners
    this.bindPropagate();
  }
});
