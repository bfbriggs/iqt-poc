define(function(require, exports, module){
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');

  function CircleView() {
    View.apply(this, arguments);
    this.centralAngle = 4 * Math.atan(this.csHeight/this.chordLength);

  }

  CircleView.prototype = Object.create(View.prototype);
  CircleView.prototype.constructor = CircleView;

  CircleView.DEFAULT_OPTIONS = {
    chordLength: 1000,
    csHeight: 200,
    barGap: 30
  };

});
