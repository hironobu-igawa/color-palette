var ColorPalette;
(function (module) {
  'use strict';

  Object.defineProperty(module, 'colors', {
    get: function () {
      return module.settings.colors;
    }
  });
})(ColorPalette || (ColorPalette = {}));
