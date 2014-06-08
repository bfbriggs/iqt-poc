define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
 
  function AppView() {
    View.apply(this, arguments);
    var surface = new Surface({
          size: [undefined, undefined],
            content: "Hello World",
            classes: ["red-bg"],
            properties: {
                lineHeight: "200px",
                textAlign: "center",
                backgroundColor: "blue"
          }
    });
    var mod = new StateModifier({origin: [1,0.5]});
    
    surface.on('click',function(){
      var transform = Transform.multiply(Transform.multiply(
     //                 Transform.translate(window.innerWidth - 140, 0, 80),
                      Transform.translate(0, 0, 0),
                      Transform.rotateY(-1 * Math.PI/6)
                      ), Transform.scale(0.9, 0.9, 1));
      mod.setTransform(transform, { duration : 600, curve: 'easeOut' });
    });
     this._add(mod).add(surface);
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  module.exports = AppView;
});
