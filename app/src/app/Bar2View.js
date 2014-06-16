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
    this.modifier = new StateModifier({
      origin: [0.5, 1],
      align: [0.5,0.5]
    });
    this.surface = createSurface.call(this, options.data, options.idx);
    this._add(this.modifier).add(this.surface);
  }

  function createSurface(item, idx){
    var positive = (item.val > 0);
    var gradient = (positive) ? this.options.positiveGradient : this.options.negativeGradient;
    var surface = new Surface({
      size: [window.innerWidth/18, window.innerWidth/9 + Math.max(5 , Math.abs(item.val * 3000)) ],
      content: '',
      properties: {
        backgroundImage: gradient,
        borderRadius: '10px'
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

    var halfOffset = this.dataOptions.circle.chordLength / 2 + 100;
   //console.log("*******",coords);
    var flipAngle = (this.dataOptions.data.val > 0) ? 0 : Math.PI;
    var flipMult = (this.dataOptions.data.val > 0) ? 1 : -1;
    var centerTranslate = window.innerHeight;
    this.modifier.setTransform(Transform.multiply(Transform.rotateZ(newAngle + flipAngle),Transform.translate(0, -this.dataOptions.circle.circleRadius * 0.8 * flipMult)));
//    this.modifier.setTransform(Transform.multiply(Transform.rotateZ(newAngle), Transform.translate(coords.x,  - coords.y, 0)));
  };

  BarView.prototype.getPos = function(){
    return {
      x: this.dataOptions.x,
      y: this.dataOptions.y,
      angle: this.dataOptions.angle
    };
  };

  BarView.DEFAULT_OPTIONS = {
    negativeGradient: "linear-gradient(to bottom, rgba(123,1,0,1) 0%, rgba(207,4,4,1) 72%)",
    positiveGradient: "linear-gradient(to bottom, rgba(32,192,240,1) 0%,rgba(20,120,140,1) 72%)"
  };
  
  // angle is the central angle of the arc from the top of the circle to the specified point
  function pol2Car(angle, radius){
    return {
      x: Math.sin(angle) * radius,
      y: Math.cos(angle) * radius
    };
  }

  module.exports = BarView;
});
