/*
 * Discover and load the tests
 * Used by istanbul
 */

'use strict';

// setup jsdom
var jsdom = require('jsdom');
var JSDOM = jsdom.JSDOM;
var window = new JSDOM('<!doctype html><html><body></body></html>').window;

// extend jsdom
window.requestAnimationFrame = function(fn) {
  return setTimeout(fn, 0);
};
window.pageXOffset = 0;
window.pageYOffset = 0;
window.scrollTo = function() {};

// beforeeach, afterEach
function beforeEach(test, handler) {
  return function tapish(name, listener) {
    test(name, function(assert) {
      var _end = assert.end;
      assert.end = function() {
        assert.end = _end;
        listener(assert);
      };

      handler(assert);
    });
  };
}
function afterEach(test, handler) {
  return function tapish(name, listener) {
    test(name, function(assert) {
      var _end = assert.end;
      assert.end = function() {
        assert.end = _end;
        handler(assert);
      };

      listener(assert);
    });
  };
}

// globals
global.window = window;
global.document = window.document;

// kick off tests
var glob = require('glob');
var paths = glob.sync('./**/*.js', {cwd: __dirname});
paths.forEach(require);

module.exports = {beforeEach: beforeEach, afterEach: afterEach};
