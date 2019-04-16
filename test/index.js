'use strict';

var tape = require('tape');
var EventEmitter = require('eventemitter3');
var finder = require('../index');
var beforeEach = require('./test').beforeEach;

var test = beforeEach(tape, function before(assert) {
  // called before each thing
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }

  // when done call
  assert.end();
});

test('[finder] finder', function test(t) {
  var children = [
    {
      label: 'A: Choice 1'
    },
    {
      label: 'B: Choice 1'
    }
  ];
  var container = document.createElement('div');

  function source(parent, config, callback) {
    callback([]);
  }

  t.ok(finder(container, children), "doesn't throw an exception");
  t.ok(container.childNodes.length, 'should have children');
  t.throws(
    finder.bind(null, container, 123),
    'throws an exception - non-array children'
  );

  t.ok(finder(container, children, {}), 'with options');

  t.ok(finder(container, source), 'with function as data source');

  t.ok(finder(container, children, {defaultPath: []}), 'with default path');

  t.end();
});

test('[finder] createColumn', function test(t) {
  var children = [
    {
      label: 'A: Choice 1'
    },
    {
      label: 'B: Choice 1'
    }
  ];
  var emitter = new EventEmitter();
  var cfg = {
    className: {
      col: 'fjs-col',
      item: 'fjs-item',
      list: 'fjs-list'
    },
    emitter: emitter
  };

  emitter.on('create-column', function listener(col) {
    t.equal(col.tagName, 'DIV', 'should return a div');
    t.ok(
      col.className.indexOf('fjs-col') !== -1,
      'should have the right className'
    );
    t.ok(col.childNodes.length, 'should have children');
  });
  finder.createColumn(children, cfg);

  t.plan(3);
  t.end();
});

test('[finder] createList', function test(t) {
  var children = [
    {
      label: 'A: Choice 1'
    },
    {
      label: 'B: Choice 1'
    }
  ];
  var emitter = new EventEmitter();
  var cfg = {
    className: {
      list: 'fjs-list',
      item: 'fjs-item'
    },
    emitter: emitter
  };
  var col = finder.createList(children, cfg);

  t.equal(col.tagName, 'UL', 'should return an unordered list');
  t.ok(
    col.className.indexOf('fjs-list') !== -1,
    'should have the right className'
  );
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
    'should have the right className'
  );
  t.ok(item.childNodes.length, 'should have children');

  opts.children = [
    {
      label: 'B'
    }
  ];
  item = finder.createItem(cfg, opts);

  cfg.childKey = 'foo';
  cfg.className = {
    foo: 'bar'
  };
  opts.foo = 'bar';
  item = finder.createItem(cfg, opts);
  t.ok(item.className.indexOf('bar') !== -1);

  t.end();
});

test('[finder] itemSelected', function test(t) {
  var emitter = new EventEmitter();
  var col = document.createElement('div');
  var container = document.createElement('div');
  var cfg = {
    childKey: 'children',
    labelKey: 'label',
    className: {
      item: 'fjs-item',
      list: 'fjs-list',
      col: 'fjs-col',
      active: 'fjs-active'
    },
    container: container,
    emitter: emitter
  };
  var value = {
    item: {
      _item: {
        label: 'B: Choice 1',
        url: 'http://test.com',
        children: [
          {
            label: 'A: Choice 1'
          },
          {
            label: 'B: Choice 1'
          }
        ]
      }
    },
    col: col,
    container: container
  };

  // test plan is to verify the correct events are emitted
  t.plan(4);
  emitter.on('create-column', t.ok.bind(null, true, 'column is created'));
  emitter.on('interior-selected', t.ok.bind(null, true, 'interior selected'));
  finder.itemSelected(cfg, value);

  // item.children not provided, uses item.url
  delete value.item._item.children;
  finder.itemSelected(cfg, value);

  // no children or url, leaf-selected event emitted
  delete value.item._item.url;
  emitter.on('leaf-selected', t.ok.bind(null, true, 'leaf selected'));
  finder.itemSelected(cfg, value);

  // active elements are removed
  col.getElementsByClassName = function gebcn() {
    return [value.item];
  };
  finder.itemSelected(cfg, value);

  t.end();
});

