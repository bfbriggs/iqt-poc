define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');

  function MenuView() {
    View.apply(this, arguments);
    var surface = new Surface({
      size: [200, undefined],
        content: "Hello World",
        classes: ["red-bg"],
        properties: {
          lineHeight: "200px",
          textAlign: "center",
          backgroundColor: "rgba(155,155,100,0.5)"
        }
    });
    this._add(surface);
  }

  MenuView.prototype = Object.create(View.prototype);
  MenuView.prototype.constructor = MenuView;

  module.exports = MenuView;
});
