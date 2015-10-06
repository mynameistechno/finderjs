(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var finder = require('../../src/finder');

var data = [{
  label: 'A: Choice 1',
  value: 'a-1',
  data: [{
    label: 'AA: Choice 1',
    value: 'aa-1',
    url: 'http://www.qualcomm.com'
  }, {
    label: 'AA: Choice 2',
    value: 'aa-2',
    url: 'https://www.codeaurora.org/'
  }]
}, {
  label: 'B: Choice 1',
  value: 'b-1',
  data: [{
    label: 'BA: Choice 1',
    value: 'ba-1',
    url: 'http://www.qualcomm.com'
  }, {
    label: 'BA: Choice 2',
    value: 'ba-2',
    success: function success() {
      console.log('CLICK: ' + this.value);
    }
  }]
}];

var container = document.getElementById('container');


var options = {};

finder(container, data, options);

},{"../../src/finder":4}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"min-document":2}],4:[function(require,module,exports){
'use strict';

var document = require('global/document');

module.exports = finder;


/**
 * @param  {element} container
 * @param  {object} data
 * @param  {object} options
 * @return {element} container
 */
function finder(container, data, options) {
  var opts = options || {};
  var col = finder.createColumn(data);

  container.appendChild(col);
  return container;
}

/**
 * @return {element} column
 */
finder.createColumn = function createColumn(data) {
  var div = document.createElement('div');
  var list = finder.createList(data);

  div.className = 'fjs-col';
  div.appendChild(list);

  return div;
};

/**
 * @param  {object} data
 * @return {element} list
 */
finder.createList = function createList(data) {
  var ul = document.createElement('ul');
  var docFrag;
  var items;

  ul.className = 'fjs-list';
  items = data.map(finder.createItem);

  docFrag = items.reduce(function each(docFrag, curr) {
    docFrag.appendChild(curr);
    return docFrag;
  }, document.createDocumentFragment());

  ul.appendChild(docFrag);

  return ul;
};

/**
 * @param  {object} data
 * @return {element} list item
 */
finder.createItem = function createItem(data) {
  var li = document.createElement('li');
  var text = document.createTextNode(data.label);

  li.className = 'fjs-item';
  li.appendChild(text);

  return li;
};

},{"global/document":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9iYXNpYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXJlc29sdmUvZW1wdHkuanMiLCJub2RlX21vZHVsZXMvZ2xvYmFsL2RvY3VtZW50LmpzIiwic3JjL2ZpbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZmluZGVyID0gcmVxdWlyZSgnLi4vLi4vc3JjL2ZpbmRlcicpO1xuXG52YXIgZGF0YSA9IFt7XG4gIGxhYmVsOiAnQTogQ2hvaWNlIDEnLFxuICB2YWx1ZTogJ2EtMScsXG4gIGRhdGE6IFt7XG4gICAgbGFiZWw6ICdBQTogQ2hvaWNlIDEnLFxuICAgIHZhbHVlOiAnYWEtMScsXG4gICAgdXJsOiAnaHR0cDovL3d3dy5xdWFsY29tbS5jb20nXG4gIH0sIHtcbiAgICBsYWJlbDogJ0FBOiBDaG9pY2UgMicsXG4gICAgdmFsdWU6ICdhYS0yJyxcbiAgICB1cmw6ICdodHRwczovL3d3dy5jb2RlYXVyb3JhLm9yZy8nXG4gIH1dXG59LCB7XG4gIGxhYmVsOiAnQjogQ2hvaWNlIDEnLFxuICB2YWx1ZTogJ2ItMScsXG4gIGRhdGE6IFt7XG4gICAgbGFiZWw6ICdCQTogQ2hvaWNlIDEnLFxuICAgIHZhbHVlOiAnYmEtMScsXG4gICAgdXJsOiAnaHR0cDovL3d3dy5xdWFsY29tbS5jb20nXG4gIH0sIHtcbiAgICBsYWJlbDogJ0JBOiBDaG9pY2UgMicsXG4gICAgdmFsdWU6ICdiYS0yJyxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKCkge1xuICAgICAgY29uc29sZS5sb2coJ0NMSUNLOiAnICsgdGhpcy52YWx1ZSk7XG4gICAgfVxuICB9XVxufV07XG5cbnZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG5cblxudmFyIG9wdGlvbnMgPSB7fTtcblxuZmluZGVyKGNvbnRhaW5lciwgZGF0YSwgb3B0aW9ucyk7XG4iLG51bGwsInZhciB0b3BMZXZlbCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDpcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHt9XG52YXIgbWluRG9jID0gcmVxdWlyZSgnbWluLWRvY3VtZW50Jyk7XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudDtcbn0gZWxzZSB7XG4gICAgdmFyIGRvY2N5ID0gdG9wTGV2ZWxbJ19fR0xPQkFMX0RPQ1VNRU5UX0NBQ0hFQDQnXTtcblxuICAgIGlmICghZG9jY3kpIHtcbiAgICAgICAgZG9jY3kgPSB0b3BMZXZlbFsnX19HTE9CQUxfRE9DVU1FTlRfQ0FDSEVANCddID0gbWluRG9jO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZG9jY3k7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJ2dsb2JhbC9kb2N1bWVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRlcjtcblxuXG4vKipcbiAqIEBwYXJhbSAge2VsZW1lbnR9IGNvbnRhaW5lclxuICogQHBhcmFtICB7b2JqZWN0fSBkYXRhXG4gKiBAcGFyYW0gIHtvYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge2VsZW1lbnR9IGNvbnRhaW5lclxuICovXG5mdW5jdGlvbiBmaW5kZXIoY29udGFpbmVyLCBkYXRhLCBvcHRpb25zKSB7XG4gIHZhciBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIGNvbCA9IGZpbmRlci5jcmVhdGVDb2x1bW4oZGF0YSk7XG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbCk7XG4gIHJldHVybiBjb250YWluZXI7XG59XG5cbi8qKlxuICogQHJldHVybiB7ZWxlbWVudH0gY29sdW1uXG4gKi9cbmZpbmRlci5jcmVhdGVDb2x1bW4gPSBmdW5jdGlvbiBjcmVhdGVDb2x1bW4oZGF0YSkge1xuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHZhciBsaXN0ID0gZmluZGVyLmNyZWF0ZUxpc3QoZGF0YSk7XG5cbiAgZGl2LmNsYXNzTmFtZSA9ICdmanMtY29sJztcbiAgZGl2LmFwcGVuZENoaWxkKGxpc3QpO1xuXG4gIHJldHVybiBkaXY7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge29iamVjdH0gZGF0YVxuICogQHJldHVybiB7ZWxlbWVudH0gbGlzdFxuICovXG5maW5kZXIuY3JlYXRlTGlzdCA9IGZ1bmN0aW9uIGNyZWF0ZUxpc3QoZGF0YSkge1xuICB2YXIgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICB2YXIgZG9jRnJhZztcbiAgdmFyIGl0ZW1zO1xuXG4gIHVsLmNsYXNzTmFtZSA9ICdmanMtbGlzdCc7XG4gIGl0ZW1zID0gZGF0YS5tYXAoZmluZGVyLmNyZWF0ZUl0ZW0pO1xuXG4gIGRvY0ZyYWcgPSBpdGVtcy5yZWR1Y2UoZnVuY3Rpb24gZWFjaChkb2NGcmFnLCBjdXJyKSB7XG4gICAgZG9jRnJhZy5hcHBlbmRDaGlsZChjdXJyKTtcbiAgICByZXR1cm4gZG9jRnJhZztcbiAgfSwgZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpKTtcblxuICB1bC5hcHBlbmRDaGlsZChkb2NGcmFnKTtcblxuICByZXR1cm4gdWw7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge29iamVjdH0gZGF0YVxuICogQHJldHVybiB7ZWxlbWVudH0gbGlzdCBpdGVtXG4gKi9cbmZpbmRlci5jcmVhdGVJdGVtID0gZnVuY3Rpb24gY3JlYXRlSXRlbShkYXRhKSB7XG4gIHZhciBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gIHZhciB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YS5sYWJlbCk7XG5cbiAgbGkuY2xhc3NOYW1lID0gJ2Zqcy1pdGVtJztcbiAgbGkuYXBwZW5kQ2hpbGQodGV4dCk7XG5cbiAgcmV0dXJuIGxpO1xufTtcbiJdfQ==