test('[finder] clickEvent', function test(t) {
  var emitter = new EventEmitter();
  var item = document.createElement('li');
  var col = document.createElement('div');
  var container = document.createElement('div');
  var cfg = {
    className: {
      item: 'fjs-item',
      col: 'fjs-col',
      active: 'fjs-active'
    },
    container: container,
    emitter: emitter
  };
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
  finder.clickEvent(cfg, event);

  emitter.on('item-selected', t.ok.bind(null, true, 'item clicked'));
  finder.clickEvent(cfg, event);

  item.className = cfg.className.item + ' ' + cfg.className.active;
  finder.clickEvent(cfg, event);

  // non-listitem clicked
  item.className = '';
  finder.clickEvent(cfg, event);

  t.end();
});

test('[finder] findLastActive', function test(t) {
  var container = document.createElement('div');
  var cfg = {
    className: {
      item: 'fjs-item',
      list: 'fjs-list',
      col: 'fjs-col',
      active: 'fjs-active'
    },
    container: container
  };
  var col = document.createElement('div');
  var item = document.createElement('div');
  var active = finder.findLastActive(cfg);

  t.deepEqual(active, null, 'no active elements present');

  col.className = cfg.className.col;
  item.className = cfg.className.active;
  col.appendChild(item);
  container.appendChild(col);
  active = finder.findLastActive(cfg);

  t.deepEqual(active, {col: col, item: item}, 'active item and col located');

  t.end();
});

test('[finder] navigate', function test(t) {
  var data = [
    {
      label: 'a',
      children: [
        {
          label: 'b1',
          children: [
            {
              label: 'c2'
            }
          ]
        },
        {
          label: 'b2'
        }
      ]
    }
  ];
  var container = document.createElement('div');
  document.body.appendChild(container);
  finder(container, data);

  // down
  var downEvent = new window.KeyboardEvent('keydown', {
    keyCode: 40,
    bubbles: true
  });
  container.dispatchEvent(downEvent);
  t.equal(document.querySelector('.fjs-active').textContent, 'a');

  // right
  var rightEvent = new window.KeyboardEvent('keydown', {
    keyCode: 39,
    bubbles: true
  });
  container.dispatchEvent(rightEvent);
  var actives = document.querySelectorAll('.fjs-active');
  t.equal(actives[1].textContent, 'b1');

  // down
  container.dispatchEvent(downEvent);
  actives = document.querySelectorAll('.fjs-active');
  t.equal(actives[1].textContent, 'b2');

  // up
  var upEvent = new window.KeyboardEvent('keydown', {
    keyCode: 38,
    bubbles: true
  });
  container.dispatchEvent(upEvent);
  actives = document.querySelectorAll('.fjs-active');
  t.equal(actives[1].textContent, 'b1');

  // left
  var leftEvent = new window.KeyboardEvent('keydown', {
    keyCode: 37,
    bubbles: true
  });
  container.dispatchEvent(leftEvent);
  t.equal(document.querySelector('.fjs-active').textContent, 'a');

  t.end();
});

test('[finder] keydownEvent', function test(t) {
  var emitter = new EventEmitter();
  var event = {
    preventDefault: function noop() {},
    stopPropagation: function noop() {}
  };
  var container = document.createElement('div');
  var config = {
    container: container,
    emitter: emitter
  };

  t.plan(1);
  emitter.on('navigate', t.ok.bind(null, true, 'keyboard arrow pressed'));
  finder.keydownEvent(config, event);

  event.keyCode = 38;
  finder.keydownEvent(config, event);

  t.end();
});

test('[finder] goTo - defaultPath - empty', function test(t) {
  var data = [
    {
      label: 'a'
    },
    {
      label: 'b'
    }
  ];
  var container = document.createElement('div');
  document.body.appendChild(container);
  finder(container, data, {defaultPath: []});
  t.notOk(document.querySelector('.fjs-active'));
  t.end();
});

test('[finder] goTo - defaultPath', function test(t) {
  var data = [
    {
      label: 'a'
    },
    {
      label: 'b',
      children: [{label: 'c'}]
    }
  ];
  var container = document.createElement('div');
  document.body.appendChild(container);
  finder(container, data, {defaultPath: 'b/c'});

  setTimeout(function() {
    var actives = document.querySelectorAll('.fjs-active');
    t.equal(actives[1].textContent, 'c');
    t.end();
  }, 0);
});

test('[finder] goTo - emit event', function test(t) {
  var data = [
    {
      label: 'a'
    },
    {
      label: 'b'
    }
  ];
  var container = document.createElement('div');
  document.body.appendChild(container);
  var emitter = finder(container, data);
  emitter.emit('go-to', 'b');
  var active = document.querySelector('.fjs-active');
  t.equal(active.textContent, 'b');

  t.end();
});
