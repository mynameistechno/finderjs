'use strict';

var test = require('tape');
var document = require('global/document');
var EventEmitter = require('events').EventEmitter;

var finder = require('../src/finder');


test('[finder] finder', function test(t) {
  var children = [{
    label: 'A: Choice 1',
    value: 'a-1'
  }, {
    label: 'B: Choice 1',
    value: 'b-1'
  }];
  var container = document.createElement('div');

  t.ok(finder(container, children), 'doesn\'t throw an exception');
  t.ok(container.childNodes.length, 'should have children');
  t.throws(
    finder.bind(null, container, []),
    'throws an exception - empty children array');
  t.throws(
    finder.bind(null, container, 123),
    'throws an exception - non-array children');

  t.end();
});

test('[finder] createColumn', function test(t) {
  var children = [{
    label: 'A: Choice 1',
    value: 'a-1'
  }, {
    label: 'B: Choice 1',
    value: 'b-1'
  }];
  var cfg = {
    className: {
      col: 'fjs-col',
      item: 'fjs-item',
      list: 'fjs-list'
    }
  };
  var col = finder.createColumn(children, cfg);

  t.equal(col.tagName, 'DIV', 'should return a div');
  t.ok(
    col.className.indexOf('fjs-col') !== -1, 'should have the right className');
  t.ok(col.childNodes.length, 'should have children');

  t.end();
});

test('[finder] createList', function test(t) {
  var children = [{
    label: 'A: Choice 1',
    value: 'a-1'
  }, {
    label: 'B: Choice 1',
    value: 'b-1'
  }];
  var cfg = {
    className: {
      list: 'fjs-list',
      item: 'fjs-item'
    }
  };
  var col = finder.createList(children, cfg);

  t.equal(col.tagName, 'UL', 'should return an unordered list');
  t.ok(
    col.className.indexOf('fjs-list') !== -1,
    'should have the right className');
  t.ok(col.childNodes.length, 'should have children');

  t.end();
});

test('[finder] createItem', function test(t) {
  var opts = {
    label: 'A: Choice 1',
    value: 'a-1'
  };
  var cfg = {
    className: {
      item: 'fjs-item',
      children: 'fjs-children'
    }
  };
  var item = finder.createItem(cfg, opts);

  t.equal(item.tagName, 'LI', 'should return a list item');
  t.ok(
    item.className.indexOf('fjs-item') !== -1,
    'should have the right className');
  t.ok(item.childNodes.length, 'should have children');

  opts.children = [{
    label: 'B',
    value: 'b'
  }];
  item = finder.createItem(cfg, opts);

  t.end();
});

test('[finder] itemSelected', function test(t) {
  var cfg = {
    className: {
      item: 'fjs-item',
      list: 'fjs-list',
      col: 'fjs-col'
    }
  };
  var emitter = new EventEmitter();
  var col = {
    nextSibling: {
      remove: function noop() {}
    }
  };
  var value = {
    item: {
      label: 'B: Choice 1',
      value: 'b-1',
      children: [{
        label: 'A: Choice 1',
        value: 'a-1'
      }, {
        label: 'B: Choice 1',
        value: 'b-1'
      }]
    },
    col: col
  };

  t.plan(1);
  emitter.on('columnCreated', t.ok.bind(null, true, 'Column is created'));
  finder.itemSelected(cfg, emitter, value);

  // item.children not provided
  delete value.item.children;
  finder.itemSelected(cfg, emitter, value);

  t.end();
});

test('[finder] clickEvent', function test(t) {
  var cfg = {
    className: {
      item: 'fjs-item',
      col: 'fjs-col',
      active: 'fjs-active'
    }
  };
  var emitter = new EventEmitter();
  var item = document.createElement('li');
  var col = document.createElement('div');
  var event;

  col.className = cfg.className.col;
  item.className = cfg.className.item;
  col.appendChild(item);
  event = {
    target: item
  };

  t.plan(2);
  finder.clickEvent(cfg, emitter, {target: col});

  emitter.on('itemClicked', t.ok.bind(null, true, 'item clicked'));
  finder.clickEvent(cfg, emitter, event);

  item.className = cfg.className.item + ' ' + cfg.className.active;
  finder.clickEvent(cfg, emitter, event);

  t.end();
});
