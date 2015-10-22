/**
 * finder.js module.
 * @module finderjs
 */

'use strict';

var extend = require('xtend');
var document = require('global/document');
var Delegator = require('dom-delegator');
var EventEmitter = require('events').EventEmitter;
var isArray = require('x-is-array');

var _ = require('./util');

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
      active: 'fjs-active',
      children: 'fjs-has-children',
      itemPrepend: 'fjs-item-prepend',
      itemContent: 'fjs-item-content',
      itemAppend: 'fjs-item-append'
    }
  }, options);
  var delegator = Delegator();
  var emitter = new EventEmitter();
  var col;

  if (!isArray(data) || !data.length) {
    throw new Error('No data provided');
  }

  delegator.addEventListener(
    container, 'click', finder.clickEvent.bind(null, cfg, emitter));
  emitter.on('itemClicked', finder.itemSelected.bind(null, cfg, emitter));
  emitter.on('columnCreated', finder.addColumn.bind(null, container));

  _.addClass(container, cfg.className.container);
  col = finder.createColumn(data, cfg);
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

  curr = currCol.nextSibling;
  while (curr) {
    next = curr.nextSibling;
    curr.remove();
    curr = next;
  }

  if (item.children) {
    col = finder.createColumn(item.children, cfg);
    emitter.emit('columnCreated', col);
  }
};

/**
 * Click event handler for whole container
 * @param  {object} config
 * @param  {object} event emitter
 * @param  {object} event
 */
finder.clickEvent = function clickEvent(cfg, emitter, event) {
  var el = event.target;
  var activeEls;
  var col = _.closest(el, function test(el) {
    return _.hasClass(el, cfg.className.col);
  });
  var item = _.closest(el, function test(el) {
    return _.hasClass(el, cfg.className.item);
  });

  // list item clicked
  if (item) {
    activeEls = col.getElementsByClassName(cfg.className.active);
    if (activeEls.length) {
      _.removeClass(activeEls[0], cfg.className.active);
    }
    _.addClass(item, cfg.className.active);

    emitter.emit('itemClicked', {
      col: col,
      item: item.item
    });
  }
};

/**
 * @param  {object} data
 * @param  {object} config
 * @return {element} column
 */
finder.createColumn = function createColumn(data, cfg) {
  var div = _.el('div');
  var list = finder.createList(data, cfg);

  _.addClass(div, cfg.className.col);
  div.appendChild(list);

  return div;
};

/**
 * @param  {array} data
 * @param  {object} config
 * @return {element} list
 */
finder.createList = function createList(data, cfg) {
  var ul = _.el('ul');
  var items = data.map(finder.createItem.bind(null, cfg));
  var docFrag;

  docFrag = items.reduce(function each(docFrag, curr) {
    docFrag.appendChild(curr);
    return docFrag;
  }, document.createDocumentFragment());

  ul.appendChild(docFrag);
  _.addClass(ul, cfg.className.list);

  return ul;
};

/**
 * @param  {object} config
 * @param  {object} item data
 * @return {element} list item
 */
finder.createItem = function createItem(cfg, item) {
  var li = _.el('li');
  var docFrag = document.createDocumentFragment();
  var prepend = _.el('div');
  var content = _.el('div');
  var append = _.el('div');
  var text = document.createTextNode(item.label);

  _.addClass(li, [cfg.className.item, item.className || '']);
  if (item.children) {
    _.addClass(li, cfg.className.children);
  }

  prepend.className = cfg.className.itemPrepend;
  docFrag.appendChild(prepend);
  content.appendChild(text);
  content.className = cfg.className.itemContent;
  docFrag.appendChild(content);
  append.className = cfg.className.itemAppend;
  docFrag.appendChild(append);

  li.appendChild(docFrag);
  li.item = item;
  return li;
};
