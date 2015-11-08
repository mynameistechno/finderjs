'use strict';

/**
 * jQuery wrapper for finderjs
 * @author Mark Matyas
 */

;(function jQuery($) {
  var name = 'finderjs';

  $.fn[name] = function _finderjs(data, options) {
    return this.each(function each() {
      if (!$.data(this, '_' + name)) {
        $.data(this, '_' + name, finder(this, data, options));
      }
    });
  };
})(jQuery);
