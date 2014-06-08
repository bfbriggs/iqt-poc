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
    var mod = new StateModifier();
    
    surface.on('click',function(){
      mod.setTransform(Transform.multiply(Transform.multiply(
     //                 Transform.translate(window.innerWidth - 140, 0, 80),
                      Transform.translate(0, 80, 0),
                      Transform.rotateY(-1 * Math.PI/6)
                      ), Transform.scale(0.6, 0.6, 1)),
        { duration : 1000, curve: 'linear' });
    });
     this._add(mod).add(surface);
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  module.exports = AppView;
});
