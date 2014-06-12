define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var GenericSync     = require('famous/inputs/GenericSync');
  var MouseSync       = require('famous/inputs/MouseSync');
  var TouchSync       = require('famous/inputs/TouchSync');
  var CircleView = require('./CircleView');
  GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
  
  function MarketView() {
    var transitioning = false;
    
    View.apply(this, arguments);
    _handleSwipe.call(this);
    this.mod = new StateModifier({origin: [1,0.5]});
    var surface = new ImageSurface({
      size: [undefined, undefined]
    });

    surface.setContent('./images/market_screen.png');
    this.pivotOut = Transform.multiply(
          Transform.rotateY(-1 * Math.PI/8),
          Transform.scale(0.9, 0.9, 1),
          Transform.identity);


    surface.on('click',function(){
      this._eventOutput.emit('showMenu');
      if (!transitioning){
        transitioning = true;
        this.mod.setTransform(this.pivotOut, { duration : 600, curve: 'easeOut' }, function(){
          transitioning = false;
        });
      }
    }.bind(this));
    surface.pipe(this._eventOutput);

    //this._add(this.mod).add(surface);
    this._add(new CircleView());
  }


  MarketView.prototype = Object.create(View.prototype);
  
  MarketView.prototype.swingBack = function(){
      this.mod.setTransform(Transform.identity, { duration : 600, curve: 'easeOut' });
  };
  
  MarketView.prototype.constructor = MarketView;

  function _handleSwipe() {
    var sync = new GenericSync(
      ['mouse', 'touch'],
      {direction : GenericSync.DIRECTION_X}
    );

    this.pipe(sync);

    sync.on('update', function(data) {
      console.log(data.delta);
      console.log(data);
    }.bind(this));
    console.log('bindings');
  }


  module.exports = MarketView;
});
