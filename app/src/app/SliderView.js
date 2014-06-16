define(function(require, exports, module){
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var InputSurface = require('famous/surfaces/InputSurface');
  var Modifier = require('famous/core/Modifier');
  
  function SliderView(){
    View.apply(this, arguments);
    var displaySurface = new Surface({});
    var sliderSurface = new InputSurface({
      type: 'range',
        size:[10,30]
    });
    sliderSurface.on('change',function(){
   console.log(arguments);
    });

    this._add(displaySurface);
    this._add(sliderSurface);
  }
  
  SliderView.prototype = Object.create(View.prototype);
  SliderView.prototype.constructor = SliderView;

  module.exports = SliderView;
});
