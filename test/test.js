/*
 * Discover and load the tests
 * Used by istanbul
 */

'use strict';

var glob = require('glob');
var paths = glob.sync('./**/*.js', {cwd: __dirname});

paths.forEach(require);
