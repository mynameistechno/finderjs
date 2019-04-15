/*
 * Discover and load the tests
 * Used by istanbul
 */

'use strict';

var glob = require('glob');
var paths = glob.sync('./**/*.js', {cwd: __dirname});
var window = require('global/window');
window.requestAnimationFrame = function(fn) {
  setTimeout(fn, 0);
};

paths.forEach(require);
