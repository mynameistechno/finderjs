/**
 * util.js module.
 * @module util
 */
'use strict';

var document = require('global/document');
var isArray = require('x-is-array');

/**
 * createElement shortcut
 * @param  {string} tag
 * @return {element} element
 */
function el(tag) {
  return document.createElement(tag);
}

/**
 * Find first element that tests true, starting with the element itself
 * and traversing up through its ancestors
 * @param  {element} element
 * @param  {function} test fn - return true when element located
 * @return {element}
 */
function closest(element, test) {
  var el = element;

  while (el) {
    if (test(el)) {
      return el;
    }
    el = el.parentNode;
  }
}

/**
 * Add one or more classnames to an element
 * @param {element} element
 * @param {Array.<string>|string} array of classnames or string with
 * classnames separated by whitespace
 * @return {element}
 */
function addClass(element, className) {
  var classNames = className;

  function _addClass(el, cn) {
    if (!el.className) {
      el.className = cn;
    } else if (!hasClass(el, cn)) {
      el.className += ' ' + cn;
    }
  }

  if (!isArray(className)) {
    classNames = className.trim().split(/\s+/);
  }
  classNames.forEach(_addClass.bind(null, element));

  return element;
}

/**
 * Remove a class from an element
 * @param  {element} element
 * @param  {Array.<string>|string} array of classnames or string with
 * @return {element}
 */
function removeClass(element, className) {
  var classNames = className;

  function _removeClass(el, cn) {
    var classRegex = new RegExp('(?:^|\\s)' + cn + '(?!\\S)', 'g');
    el.className = el.className.replace(classRegex, '').trim();
  }

  if (!isArray(className)) {
    classNames = className.trim().split(/\s+/);
  }
  classNames.forEach(_removeClass.bind(null, element));

  return element;
}

/**
 * Check if element has a class
 * @param  {element}  element
 * @param  {string}  className
 * @return {boolean}
 */
function hasClass(element, className) {
  if (!element || !('className' in element)) {
    return false;
  }

  return element.className.split(' ').indexOf(className) !== -1;
}

module.exports = {
  el: el,
  closest: closest,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass
};
