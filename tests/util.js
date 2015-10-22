'use strict';

var test = require('tape');
var document = require('global/document');

var util = require('../src/util');


test('[util] hasClass', function test(t) {
  var el = document.createElement('div');
  el.className = 'bananaslug123 bananaslug456 bananaslug789';

  t.ok(util.hasClass(el, 'bananaslug123'), 'should find class');
  t.notOk(util.hasClass(el, 'bananaslug'), 'should not find class');

  t.doesNotThrow(
    util.hasClass.bind(null, {}, 'bananaslug'),
    'should not throw an exception when className falsey');

  t.doesNotThrow(
    util.hasClass.bind(null, null, 'bananaslug'),
    'should not throw an exception when null');

  t.end();
});

test('[util] addClass', function test(t) {
  var el = document.createElement('div');

  util.addClass(el, 'bananaslug123');
  t.equal(el.className, 'bananaslug123', 'should add the class');

  util.addClass(el, 'bananaslug123');
  t.equal(el.className, 'bananaslug123', 'should not add the class twice');

  util.addClass(el, 'bananaslug456');
  t.equal(
    el.className, 'bananaslug123 bananaslug456', 'should add second class');

  el.className = '';
  util.addClass(el, ['bananaslug456', 'bananaslug123']);
  t.equal(
    el.className, 'bananaslug456 bananaslug123', 'should add array of classes');

  el.className = 'derp';
  util.addClass(el, 'bananaslug456 bananaslug123');
  t.equal(
    el.className,
    'derp bananaslug456 bananaslug123',
    'should add all classes in string');

  t.end();
});

test('[util] removeClass', function test(t) {
  var el = document.createElement('div');

  el.className = '';
  util.removeClass(el, 'bananaslug123');
  t.equal(el.className, '', 'should not do anything');

  el.className = 'bananaslug123';
  util.removeClass(el, 'bananaslug123');
  t.equal(el.className, '', 'should remove the only class');

  el.className = 'bananaslug123 bananaslug456';
  util.removeClass(el, 'bananaslug123');
  t.equal(
    el.className, 'bananaslug456', 'should remove class at start');

  el.className = 'bananaslug123 bananaslug456';
  util.removeClass(el, 'bananaslug456');
  t.equal(
    el.className, 'bananaslug123', 'should remove class at end');

  el.className = 'bananaslug123 bananaslug456 bananaslug789';
  util.removeClass(el, 'bananaslug456');
  t.equal(
    el.className,
    'bananaslug123 bananaslug789',
    'should remove class in middle');

  el.className = 'bananaslug123 bananaslug123';
  util.removeClass(el, 'bananaslug123');
  t.equal(el.className, '', 'should remove all instances');

  el.className = 'bananaslug456 derp bananaslug123';
  util.removeClass(el, ['bananaslug456', 'bananaslug123']);
  t.equal(el.className, 'derp', 'should remove classes in array');

  el.className = 'bananaslug456 derp bananaslug123';
  util.removeClass(el, 'bananaslug456 bananaslug123');
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
    util.closest(child, function test(el) {
      return el.className === className;
    }), 'element should be found');

  t.notOk(
    util.closest(child, function test(el) {
      return el.className === className + '123';
    }), 'element should not be found');

  t.end();
});
