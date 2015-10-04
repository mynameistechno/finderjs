'use strict';

var test = require('tape');
var m = require('../src/index');


test('[index] hello', function test(t) {
  t.equal(m(), 'world', 'should return hello world');

  t.end();
});
