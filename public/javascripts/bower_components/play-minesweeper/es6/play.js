"use strict";
Polymer({
  inputsConfig: [{
    name: "rows",
    step: 5,
    min: 5,
    max: 20,
    value: 10
  }, {
    name: "columns",
    step: 5,
    min: 5,
    max: 40,
    value: 15
  }, {
    name: "mines",
    step: 5,
    min: 5,
    max: 200,
    value: 15
  }],

  /**
   * Inject the board dynamically
   */
  play: function play() {
    this.$.board.innerHTML = "";
    var max = this.inputsConfig[0].value * this.inputsConfig[1].value;
    if (this.inputsConfig[2].value > max) {
      this.inputsConfig[2].value = max - 1;
    }
    if (this.inputsConfig[2].value < 1) {
      this.inputsConfig[2].value = 1;
    }
    this.injectBoundHTML("<ms-board rows={{inputsConfig[0].value}} columns={{inputsConfig[1].value}} mines={{inputsConfig[2].value}}></ms-board>", this.$.board);
  }
});
//# sourceMappingURL=play.js.map