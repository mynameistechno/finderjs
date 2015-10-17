/**
 * util.js module.
 * @module util
 */

'use strict';


function closest(element, test) {
  var el = element;

  while (el) {
    if (test(el)) {
      return el;
    }
    el = el.parentNode;
  }
}

function addClass(element, className) {
  if (!element.className) {
    element.className = className;
  } else if (!hasClass(element, className)) {
    element.className += ' ' + className;
  }

  return element;
}

function removeClass(element, className) {
  var classRegex = new RegExp('(?:^|\\s)' + className + '(?!\\S)', 'g');
  element.className = element.className.replace(classRegex, '');

  return element;
}

function hasClass(element, className) {
  return element.className.split(' ').indexOf(className) !== -1;
}

module.exports = {
  closest: closest,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass
};
