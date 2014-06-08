define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  
  function AppView() {
    View.apply(this, arguments);
    var surface = new Surface({
          size: [200, 200],
            content: "Hello World",
            classes: ["red-bg"],
            properties: {
                      lineHeight: "200px",
                textAlign: "center"
          }
    });
    this._add(surface);
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  module.exports = AppView;
});
