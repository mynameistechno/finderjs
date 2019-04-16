/**
 * finder.js module.
 * @module finderjs
 */
'use strict';

var extend = require('xtend');
var document = require('global/document');
var window = require('global/window');
var EventEmitter = require('eventemitter3');
var isArray = require('x-is-array');

var _ = require('./util');
var defaults = {
  labelKey: 'label',
  childKey: 'children',
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
 * @param  {Array|Function} data
 * @param  {object} options
 * @return {object} event emitter
 */
function finder(container, data, options) {
  var emitter = new EventEmitter();
  var cfg = extend(
    defaults,
    {
      container: container,
      emitter: emitter
    },
    options
  );

  // xtend doesn't deep merge
  cfg.className = extend(defaults.className, options ? options.className : {});

  // store the fn so we can call it on subsequent selections
  if (typeof data === 'function') {
    cfg.data = data;
  }

  // dom events
  container.addEventListener('click', finder.clickEvent.bind(null, cfg));
  container.addEventListener('keydown', finder.keydownEvent.bind(null, cfg));

  // internal events
  emitter.on('item-selected', finder.itemSelected.bind(null, cfg));
  emitter.on('create-column', finder.addColumn.bind(null, cfg));
  emitter.on('navigate', finder.navigate.bind(null, cfg));
  emitter.on('go-to', finder.goTo.bind(null, cfg, data));

  _.addClass(container, cfg.className.container);

  finder.createColumn(data, cfg);

  if (cfg.defaultPath) {
    window.requestAnimationFrame(function next() {
      finder.goTo(cfg, data, cfg.defaultPath);
    });
  }

  container.setAttribute('tabindex', 0);

  return emitter;
}

/**
 * @param {string} str
 * @return {string}
 */
function trim(str) {
  return str.trim();
}

/**
 * @param  {object} config
 * @param {object} data
 * @param {array|string} path
 */
finder.goTo = function goTo(cfg, data, goToPath) {
  var path = isArray(goToPath)
    ? goToPath
    : goToPath
        .split('/')
        .map(trim)
        .filter(Boolean);
  if (path.length) {
    while (cfg.container.firstChild) {
      cfg.container.removeChild(cfg.container.firstChild);
    }
    finder.selectPath(path, cfg, data);
  }
};

/**
 * @param {element} container
 * @param {element} column to append to container
 */
finder.addColumn = function addColumn(cfg, col) {
  cfg.container.appendChild(col);

  cfg.emitter.emit('column-created', col);
};

/**
 * @param  {object} config
 * @param  {object} event value
 * @param {object | undefined}
 */
finder.itemSelected = function itemSelected(cfg, value) {
  var itemEl = value.item;
  var item = itemEl._item;
  var col = value.col;
  var data = item[cfg.childKey] || cfg.data;
  var activeEls = col.getElementsByClassName(cfg.className.active);
  var x = window.pageXOffset;
  var y = window.pageYOffset;
  var newCol;

  if (activeEls.length) {
    _.removeClass(activeEls[0], cfg.className.active);
  }
  _.addClass(itemEl, cfg.className.active);
  _.nextSiblings(col).map(_.remove);

  // fix for #14: we need to keep the focus on a live DOM element, such as the
  // container, in order for keydown events to get fired
  cfg.container.focus();
  window.scrollTo(x, y);

  if (data) {
    newCol = finder.createColumn(data, cfg, item);
    cfg.emitter.emit('interior-selected', item);
  } else if (item.url) {
    document.location.href = item.url;
  } else {
    cfg.emitter.emit('leaf-selected', item);
  }
  return newCol;
};

/**
 * Click event handler for whole container
 * @param  {element} container
 * @param  {object} config
 * @param  {object} event
 */
finder.clickEvent = function clickEvent(cfg, event) {
  var el = event.target;
  var col = _.closest(el, function test(el) {
    return _.hasClass(el, cfg.className.col);
  });
  var item = _.closest(el, function test(el) {
    return _.hasClass(el, cfg.className.item);
  });

  _.stop(event);

  // list item clicked
  if (item) {
    cfg.emitter.emit('item-selected', {
      col: col,
      item: item
    });
  }
};

/**
 * Keydown event handler for container
 * @param  {object} config
 * @param  {object} event
 */
finder.keydownEvent = function keydownEvent(cfg, event) {
  var arrowCodes = {
    38: 'up',
    39: 'right',
    40: 'down',
    37: 'left'
  };

  if (event.keyCode in arrowCodes) {
    _.stop(event);

    cfg.emitter.emit('navigate', {
      direction: arrowCodes[event.keyCode],
      container: cfg.container
    });
  }
};
/**
 * Function to handle preselected path from option.
 * This is an recurive function which passes data of child
 * to itself for rendering column.
 * @param {array} path
 * @param {object} cfg
 * @param {object} data
 * @param {object | undefined} column
 */
finder.selectPath = function selectPath(path, cfg, data, column) {
  var currPath = path[0];
  var childData = data.find(function find(item) {
    return item[cfg.labelKey] === currPath;
  });

  var col = column || finder.createColumn(data, cfg);
  var newCol = finder.itemSelected(cfg, {
    col: col,
    item: _.first(col, '[data-fjs-item="' + currPath + '"]')
  });
  path.shift();
  if (path.length) {
    finder.selectPath(path, cfg, childData[cfg.childKey], newCol);
  }
};
/**
 * Navigate the finder up, down, right, or left
 * @param  {object} config
 * @param  {object} event value - `container` prop contains a reference to the
 * container, and `direction` can be 'up', 'down', 'right', 'left'
 */
finder.navigate = function navigate(cfg, value) {
  var active = finder.findLastActive(cfg);
  var target = null;
  var dir = value.direction;
  var item;
  var col;

  if (active) {
    item = active.item;
    col = active.col;

    if (dir === 'up' && item.previousSibling) {
      target = item.previousSibling;
    } else if (dir === 'down' && item.nextSibling) {
      target = item.nextSibling;
    } else if (dir === 'right' && col.nextSibling) {
      col = col.nextSibling;
      target = _.first(col, '.' + cfg.className.item);
    } else if (dir === 'left' && col.previousSibling) {
      col = col.previousSibling;
      target =
        _.first(col, '.' + cfg.className.active) ||
        _.first(col, '.' + cfg.className.item);
    }
  } else {
    col = _.first(cfg.container, '.' + cfg.className.col);
    target = _.first(col, '.' + cfg.className.item);
  }

  if (target) {
    cfg.emitter.emit('item-selected', {
      container: cfg.container,
      col: col,
      item: target
    });
  }
};

/**
 * Find last (right-most) active item and column
 * @param  {Element} container
 * @param  {Object} config
 * @return {Object}
 */
finder.findLastActive = function findLastActive(cfg) {
  var activeItems = cfg.container.getElementsByClassName(cfg.className.active);
  var item;
  var col;

  if (!activeItems.length) {
    return null;
  }

  item = activeItems[activeItems.length - 1];
  col = _.closest(item, function test(el) {
    return _.hasClass(el, cfg.className.col);
  });

  return {
    col: col,
    item: item
  };
};

/**
 * @param  {object} data
 * @param  {object} config
 * @param  {parent} [parent] - parent item that clicked/triggered createColumn
 */
finder.createColumn = function createColumn(data, cfg, parent) {
  var div;
  var list;
  function callback(data) {
    return finder.createColumn(data, cfg, parent);
  }

  if (typeof data === 'function') {
    data.call(null, parent, cfg, callback);
  } else if (isArray(data)) {
    list = finder.createList(data, cfg);
    div = _.el('div');
    div.appendChild(list);
    _.addClass(div, cfg.className.col);
    cfg.emitter.emit('create-column', div);
    return div;
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
  var items = data.map(function create(item) {
    return finder.createItem(cfg, item);
  });
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
  var prepend = _.el('div.' + cfg.className.itemPrepend);
  var content = _.el('div.' + cfg.className.itemContent);
  var append = _.el('div.' + cfg.className.itemAppend);

  frag.appendChild(prepend);
  content.appendChild(document.createTextNode(item[cfg.labelKey]));
  frag.appendChild(content);
  frag.appendChild(append);

  return frag;
};

/**
 * @param  {object} cfg config object
 * @param  {object} item data
 */

finder.createItem = function createItem(cfg, item) {
  var frag = document.createDocumentFragment();
  var liClassNames = [cfg.className.item];
  var li = _.el('li');
  var a = _.el('a');
  var createItemContent = cfg.createItemContent || finder.createItemContent;

  frag = createItemContent.call(null, cfg, item);
  a.appendChild(frag);

  a.href = '';
  a.setAttribute('tabindex', -1);
  if (item.url) {
    a.href = item.url;
    liClassNames.push(cfg.className.url);
  }
  if (item.className) {
    liClassNames.push(item.className);
  }
  if (item[cfg.childKey]) {
    liClassNames.push(cfg.className[cfg.childKey]);
  }
  _.addClass(li, liClassNames);
  li.appendChild(a);
  li.setAttribute('data-fjs-item', item[cfg.labelKey]);
  li._item = item;

  return li;
};
