'use strict';

var exampleStatic = require('./example-static');
var exampleStaticSelectPath = require('./example-static-select-path');
var exampleAsync = require('./example-async');

exampleStatic(document.getElementById('container1'));
exampleAsync(document.getElementById('container2'));
exampleStaticSelectPath(document.getElementById('container3'));
