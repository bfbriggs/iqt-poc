define(function(require, exports, module){
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var MarketData = require('./data/MarketData');

  function CircleView() {
    View.apply(this, arguments);
    this.centralAngle = 4 * Math.atan(this.csHeight/(this.chordLength/2));
    this.circleRadius = (this.chordLength/2)/Math.sin(this.centralAngle/2);
    this.circumference = 2 * Math.PI * this.circleRadius;
    this.arcLength = this.circumference * this.centralAngle/(2*Math.PI);

    var offset;
    // initialize bars
    MarketData.map(function(item, idx){
      return new BarView(barPos.call(this, idx, offset));
    }.bind(this));
  }

  function barPos(idx, offset) {
    var barOffset = this.barWidth + this.barGap;
    var tinyAngle = 2 * Math.PI * barOffset/this.circumference;
    var triAngle = Math.PI/2 - tinyAngle * (offset + idx);
    var x = Math.cos(triAngle) * this.circleRadius;
    var y = Math.sin(triAngle) * this.circleRadius;
    var angle = tinyAngle * (offset + idx);
    return {
      x: x,
      y: y, 
      angle: angle
    };
  }

  CircleView.prototype = Object.create(View.prototype);
  CircleView.prototype.constructor = CircleView;

  CircleView.DEFAULT_OPTIONS = {
    chordLength: 1000,
    csHeight: 200,
    barGap: 30,
    barWidth: 20,
  };

});
