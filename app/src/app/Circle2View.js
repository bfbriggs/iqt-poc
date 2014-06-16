define(function(require, exports, module){
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var MarketData = require('./data/MarketData');
  var BarView = require('./Bar2View');
  var SliderView = require('./SliderView');
  var EventHandler = require('famous/core/EventHandler');
  var ContainerSurface = require('famous/surfaces/ContainerSurface');

  //PHYSICS
  var PhysicsEngine = require('famous/physics/PhysicsEngine');
  var Particle = require('famous/physics/bodies/Particle');
  var Drag = require('famous/physics/forces/Drag');
  var Spring = require('famous/physics/forces/Spring');
  
  var Utility = require('famous/utilities/Utility');
  var MouseSync       = require('famous/inputs/MouseSync');
  var TouchSync       = require('famous/inputs/TouchSync');
  var GenericSync = require('famous/inputs/GenericSync');

  GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});

  /** @enum */
  var SpringStates = {
    NONE: 0,
    EDGE: 1
  };

  function CircleView() {
    View.apply(this, arguments);
    this.options = Object.create(this.constructor.DEFAULT_OPTIONS);

    this.sync = new GenericSync(['scroll', 'touch'], {direction : Utility.Direction.X });

    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();

    this._eventInput.pipe(this.sync);
    this.sync.pipe(this._eventInput);

    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);

    //physics stuffs
    this._physicsEngine = new PhysicsEngine(); 
    this._particle = new Particle();
    this._physicsEngine.addBody(this._particle);
    this.spring = new Spring({anchor: [0, 0, 0]});
    this.drag = new Drag({strength: 1E-4, forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC});
    this.friction = new Drag({strength: 4E-3, forceFunction: Drag.FORCE_FUNCTIONS.LINEAR});


    this.chordLength = this.options.chordLength;
    this.barGap = this.options.barGap;
    this.barWidth = this.options.barWidth;
    this.csHeight = this.options.csHeight;
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
      barOpts['idx'] = idx;
      return new BarView(barOpts);
    }.bind(this));
    this.container = new ContainerSurface({size:[this.circleRadius,this.circleRadius], properties:{backgroundColor:'#0E0E0E'}});
    this.bars.forEach(function(bar){
      this.container.add(bar);
    }.bind(this));
    this.add(new Modifier({align:[0.5,1.6],origin:[0.5,0.5]})).add(this.container);
    this.updateBars(0);
    this.container.pipe(this);

    this.container.on('click',function(){this._eventOutput.emit('click');}.bind(this));
//    this._add(new SliderView({size:[10,50]}));

    _bindEvents.call(this);


    this._touchCount = 0;
    this._touchVelocity = undefined;
    this._springState = 0;
    this._prevPos = this.getPosition();
  }




  function _bindEvents() {
    this._eventInput.bindThis(this);
    this._eventInput.on('start', _handleStart);
    this._eventInput.on('update', _handleMove);
    this._eventInput.on('end', _handleEnd);
  }

  function _handleStart(event) {
    this._touchCount = event.count;
    if (event.count === undefined) this._touchCount = 1;

    _detachAgents.call(this);
    this.setVelocity(0);
    this._touchVelocity = 0;
    this._earlyEnd = false;
  }

  function _handleMove(event) {
    var velocity = event.velocity;
    var delta = event.delta;

    this._touchVelocity = velocity;

    if (event.slip) this.setVelocity(velocity);
    else this.setPosition(this.getPosition() + delta);
  }

  function _handleEnd(event) {
    this._touchCount = event.count || 0;
    if (!this._touchCount) {
      _detachAgents.call(this);
      //if (this._onEdge) _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE);
      _attachAgents.call(this);
      var velocity = event.velocity;
      var speedLimit = this.options.speedLimit;
      if (event.slip) speedLimit *= this.options.edgeGrip;
      if (velocity < -speedLimit) velocity = -speedLimit;
      else if (velocity > speedLimit) velocity = speedLimit;
      this.setVelocity(velocity);
      this._touchVelocity = undefined;
      
      this._needsPaginationCheck = true;
    }
  }

  function _attachAgents() {
    if (this._springState) this._physicsEngine.attach([this.spring], this._particle);
    else this._physicsEngine.attach([this.drag, this.friction], this._particle);
  }

  function _detachAgents() {
    this._springState = SpringStates.NONE;
    this._physicsEngine.detachAll();
  }



  function barPos(idx, offset) {
    var barOffset = this.barWidth + this.barGap;
    //the angle between two bar centers
    var tinyAngle = 2 * Math.PI * barOffset / this.circumference;
    var triAngle = tinyAngle * (offset + idx);
    var x = pol2Car(triAngle, this.circleRadius).x; 
    var y = pol2Car(triAngle, this.circleRadius).y; 
    return {
      x: x,
      y: y, 
      angle: triAngle
    };
  }

  // angle is the central angle of the arc from the top of the circle to the specified point
  function pol2Car(angle, radius){
    return {
      x: Math.sin(angle) * radius,
      y: Math.cos(angle) * radius
    };
  }

  // linear function (not very accurate)
  function offset2Ang(vect){
    return Math.atan(vect.deltaX / this.circleRadius);
  }


  CircleView.prototype = Object.create(View.prototype);
  CircleView.prototype.constructor = CircleView;

  CircleView.DEFAULT_OPTIONS = {
    chordLength: window.innerWidth,
    csHeight: window.innerHeight * 1 / 6,
    barGap: (40*Math.PI - 30),
    barWidth: 30,
    dragMultiple: 1,
    speedLimit: 100,
    edgeGrip: 0.5
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
    var angleDelta = offset2Ang.call(this, {deltaX:delta});
    //Grab slice that definitely needs to be update
    var visibleBarsObj = this.getVisibleBars();
    var visibleBars = visibleBarsObj.arr;
    var startOffset = visibleBarsObj.startOffset;
    var endOffset = visibleBarsObj.endOffset;
    // this should be optimized
    this.bars.map(function(bar, i){
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

  CircleView.prototype.setPosition = function setPosition(x){
    this._particle.setPosition1D(x);
  };

  CircleView.prototype.getPosition = function getPosition(){
    return this._particle.getPosition1D();
  };

  CircleView.prototype.setVelocity = function setVelocity(v){
    this._particle.setVelocity1D(v);
  };

  CircleView.prototype.getVelocity = function getVelocity(){
    return this._touchCount ? this._touchVelocity : this._particle.getVelocity1D();
  };
 
  CircleView.prototype.render = function(){
    
    this.updateBars(this.getPosition() - this._prevPos);
    this._prevPos = this.getPosition();
    return View.prototype.render.apply(this,arguments);
  }

  module.exports = CircleView;

});
