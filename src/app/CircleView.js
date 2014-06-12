define(function(require, exports, module){
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var MarketData = require('./data/MarketData');
  var BarView = require('./BarView');

  function CircleView() {
    View.apply(this, arguments);
    this.centralAngle = 4 * Math.atan(this.csHeight / (this.chordLength / 2));
    this.circleRadius = (this.chordLength / 2) / Math.sin(this.centralAngle / 2);
    this.circumference = 2 * Math.PI * this.circleRadius;
    this.arcLength = this.circumference * this.centralAngle / (2 * Math.PI);
    // Hard-coded... for now...
    var offset = 0;
    // initialize bars
    this.bars = MarketData.map(function(item, idx){
      var barOpts = barPos.call(this, idx, offset);
      barOpts['data'] = item;
      barOpts['circle'] = this;
      return new BarView(barOpts);
    }.bind(this));
    this.updateBars(0);
    this.bars.forEach(function(bar){
      this.add(bar);
    }.bind(this));
  }


  function barPos(idx, offset) {
    var barOffset = this.barWidth + this.barGap;
    //the angle between two bar centers
    var tinyAngle = 2 * Math.PI * barOffset / this.circumference;
    var triAngle = Math.PI/2 - tinyAngle * (offset + idx);
    var x = pol2Car(triAngle, this.circleRadius).x; 
    var y = pol2Car(triAngle, this.circleRadius).y; 
    var angle = tinyAngle * (offset + idx);
    return {
      x: x,
      y: y, 
      angle: angle
    };
  }

  // angle is the central angle of the arc from the top of the circle to the specified point
  function pol2Car(angle, radius){
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  }

  // linear function (not very accurate)
  function offset2Ang(vect){
    return Math.atan(vect.deltaX / this.circleRadius);
  }


  CircleView.prototype = Object.create(View.prototype);
  CircleView.prototype.constructor = CircleView;

  CircleView.DEFAULT_OPTIONS = {
    chordLength: 1000,
    csHeight: 200,
    barGap: 30,
    barWidth: 20,
    dragMultiple: 1
  };


  CircleView.prototype.getVisibleBars = function(){
    //convert to binary search
    var searchArr = this.bars.filter(function(bar){
      return bar.isVisible();
    });
    return {
      arr: searchArr,
      startOffset: this.bars.indexOf(searchArr[0]),
      endOffset: this.bars.indexOf(searchArr[searchArr.length - 1])
    };
  }

  // Set new positions of bars
  // delta is expressed in x-delta for now...
  CircleView.prototype.updateBars = function(delta){
    var angleDelta = offset2Ang.call(this, delta);
    //Grab slice that definitely needs to be update
    var visibleBarsObj = this.getVisibleBars();
    var visibleBars = visibleBarsObj.arr;
    var startOffset = visibleBarsObj.startOffset;
    var endOffset = visibleBarsObj.endOffset;
    // this should be optimized
    this.bars.map(function(bar){
      bar.updatePos(angleDelta);
    });   

//    //right
//    if (delta > 0){
//      this.getLeft(this.bars).concat(visibleBars).map(function(bar){
//        bar.updatePos(delta);
//      });   
//    }
//    //left
//    else if (delta < 0){
//      visibleBars.concat(this.getLeft(this.bars)).map(function(bar){
//        bar.updatePos(delta);
//      });   
//    }
  }

  module.exports = CircleView;

});
