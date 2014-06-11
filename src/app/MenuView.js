define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var Fader = require('famous/modifiers/Fader');
  var ImageSurface = require('famous/surfaces/ImageSurface');

  function MenuView() {
    var searchSize = [undefined, window.innerWidth * 90/1126];
    var menuSize = [window.innerWidth * 268/1126, window.innerHeight * 518/728];

    View.apply(this, arguments);
    var backSurface = new Surface({
      size: [undefined, undefined],
        content: "",
        classes: ["menu"],
        properties: {
          lineHeight: "200px",
          textAlign: "center",
          backgroundImage: "-webkit-gradient( linear, left top , right top, from(rgba(0,0,0,0.8)), to(rgba(80,80,80,0.5)))"
        },
        transform: Transform.behind
    });
    var backModifier = new StateModifier({
        transform: Transform.behind
    });

    this.fader = new Fader({cull:true},false);

    var fade = this._add(this.fader);

    fade.add(backModifier).add(backSurface);

    var menuSurface = new ImageSurface({
      size: menuSize
    });
    menuSurface.setContent('./images/menu.png');
    
    var menuModifier = new StateModifier({
      align: [0,1],
      origin: [0,1]
    });

    var searchSurface = new ImageSurface({
      size: searchSize
    });
    searchSurface.setContent('./images/search.png');
    
    var searchModifier = new StateModifier({
      align: [0,0],
      origin: [0,0]
    });
    fade.add(menuModifier).add(menuSurface);
    fade.add(searchModifier).add(searchSurface);
    
    menuSurface.on('click', function(){
      if (!this.transitioning){
        this.transitioning = true;
        this.fader.hide(undefined, function(){
          this.transitioning = false;
        }.bind(this));
        this._eventOutput.emit('restoreContent');
      }
    }.bind(this));


  }

  MenuView.prototype = Object.create(View.prototype);
  MenuView.prototype.constructor = MenuView;

  MenuView.prototype.show = function() {
    this.transitioning = true;
    this.fader.show(undefined, function(){
      this.transitioning = false;
    }.bind(this));
  }
  module.exports = MenuView;
});
