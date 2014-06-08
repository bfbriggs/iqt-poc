define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var MarketView = require('./MarketView');
  var MenuView = require('./MenuView');

  function AppView() {
    View.apply(this, arguments);
    var marketView = new MarketView();
    var menuView = new MenuView();
    this._add(marketView);
    this._add(menuView);
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  module.exports = AppView;
});
