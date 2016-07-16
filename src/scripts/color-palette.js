var ColorPalette;
(function (module) {
  'use strict';

  module.ColorPalette = (function () {
    function ColorPalette(content) {
      var _this = this;
      this.$target = $(content);

      this.$target.on('change', function() {
        if (!module.backgroundChangeFlag) return;
        _this.$target
          .css('background-color', _this.color)
          .css('color', _this.isBright() ? '#000000' : '#FFFFFF');
      });
      this.closeListeners = [];
    }

    ColorPalette.prototype.open = function () {
      var _this = this;
      setTimeout(function() {
        if (_this.isOpen()) return;
        _this.initPaletteElement();
      }, 20);
    };

    ColorPalette.prototype.close = function () {
      var _this = this;
      setTimeout(function() {
        if (!_this.isOpen()) return;
        _this.destroyPaletteElement();
      }, 20);
    };

    ColorPalette.prototype.select = function (color) {
      this.$target.val(color);
      this.$target.change();
    };

    ColorPalette.prototype.selectOtherColor = function () {
      var _this = this;
      module.OtherColor.select(function (color) {
        if (!module.RGB.isValid(color)) return;
        _this.select(color);
      });
      _this.close();
    };

    ColorPalette.prototype.initPaletteElement = function () {
      var _this = this;
      var $balloon = null;
      var $standardColors = null;

      var initBalloon = function() {
        $balloon = $('<div>')
          .addClass('color-palette-balloon')
          .css('left', _this.xOffset + 'px')
          .css('top', _this.yOffset + 'px');
        _this.$target.after($balloon);

        var close1 = function(e) {
          for (var t = e.srcElement; t != null; t = t.parentElement)
            if (t === $balloon.get(0) || t === _this.$target.get(0)) return;
          _this.close();
        };
        $(document).on('click', close1);

        var close2 = function() {
          _this.close();
        };
        $(document).on('scroll', close2);

        _this.closeListeners.push(function() {
          $(document).off('click', close1);
          $(document).off('scroll', close2);
        });
      };

      var initStandardColors = function() {
        if (module.OtherColor.isActive()) {
          $('<span>' + module.messages.standardColor + '</span>')
            .addClass('color-palette-standard-colors-title')
            .appendTo($balloon);
        }

        $standardColors = $('<ul>')
          .addClass('color-palette-standard-colors-table')
          .appendTo($balloon);
        module.colors.forEach(function (colors) {
          var $row = $('<ul>')
            .addClass('color-palette-standard-colors-row')
            .appendTo($('<li>').appendTo($standardColors));

          colors.forEach(function (color) {
            $('<li>')
              .css('background-color', color)
              .data('color', color)
              .on('click', _this.select.bind(_this, color))
              .appendTo($row);
          });
        });
      };

      var initOtherColors = function() {
        if (!module.OtherColor.isActive()) return;

        $('<span>' + module.messages.history + '</span>')
          .addClass('color-palette-history-title')
          .appendTo($balloon);

        var $history = $('<ul>')
          .addClass('color-palette-history')
          .css('width', $standardColors.get(0).offsetWidth + 'px')
          .appendTo($balloon);
        module.OtherColor.query().forEach(function (color) {
          $('<li>')
            .css('background-color', color)
            .data('color', color)
            .on('click', _this.select.bind(_this, color))
            .appendTo($history);
        });

        $('<button type="button">' + module.messages.selectOtherColor + '</button>')
          .addClass('color-palette-history-select-other-color')
          .on('click', _this.selectOtherColor.bind(_this))
          .appendTo($balloon);
      };

      initBalloon();
      initStandardColors();
      initOtherColors();

      this.$palette = $balloon;
    };

    ColorPalette.prototype.destroyPaletteElement = function () {
      this.$palette.remove();
      this.$palette = null;
      this.closeListeners.forEach(function(listener) {listener()});
      this.closeListeners = [];
    };

    ColorPalette.prototype.isOpen = function () {
      return !!this.$palette;
    };

    ColorPalette.prototype.isBright = function() {
      var red = parseInt(this.color.substr(1, 2), 16);
      var green = parseInt(this.color.substr(3, 2), 16);
      var blue = parseInt(this.color.substr(5, 2), 16);
      var max = Math.max(red, green, blue);
      var min = Math.min(red, green, blue);
      var saturation = ((max - min) / max) * 100;
      var value = (max / 255) * 100;
      return value - saturation >= 50;
    };

    Object.defineProperty(ColorPalette.prototype, 'color', {
      get: function() {
        var value = this.$target.val();
        return module.RGB.isValid(value) ? value : '#FFFFFF';
      }
    });

    Object.defineProperty(ColorPalette.prototype, 'xOffset', {
      get: function() {
        var target = this.$target.get(0);
        if (target == null) return 0;
        var rect = target.getBoundingClientRect();
        return rect.left + window.pageXOffset;
      }
    });

    Object.defineProperty(ColorPalette.prototype, 'yOffset', {
      get: function() {
        var target = this.$target.get(0);
        if (target == null) return 0;
        var rect = target.getBoundingClientRect();
        return rect.top + window.pageYOffset + Number(target.offsetHeight) + 1;
      }
    });

    return ColorPalette;
  }());

  var $ = module.Element;
})(ColorPalette || (ColorPalette = {}));
