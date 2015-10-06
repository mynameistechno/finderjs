'use strict';

var test = require('tape');
var document = require('global/document');

var finder = require('../src/finder');


test('[finder] finder', function test(t) {
  var data = [{
    label: 'A: Choice 1',
    value: 'a-1'
  }, {
    label: 'B: Choice 1',
    value: 'b-1'
  }];
  var container = document.createElement('div');

  t.ok(finder(container, data), 'doesn\'t throw an exception');
  t.ok(container.childNodes.length, 'should have children');

  t.end();
});

test('[finder] createColumn', function test(t) {
  var data = [{
    label: 'A: Choice 1',
    value: 'a-1'
  }, {
    label: 'B: Choice 1',
    value: 'b-1'
  }];
  var col = finder.createColumn(data);

  t.equal(col.tagName, 'DIV', 'should return a div');
  t.equal(col.className, 'fjs-col', 'should have the right className');
  t.ok(col.childNodes.length, 'should have children');

  t.end();
});

test('[finder] createList', function test(t) {
  var data = [{
    label: 'A: Choice 1',
    value: 'a-1'
  }, {
    label: 'B: Choice 1',
    value: 'b-1'
  }];
  var col = finder.createList(data);

  t.equal(col.tagName, 'UL', 'should return an unordered list');
  t.equal(col.className, 'fjs-list', 'should have the right className');
  t.ok(col.childNodes.length, 'should have children');

  t.end();
});

test('[finder] createItem', function test(t) {
  var item = {
    label: 'A: Choice 1',
    value: 'a-1'
  };
  var item = finder.createItem(item);

  t.equal(item.tagName, 'LI', 'should return a list item');
  t.equal(item.className, 'fjs-item', 'should have the right className');
  t.ok(item.childNodes.length, 'should have children');

  t.end();
});
