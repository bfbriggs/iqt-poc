define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var MarketView = require('./MarketView');

  function AppView() {
    View.apply(this, arguments);
    var marketView = new MarketView();
    this._add(marketView);
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  module.exports = AppView;
});
