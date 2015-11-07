'use strict';

var exampleStatic = require('./example-static');
var exampleAsync = require('./example-async');


exampleStatic(document.getElementById('container1'));
exampleAsync(document.getElementById('container2'));
