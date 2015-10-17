/**
 * finder.js module.
 * @module finderjs
 */

'use strict';

var extend = require('xtend');
var document = require('global/document');
var Delegator = require('dom-delegator');
var EventEmitter = require('events').EventEmitter;
var closest = require('./util').closest;
var addClass = require('./util').addClass;
var removeClass = require('./util').removeClass;
var hasClass = require('./util').hasClass;

module.exports = finder;


/**
 * @param  {element} container
 * @param  {object} data
 * @param  {object} options
 * @return {element} container
 */
function finder(container, data, options) {
  var cfg = extend({
    className: {
      container: 'fjs-container',
      col: 'fjs-col',
      list: 'fjs-list',
      item: 'fjs-item',
      active: 'fjs-active'
    }
  }, options);
  var delegator = Delegator();
  var emitter = new EventEmitter();
  var col = finder.createColumn(data, cfg);

  if (!Array.isArray(data) || !data.length) {
    throw new Error('No data provided');
  }

  delegator.addEventListener(
    container, 'click', finder.clickEvent.bind(null, cfg, emitter));
  emitter.on(
    'itemClicked', finder.itemSelected.bind(null, cfg, emitter));
  emitter.on('columnCreated', finder.addColumn.bind(null, container));

  container.className += ' ' + cfg.className.container;
  emitter.emit('columnCreated', col);
  return container;
}

/**
 * @param {element} container
 * @param {element} column to append to container
 */
finder.addColumn = function addColumn(container, column) {
  container.appendChild(column);
};

/**
 * @param  {object} data
 * @param  {object} config
 * @param  {object} event emitter
 * @param  {object} event value
 */
finder.itemSelected = function itemSelected(cfg, emitter, value) {
  var item = value.item;
  var currCol = value.col;
  var col;
  var curr;
  var next;

  if (item.data) {
    curr = currCol.nextSibling;
    while (curr) {
      next = curr.nextSibling;
      curr.remove();
      curr = next;
    }
    col = finder.createColumn(item.data, cfg);
    emitter.emit('columnCreated', col);
  }
};

/**
 * @param  {object} config
 * @param  {object} event emitter
 * @param  {object} event
 */
finder.clickEvent = function clickEvent(cfg, emitter, event) {
  var el = event.target;
  var activeEls;
  var col;

  if (hasClass(el, cfg.className.item)) {
    col = closest(el, function test(el) {
      return hasClass(el, cfg.className.col);
    });

    activeEls = col.getElementsByClassName(cfg.className.active);
    if (activeEls.length) {
      removeClass(activeEls[0], cfg.className.active);
    }

    addClass(el, cfg.className.active);

    emitter.emit('itemClicked', {
      col: col,
      item: el.item
    });
  }
};

/**
 * @param  {object} data
 * @param  {object} config
 * @return {element} column
 */
finder.createColumn = function createColumn(data, cfg) {
  var div = document.createElement('div');
  var list = finder.createList(data, cfg);

  addClass(div, cfg.className.col);
  div.appendChild(list);

  return div;
};

/**
 * @param  {array} data
 * @param  {object} config
 * @return {element} list
 */
finder.createList = function createList(data, cfg) {
  var ul = document.createElement('ul');
  var items = data.map(finder.createItem.bind(null, cfg));
  var docFrag;

  docFrag = items.reduce(function each(docFrag, curr) {
    docFrag.appendChild(curr);
    return docFrag;
  }, document.createDocumentFragment());

  ul.appendChild(docFrag);
  addClass(ul, cfg.className.list);

  return ul;
};

/**
 * @param  {object} config
 * @param  {object} item data
 * @return {element} list item
 */
finder.createItem = function createItem(cfg, item) {
  var li = document.createElement('li');
  var text = document.createTextNode(item.label);

  addClass(li, cfg.className.item);
  li.item = item;
  li.appendChild(text);

  return li;
};
