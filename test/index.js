'use strict';

var test = require('tape');
var document = require('global/document');
var EventEmitter = require('eventemitter3');

var finder = require('../index');


// for setting document.location.href
document.location = {};

test('[finder] finder', function test(t) {
  var children = [{
    label: 'A: Choice 1'
  }, {
    label: 'B: Choice 1'
  }];
  var container = document.createElement('div');

  function source(parent, config, callback) {
    callback([]);
  }

  t.ok(finder(container, children), 'doesn\'t throw an exception');
  t.ok(container.childNodes.length, 'should have children');
  t.throws(
    finder.bind(null, container, 123),
    'throws an exception - non-array children');

  t.ok(finder(container, children, {}), 'with options');

  t.ok(finder(container, source), 'with function as data source');

  t.end();
});

test('[finder] createColumn', function test(t) {
  var children = [{
    label: 'A: Choice 1'
  }, {
    label: 'B: Choice 1'
  }];
  var cfg = {
    className: {
      col: 'fjs-col',
      item: 'fjs-item',
      list: 'fjs-list'
    }
  };
  var emitter = new EventEmitter();

  emitter.on('create-column', function listener(col) {
    t.equal(col.tagName, 'DIV', 'should return a div');
    t.ok(
      col.className.indexOf('fjs-col') !== -1,
      'should have the right className');
    t.ok(col.childNodes.length, 'should have children');
  });
  finder.createColumn(children, cfg, emitter);

  t.plan(3);
  t.end();
});

test('[finder] createList', function test(t) {
  var children = [{
    label: 'A: Choice 1'
  }, {
    label: 'B: Choice 1'
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
    url: 'test.com',
    className: 'optional'
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
    label: 'B'
  }];
  item = finder.createItem(cfg, opts);

  t.end();
});

test('[finder] itemSelected', function test(t) {
  var cfg = {
    className: {
      item: 'fjs-item',
      list: 'fjs-list',
      col: 'fjs-col',
      active: 'fjs-active'
    }
  };
  var emitter = new EventEmitter();
  var col = document.createElement('div');
  var value = {
    item: {
      _item: {
        label: 'B: Choice 1',
        url: 'http://test.com',
        children: [{
          label: 'A: Choice 1',
        }, {
          label: 'B: Choice 1',
        }]
      }
    },
    col: col
  };

  // test plan is to verify the column-created event is emitted
  t.plan(3);
  emitter.on('create-column', t.ok.bind(null, true, 'Column is created'));
  finder.itemSelected(cfg, emitter, value);

  // item.children not provided, uses item.url
  delete value.item._item.children;
  finder.itemSelected(cfg, emitter, value);

  // no children or url, leaf-selected event emitted
  delete value.item._item.url;
  emitter.on('leaf-selected', t.ok.bind(null, true, 'leaf selected'));
  finder.itemSelected(cfg, emitter, value);

  // active elements are removed
  col.getElementsByClassName = function gebcn() {
    return [value.item];
  };
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
    target: item,
    preventDefault: function noop() {},
    stopPropagation: function noop() {}
  };

  t.plan(2);
  finder.clickEvent(cfg, emitter, event);

  emitter.on('item-selected', t.ok.bind(null, true, 'item clicked'));
  finder.clickEvent(cfg, emitter, event);

  item.className = cfg.className.item + ' ' + cfg.className.active;
  finder.clickEvent(cfg, emitter, event);

  // non-listitem clicked
  item.className = '';
  finder.clickEvent(cfg, emitter, event);

  t.end();
});

test('[finder] findLastActive', function test(t) {
  var cfg = {
    className: {
      item: 'fjs-item',
      list: 'fjs-list',
      col: 'fjs-col',
      active: 'fjs-active'
    }
  };
  var container = document.createElement('div');
  var col = document.createElement('div');
  var item = document.createElement('div');
  var active = finder.findLastActive(container, cfg);

  t.deepEqual(active, null, 'no active elements present');

  col.className = cfg.className.col;
  item.className = cfg.className.active;
  col.appendChild(item);
  container.appendChild(col);
  active = finder.findLastActive(container, cfg);

  t.deepEqual(active, {col: col, item: item}, 'active item and col located');

  t.end();
});

test('[finder] navigate', function test(t) {
  var cfg = {
    className: {
      item: 'fjs-item',
      list: 'fjs-list',
      col: 'fjs-col',
      active: 'fjs-active'
    }
  };
  var emitter = new EventEmitter();
  var col = document.createElement('div');
  var container = document.createElement('div');
  var item = document.createElement('div');
  var sibling = document.createElement('div');
  var value;

  col.className = cfg.className.col;
  item.className = cfg.className.active;
  col.appendChild(item);
  container.appendChild(col);

  value = {
    item: {
      _item: {}
    },
    col: col,
    container: container
  };

  // test plan is to verify an item is selected for each case
  t.plan(6);
  emitter.on('item-selected', t.ok.bind(null, true, 'item selected'));

  // there is an active item but no siblings, so no target is selected
  finder.navigate(cfg, emitter, value);

  // up arrow
  value.direction = 'up';
  item.previousSibling = sibling;
  finder.navigate(cfg, emitter, value);

  // down arrow
  value.direction = 'down';
  item.nextSibling = sibling;
  finder.navigate(cfg, emitter, value);

  // right arrow
  value.direction = 'right';
  col.nextSibling = sibling;
  sibling.querySelector = function qs() {
    return item;
  };
  finder.navigate(cfg, emitter, value);

  // left arrow - select active
  value.direction = 'left';
  col.previousSibling = sibling;
  sibling.querySelector = function qs() {
    return item;
  };
  finder.navigate(cfg, emitter, value);

  // left arrow - select first
  value.direction = 'left';
  sibling.querySelector = function qs(sel) {
    if (sel === '.' + cfg.className.active) {
      return false;
    }
    return item;
  };
  finder.navigate(cfg, emitter, value);

  // no active items
  container.querySelector = function qs() {
    return col;
  };
  col.querySelector = function qs() {
    return item;
  };
  item.className = cfg.className.item;
  finder.navigate(cfg, emitter, value);

  t.end();
});

test('[finder] keydownEvent', function test(t) {
  var emitter = new EventEmitter();
  var event = {
    preventDefault: function noop() {},
    stopPropagation: function noop() {}
  };

  t.plan(1);
  emitter.on(
    'navigate', t.ok.bind(null, true, 'keyboard arrow pressed'));
  finder.keydownEvent(null, null, emitter, event);

  event.keyCode = 38;
  finder.keydownEvent(null, null, emitter, event);

  t.end();
});
