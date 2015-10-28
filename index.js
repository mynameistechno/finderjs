/**
 * finder.js module.
 * @module finderjs
 */
'use strict';

var extend = require('xtend');
var document = require('global/document');
var Delegator = require('dom-delegator');
var EventEmitter = require('eventemitter3');
var isArray = require('x-is-array');

var _ = require('./util');
var defaults = {
  className: {
    container: 'fjs-container',
    col: 'fjs-col',
    list: 'fjs-list',
    item: 'fjs-item',
    active: 'fjs-active',
    children: 'fjs-has-children',
    url: 'fjs-url',
    itemPrepend: 'fjs-item-prepend',
    itemContent: 'fjs-item-content',
    itemAppend: 'fjs-item-append'
  }
};

module.exports = finder;

/**
 * @param  {element} container
 * @param  {object} data
 * @param  {object} options
 * @return {element} container
 */
function finder(container, data, options) {
  var cfg = extend(defaults, options);
  var delegator = Delegator();
  var emitter = new EventEmitter();

  // xtend doesn't deep merge
  if (options) {
    cfg.className = extend(defaults.className, options.className);
  }

  // store the fn so we can call it on subsequent selections
  if (typeof data === 'function') {
    cfg.data = data;
  }

  // dom events
  delegator.addEventListener(
    container, 'click', finder.clickEvent.bind(null, cfg, emitter));

  // internal events
  emitter.on('itemClicked', finder.itemSelected.bind(null, cfg, emitter));
  emitter.on('columnCreated', finder.addColumn.bind(null, container));

  _.addClass(container, cfg.className.container);
  finder.createColumn(data, cfg, emitter);

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
 * @param  {object} config
 * @param  {object} event emitter
 * @param  {object} event value
 */
finder.itemSelected = function itemSelected(cfg, emitter, value) {
  var item = value._item;
  var currCol = value.col;
  var data = item.children || cfg.data;

  _.nextSiblings(currCol).map(_.remove);

  if (data) {
    finder.createColumn(data, cfg, emitter, item);
  } else if (item.url) {
    document.location.href = item.url;
  } else {
    console.log('Warning: no action specified');
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

  event.preventDefault();

  // list item clicked
  if (item) {
    activeEls = col.getElementsByClassName(cfg.className.active);
    if (activeEls.length) {
      _.removeClass(activeEls[0], cfg.className.active);
    }
    _.addClass(item, cfg.className.active);

    emitter.emit('itemClicked', {
      col: col,
      item: item._item
    });
  }
};

/**
 * @param  {object} data
 * @param  {object} config
 * @param  {object} event emitter
 * @param  {parent} [parent] - parent item that clicked/triggered createColumn
 * @return {element} column
 */
finder.createColumn = function createColumn(data, cfg, emitter, parent) {
  var div;
  var list;
  function callback(data) {
    finder.createColumn(data, cfg, emitter, parent);
  };

  if (typeof data === 'function') {
    data.call(null, parent, cfg, callback);
  } else if (isArray(data)) {
    list = finder.createList(data, cfg);
    div = _.el('div');
    div.appendChild(list);
    _.addClass(div, cfg.className.col);

    emitter.emit('columnCreated', div);
  } else {
    throw new Error('Unknown data type');
  }
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
 * Default item render fn
 * @param  {object} cfg config object
 * @param  {object} item data
 * @return {DocumentFragment}
 */
finder.createItemContent = function createItemContent(cfg, item) {
  var frag = document.createDocumentFragment();
  var prepend = _.el('div');
  var content = _.el('div');
  var append = _.el('div');

  prepend.className = cfg.className.itemPrepend;
  frag.appendChild(prepend);

  content.className = cfg.className.itemContent;
  content.appendChild(document.createTextNode(item.label));
  frag.appendChild(content);

  append.className = cfg.className.itemAppend;
  frag.appendChild(append);

  return frag;
};

/**
 * @param  {object} cfg config object
 * @param  {object} item data
 * @return {element} list item
 */
finder.createItem = function createItem(cfg, item) {
  var frag = document.createDocumentFragment();
  var liClassNames = [cfg.className.item];
  var li = _.el('li');
  var a = _.el('a');
  var createItemContent = cfg.createItemContent || finder.createItemContent;

  frag = createItemContent.call(null, cfg, item);
  a.appendChild(frag);

  a.href = '#';
  if (item.url) {
    a.href = item.url;
    liClassNames.push(cfg.className.url);
  }
  if (item.className) {
    liClassNames.push(item.className);
  }
  if (item.children) {
    liClassNames.push(cfg.className.children);
  }
  _.addClass(li, liClassNames);
  li.appendChild(a);
  li._item = item;

  return li;
};
