define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var FastClick = require('famous/inputs/FastClick');
  var MarketView = require('./MarketView');
  var MenuView = require('./MenuView');

  function AppView() {
    View.apply(this, arguments);
    this.marketView = new MarketView();
    this.menuView = new MenuView();
    this._add(this.marketView);
    this._add(this.menuView);
    setUpListeners.call(this);
  }

  function setUpListeners() {
    this.marketView.on('showMenu',function(){
      this.menuView.fader.show();
    }.bind(this));
    
    this.menuView.on('restoreContent',function(){
      this.marketView.swingBack(); 
    }.bind(this));
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  module.exports = AppView;
});
