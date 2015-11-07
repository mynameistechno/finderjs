'use strict';

var test = require('tape');
var document = require('global/document');

var _ = require('../util');


test('[util] hasClass', function test(t) {
  var el = document.createElement('div');
  el.className = 'bananaslug123 bananaslug456 bananaslug789';

  t.ok(_.hasClass(el, 'bananaslug123'), 'should find class');
  t.notOk(_.hasClass(el, 'bananaslug'), 'should not find class');

  t.doesNotThrow(
    _.hasClass.bind(null, {}, 'bananaslug'),
    'should not throw an exception when className falsey');

  t.doesNotThrow(
    _.hasClass.bind(null, null, 'bananaslug'),
    'should not throw an exception when null');

  t.end();
});

test('[util] addClass', function test(t) {
  var el = document.createElement('div');

  _.addClass(el, 'bananaslug123');
  t.equal(el.className, 'bananaslug123', 'should add the class');

  _.addClass(el, 'bananaslug123');
  t.equal(el.className, 'bananaslug123', 'should not add the class twice');

  _.addClass(el, 'bananaslug456');
  t.equal(
    el.className, 'bananaslug123 bananaslug456', 'should add second class');

  el.className = '';
  _.addClass(el, ['bananaslug456', 'bananaslug123']);
  t.equal(
    el.className, 'bananaslug456 bananaslug123', 'should add array of classes');

  el.className = 'derp';
  _.addClass(el, 'bananaslug456 bananaslug123');
  t.equal(
    el.className,
    'derp bananaslug456 bananaslug123',
    'should add all classes in string');

  t.end();
});

test('[util] removeClass', function test(t) {
  var el = document.createElement('div');

  el.className = '';
  _.removeClass(el, 'bananaslug123');
  t.equal(el.className, '', 'should not do anything');

  el.className = 'bananaslug123';
  _.removeClass(el, 'bananaslug123');
  t.equal(el.className, '', 'should remove the only class');

  el.className = 'bananaslug123 bananaslug456';
  _.removeClass(el, 'bananaslug123');
  t.equal(
    el.className, 'bananaslug456', 'should remove class at start');

  el.className = 'bananaslug123 bananaslug456';
  _.removeClass(el, 'bananaslug456');
  t.equal(
    el.className, 'bananaslug123', 'should remove class at end');

  el.className = 'bananaslug123 bananaslug456 bananaslug789';
  _.removeClass(el, 'bananaslug456');
  t.equal(
    el.className,
    'bananaslug123 bananaslug789',
    'should remove class in middle');

  el.className = 'bananaslug123 bananaslug123';
  _.removeClass(el, 'bananaslug123');
  t.equal(el.className, '', 'should remove all instances');

  el.className = 'bananaslug456 derp bananaslug123';
  _.removeClass(el, ['bananaslug456', 'bananaslug123']);
  t.equal(el.className, 'derp', 'should remove classes in array');

  el.className = 'bananaslug456 derp bananaslug123';
  _.removeClass(el, 'bananaslug456 bananaslug123');
  t.equal(el.className, 'derp', 'should remove all classes in string');

  t.end();
});

test('[util] closest', function test(t) {
  var parent = document.createElement('div');
  var child = document.createElement('div');
  var className = 'bananaslug';

  parent.className = className;
  parent.appendChild(child);

  t.ok(
    _.closest(child, function test(el) {
      return el.className === className;
    }), 'element should be found');

  t.notOk(
    _.closest(child, function test(el) {
      return el.className === className + '123';
    }), 'element should not be found');

  t.end();
});

test('[util] nextSiblings', function test(t) {
  var parent = document.createElement('div');
  var siblings;
  var i;
  var el;
  var prev;
  var first;

  // global/document doesn't appear to support .nextSibling
  first = prev = document.createElement('div');
  parent.appendChild(prev);
  for (i = 0; i < 9; i++) {
    el = document.createElement('div');
    prev.nextSibling = el;
    parent.appendChild(el);
    prev = el;
  }

  siblings = _.nextSiblings(first);
  t.equal(
    siblings.length, 9, 'number of siblings should equal one less than total');

  siblings = _.nextSiblings(prev);
  t.equal(siblings.length, 0, 'number of next siblings should be 0');

  t.end();
});

test('[util] previousSiblings', function test(t) {
  var parent = document.createElement('div');
  var siblings;
  var i;
  var el;
  var prev;
  var first;

  // global/document doesn't appear to support .previousSibling
  first = prev = document.createElement('div');
  parent.appendChild(prev);
  for (i = 0; i < 9; i++) {
    el = document.createElement('div');
    el.previousSibling = prev;
    parent.appendChild(el);
    prev = el;
  }

  siblings = _.previousSiblings(first);
  t.equal(siblings.length, 0, 'number of previous siblings should be 0');

  siblings = _.previousSiblings(prev);
  t.equal(siblings.length, 9, 'number of previous siblings should be 0');

  t.end();
});

test('[util] el', function test(t) {
  var element = document.createElement('div');

  t.equal(_.el('div').tagName, 'DIV', 'should return DIV element');
  t.equal(_.el(element), element, 'should return element');

  t.equal(_.el('div.foo').className, 'foo', 'should set classname');
  t.equal(_.el('div.foo.bar').className, 'foo bar', 'should set classnames');

  t.end();
});

test('[util] frag', function test(t) {
  var frag = _.frag();

  t.ok(frag.constructor.toString().match(/DocumentFragment/), 'returns a frag');

  t.end();
});

test('[util] test', function test(t) {
  var text = _.text();

  t.ok(text.constructor.toString().match(/text/i), 'returns a text node');

  t.end();
});

test('[util] remove', function test(t) {
  var parent = document.createElement('div');
  var element = document.createElement('div');
  parent.appendChild(element);

  t.plan(3);
  t.ok(parent.childNodes.length, 'should have children');
  _.remove(element);
  t.notOk(parent.childNodes.length, 'should not have children');

  // native Element.remove()
  element = {
    remove: t.ok.bind(null, true, 'native remove should have been called')
  };
  _.remove(element);

  t.end();
});

test('[util] stop', function test(t) {
  var event = {
    stopPropagation: t.ok.bind(null, true, 'stopPropagation should be called'),
    preventDefault: t.ok.bind(null, true, 'preventDefault should be called')
  };

  t.plan(2);
  _.stop(event);
  t.end();
});

test('[util] append', function test(t) {
  var parent = _.el('div');
  var div = _.el('div');
  var children = [
    _.el('div'),
    _.el('div'),
    _.el('div')
  ];

  // append array of items
  t.equal(_.append(parent, children), parent, 'return parent');
  t.equal(
    parent.childNodes[0].childNodes.length, 3, 'appended array of 3 els');

  parent = _.el('div');
  _.append(parent, div);
  t.equal(parent.childNodes[0].childNodes.length, 1, 'appended 1 element');

  t.end();
});
