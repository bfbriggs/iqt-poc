define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');

  function BarView(options) {
    View.apply(this, arguments);
    this.options = this.constructor.DEFAULT_OPTIONS;
    this.dataOptions = options;
    this.modifier = new StateModifier({});
    this.surface = createSurface.call(this, options.data);
    this._add(this.modifier).add(this.surface);
  }

  function createSurface(item){
    var positive = (item.val > 0);
    var gradient = (positive) ? this.options.positiveGradient : this.options.negativeGradient;
    console.log(gradient);
    var surface = new Surface({
      size: [20, 50],
      content: '',
      properties: {
        backgroundImage: gradient
      }
    });

    return surface;
  }

  BarView.prototype = Object.create(View.prototype);
  BarView.prototype.constructor = BarView;
  
  // Return if in viewport (yes for now)
  BarView.prototype.isVisible = function(){
    return true;
  };

  // update position
  BarView.prototype.updatePos = function(angleDelta){
   var newAngle = this.getPos().angle + angleDelta;
   var coords = pol2Car(newAngle, this.dataOptions.circle.circleRadius); 
  
   this.dataOptions.x = coords.x;
   this.dataOptions.y = coords.y;
   this.dataOptions.angle = newAngle;

    this.modifier.setTransform(Transform.translate(coords.x, coords.y, 0));
  };

  BarView.prototype.getPos = function(){
    return {
      x: this.dataOptions.x,
      y: this.dataOptions.y,
      angle: this.dataOptions.angle
    };
  };

  BarView.DEFAULT_OPTIONS = {
    negativeGradient: "linear-gradient(to left,#500a14 0% ,#d91a36 100% )",
    positiveGradient: "linear-gradient(to right,#034f5d 0% ,#07bcde 100% )"
  };
  
  // angle is the central angle of the arc from the top of the circle to the specified point
  function pol2Car(angle, radius){
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  }

  module.exports = BarView;
});
