define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var ContainerSurface = require('famous/surfaces/ContainerSurface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var GenericSync     = require('famous/inputs/GenericSync');
  var MouseSync       = require('famous/inputs/MouseSync');
  var TouchSync       = require('famous/inputs/TouchSync');
  var CircleView = require('./Circle2View');
  GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
  
  function MarketView() {
    var transitioning = false;
    
    View.apply(this, arguments);
    //_handleSwipe.call(this);
    this.mod = new StateModifier({origin: [1,0.5]});
    this.rotateMod = new StateModifier({origin: [1,0.5]});
    this.currAngle = 0;
    var surface = new Surface({
      size: [undefined, undefined],
      properties: {
        backgroundColor:'black',
        opacity:0
      }
    });

    this.pivotOut = Transform.multiply(
          Transform.rotateY(-1 * Math.PI/8),
          Transform.scale(0.6, 0.6, 1),
          Transform.identity);


    //var port = this._add(this.mod);
    //port.add(surface);
    this.marketContainer = new ContainerSurface({properties:{backgroundColor:'#0E0E0E',overflow:'hidden'}});
    this.circleView = new CircleView();
    this.marketContainer.pipe(this.circleView);
    //this.rot = this._add(this.rotateMod);
    this.marketContainer.add(this.circleView)
    this._add(this.rotateMod).add(this.marketContainer);
    this.button = new Surface({size:[80,80],properties:{backgroundColor:'white',borderRadius:'10px'}});
    this._add(new Modifier()).add(this.button);
    this.button.on('click',function(){
        this._eventOutput.emit('showMenu');
        this.rotateMod.setTransform(this.pivotOut, { duration : 600, curve: 'easeOut' }, function(){
          transitioning = false;
        });
    console.log('caught');
    }.bind(this));
    
    surface.on('click',function(){
      this._eventOutput.emit('showMenu');
      if (!transitioning){
        transitioning = true;
        this.mod.setTransform(this.pivotOut, { duration : 600, curve: 'easeOut' }, function(){
          transitioning = false;
        });
        this.rotateMod.setTransform(this.pivotOut, { duration : 600, curve: 'easeOut' }, function(){
          transitioning = false;
        });
        console.log("th");
      }
    }.bind(this));
  }


  MarketView.prototype = Object.create(View.prototype);
  
  MarketView.prototype.swingBack = function(){
      this.rotateMod.setTransform(Transform.identity, { duration : 600, curve: 'easeOut' });
  };
  
  MarketView.prototype.constructor = MarketView;



  module.exports = MarketView;
});
