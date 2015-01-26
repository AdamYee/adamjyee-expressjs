Polymer('ms-cell', {
  publish: {
    cell: null,
    revealed: {
      value: false,
      reflect: true
    }
  },
  computedDisplayVal(flagged, revealed) {
    if(flagged && !revealed) {
      return 'F';
    } else {
      return this.cell.revealedVal();
    }
  },
  computed: {
    'hide'            : '!cell.flagged && !revealed',
    'displayVal'      : 'computedDisplayVal(cell.flagged, revealed)'
  },
  ready() {
    this.color = this.cell.color();
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
      this.setAttribute('class', this.cell.mine ? 'explode' : 'revealed');
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
      if(!this.cell.flagged) {
        this.$.content.setAttribute('class', 'flagged drop-flag');
        this.cell.flagged = true;
        this.color = 'orange';
        this.fire('flagged', 1);
      } else {
        let removeFlag = () => {
          this.cell.flagged = false;
          this.color = this.cell.color();
          this.fire('flagged', -1);
          this.$.content.setAttribute('class', '');
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
         * seems to do the trick.
         */
        let content = this.$.content;
        content.setAttribute('class', 'flagged');
        setTimeout(() => {
          content.setAttribute('class', 'flagged pickup-flag');
        }, 0);
      }
    }
  }
});
