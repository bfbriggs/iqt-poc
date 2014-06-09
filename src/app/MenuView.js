define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var Fader = require('famous/modifiers/Fader');

  function MenuView() {
    View.apply(this, arguments);
    var surface = new Surface({
      size: [undefined, undefined],
        content: "Hello World",
        classes: ["red-bg"],
        properties: {
          lineHeight: "200px",
          textAlign: "center",
          backgroundImage: "-webkit-gradient( linear, left top , right top, from(rgba(0,0,0,0.8)), to(rgba(80,80,80,0.1)))"
        }
    });

    this.fader = new Fader({cull:true},false);
    surface.on('click', function(){
      this.fader.hide();
      this._eventOutput.emit('restoreContent');
    }.bind(this));
    this._add(this.fader).add(surface);
  }

  MenuView.prototype = Object.create(View.prototype);
  MenuView.prototype.constructor = MenuView;

  module.exports = MenuView;
});
