(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var xhr = require('xhr');
var extend = require('xtend');
var finder = require('../index');
var _ = require('../util');

var emitter;
var xhrCnt = 0;

module.exports = createExample;


function createExample(container) {
  emitter = finder(container, remoteSource, {
    createItemContent: createItemContent
  });

  // scroll to the right if necessary
  emitter.on('column-created', function columnCreated() {
    container.scrollLeft = container.scrollWidth - container.clientWidth;
  });
}

function remoteSource(parent, cfg, callback) {
  var loadingIndicator = createLoadingColumn();
  var xhrUid = ++xhrCnt;
  var type = 'region';

  // determine which column we're on based on previous selection
  if (parent) {
    if (parent.type === 'region') {
      type = 'subregion';
    } else if (parent.type === 'subregion') {
      type = 'name'; // country
    } else { // must be a country
      return cfg.emitter.emit('create-column', createSimpleColumn(parent));
    }
  }

  // loading spinner
  cfg.emitter.emit('create-column', loadingIndicator);

  // xhr request
  xhr({
    uri: 'https://restcountries.eu/rest/v1/all'
  }, function done(err, resp, body) {
    var rawData = JSON.parse(body);
    var data = uniqueCountryData(rawData, type, parent);

    // clear loading spinner
    _.remove(loadingIndicator);

    // stale request
    if (xhrUid !== xhrCnt) {
      return;
    }

    // execute callback
    callback(data);
  });
}

// transform rest country data for example
function uniqueCountryData(data, type, parent) {
  var hash = data.reduce(function each(prev, curr) {
    if (!(curr[type] in prev)) {
      if (parent) {
        if (parent.label === curr[parent.type]) {
          prev[curr[type]] = curr;
        }
      } else if (curr[type]) {
        prev[curr[type]] = curr;
      }
    }

    return prev;
  }, {});

  return Object.keys(hash).map(function each(item) {
    return extend(hash[item], {
      label: item,
      type: type === 'name' ? 'country' : type
    });
  });
}

// item render
function createItemContent(cfg, item) {
  var data = item.children || cfg.data;
  var frag = document.createDocumentFragment();
  var label = _.el('span');
  var iconPrepend = _.el('i');
  var iconAppend = _.el('i');
  var prependClasses = ['fa'];
  var appendClasses = ['fa'];

  // prepended icon
  if (item.type === 'region') {
    prependClasses.push('fa-globe');
  } else if (item.type === 'subregion') {
    prependClasses.push('fa-compass');
  } else {
    prependClasses.push('fa-map-marker');
  }
  _.addClass(iconPrepend, prependClasses);

  // text label
  label.appendChild(iconPrepend);
  label.appendChild(_.text(item.label));
  frag.appendChild(label);

  // appended icon
  if (data) {
    appendClasses.push('fa-caret-right');
  } else if ('url' in item) {
    appendClasses.push('fa-external-link');
  }
  _.addClass(iconAppend, appendClasses);
  frag.appendChild(iconAppend);

  return frag;
}

function createLoadingColumn() {
  var div = _.el('div.fjs-col.leaf-col');
  var row = _.el('div.leaf-row');
  var text = _.text('Loading...');
  var i = _.el('span');

  _.addClass(i, ['fa', 'fa-refresh', 'fa-spin']);
  _.append(row, [i, text]);

  return _.append(div, row);
}

function createSimpleColumn(item) {
  var div = _.el('div.fjs-col.leaf-col');
  var row = _.el('div.leaf-row');
  var filename = _.text(item.label);
  var i = _.el('i');
  var capital = _.el('div.meta');
  var capitalLabel = _.el('strong');
  var population = _.el('div.meta');
  var populationLabel  = _.el('strong');

  _.addClass(i, ['fa', 'fa-info-circle']);
  _.append(capitalLabel, _.text('Capital: '));
  _.append(capital, [capitalLabel, _.text(item.capital)]);
  _.append(populationLabel , _.text('Population: '));
  _.append(population, [
    populationLabel,
    _.text(Number(item.population).toLocaleString())
  ]);
  _.append(row, [i, filename, capital, population]);

  return _.append(div, row);
}

},{"../index":5,"../util":37,"xhr":35,"xtend":36}],2:[function(require,module,exports){
'use strict';

var finder = require('../index');
var _ = require('../util');

// sample data
var data = [
  {
    size: '10 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'build',
    children: [
      {
        size: '44 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'build',
        children: [
          {
            size: '2 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'finder.js'
          }
        ]
      },
      {
        size: '11 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'finder.js'
      }
    ]
  },
  {
    size: '9 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'example',
    children: [
      {
        size: '10 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'example',
        children: [
          {
            size: '10 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'test',
            children: [
              {
                size: '10 KB',
                modified: '03/09/2014 at 11:45am',
                label: 'index.js'
              },
              {
                size: '10 KB',
                modified: '03/09/2014 at 11:45am',
                label: 'test.js'
              },
              {
                size: '10 KB',
                modified: '03/09/2014 at 11:45am',
                label: 'util.js'
              }
            ]
          },
          {
            size: '33 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'bundle.js'
          },
          {
            size: '103 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'finderjs.css'
          },
          {
            size: '56 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'index.html'
          },
          {
            size: '122 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'index.js'
          }
        ]
      },
      {
        size: '8 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'bundle.js'
      },
      {
        size: '6 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'finderjs.css'
      },
      {
        size: '4 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'index.html'
      },
      {
        size: '2 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'index.js'
      }
    ]
  },
  {
    size: '10 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'test',
    children: [
      {
        size: '10 KB',
        modified: '03/09/2014 at 11:45am',
        label: 'index.js'
      },
      {
        size: '10 KB',
        modified: '03/09/2014 at 11:45am',
        label: 'test.js'
      },
      {
        size: '10 KB',
        modified: '03/09/2014 at 11:45am',
        label: 'util.js'
      }
    ]
  },
  {
    size: '56 KB',
    modified: '02/21/2015 at 10:04am',
    label: '.codeclimate.yml'
  },
  {
    size: '33 KB',
    modified: '02/21/2015 at 10:04am',
    label: '.eslintrc'
  },
  {
    size: '101 KB',
    modified: '02/21/2015 at 10:04am',
    label: '.gitignore'
  },
  {
    size: '96 KB',
    modified: '02/21/2015 at 10:04am',
    label: '.travis.yml'
  },
  {
    size: '69 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'index.js'
  },
  {
    size: '666 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'LICENSE'
  },
  {
    size: '187 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'Makefile'
  },
  {
    size: '45 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'package.json'
  },
  {
    size: '10 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'README.md'
  },
  {
    size: '7 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'util.js'
  },
  {
    size: '10 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'Project page',
    type: 'github-url',
    url: 'https://github.com/mynameistechno/finderjs'
  }
];
var emitter;

module.exports = createExample;

function createExample(container) {
  var button = document.getElementById('select-path-button');
  emitter = finder(container, data, {
    createItemContent: createItemContent,
    defaultPath: 'build/finder.js'
  });

  // when a leaf node selected, display the details in a new column
  emitter.on('leaf-selected', function selected(item) {
    emitter.emit('create-column', createSimpleColumn(item));
  });

  // scroll to the right if necessary when a new column is created
  emitter.on('column-created', function columnCreated() {
    container.scrollLeft = container.scrollWidth - container.clientWidth;
  });

  button.addEventListener('click', function goTo() {
    emitter.emit('go-to', 'test/test.js');
  });
}

// how each item in a column should be rendered
function createItemContent(cfg, item) {
  var data = item.children || cfg.data;
  var frag = document.createDocumentFragment();
  var label = _.el('span');
  var iconPrepend = _.el('i');
  var iconAppend = _.el('i');
  var prependClasses = ['fa'];
  var appendClasses = ['fa'];

  // prepended icon
  if (data) {
    prependClasses.push('fa-folder');
  } else if (item.type === 'github-url') {
    prependClasses.push('fa-github');
  } else {
    prependClasses.push('fa-file-o');
  }
  _.addClass(iconPrepend, prependClasses);

  // text label
  _.append(label, [iconPrepend, _.text(item.label)]);
  frag.appendChild(label);

  // appended icon
  if (data) {
    appendClasses.push('fa-caret-right');
  } else if ('url' in item) {
    appendClasses.push('fa-external-link');
  }
  _.addClass(iconAppend, appendClasses);
  frag.appendChild(iconAppend);

  return frag;
}

function createSimpleColumn(item) {
  var div = _.el('div.fjs-col.leaf-col');
  var row = _.el('div.leaf-row');
  var filename = _.text(item.label);
  var i = _.el('i');
  var size = _.el('div.meta');
  var sizeLabel = _.el('strong');
  var mod = _.el('div.meta');
  var modLabel = _.el('strong');

  _.addClass(i, ['fa', 'fa-file-o']);
  _.append(sizeLabel, _.text('Size: '));
  _.append(size, [sizeLabel, _.text(item.size)]);
  _.append(modLabel, _.text('Modified: '));
  _.append(mod, [modLabel, _.text(item.modified)]);
  _.append(row, [i, filename, size, mod]);

  return _.append(div, row);
}

},{"../index":5,"../util":37}],3:[function(require,module,exports){
'use strict';

var finder = require('../index');
var _ = require('../util');

// sample data
var data = [
  {
    size: '10 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'build',
    children: [
      {
        size: '44 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'build',
        children: [
          {
            size: '2 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'finder.js'
          }
        ]
      },
      {
        size: '11 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'finder.js'
      }
    ]
  },
  {
    size: '9 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'example',
    children: [
      {
        size: '10 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'example',
        children: [
          {
            size: '10 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'test',
            children: [
              {
                size: '10 KB',
                modified: '03/09/2014 at 11:45am',
                label: 'index.js'
              },
              {
                size: '10 KB',
                modified: '03/09/2014 at 11:45am',
                label: 'test.js'
              },
              {
                size: '10 KB',
                modified: '03/09/2014 at 11:45am',
                label: 'util.js'
              }
            ]
          },
          {
            size: '33 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'bundle.js'
          },
          {
            size: '103 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'finderjs.css'
          },
          {
            size: '56 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'index.html'
          },
          {
            size: '122 KB',
            modified: '02/21/2015 at 10:04am',
            label: 'index.js'
          }
        ]
      },
      {
        size: '8 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'bundle.js'
      },
      {
        size: '6 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'finderjs.css'
      },
      {
        size: '4 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'index.html'
      },
      {
        size: '2 KB',
        modified: '02/21/2015 at 10:04am',
        label: 'index.js'
      }
    ]
  },
  {
    size: '10 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'test',
    children: [
      {
        size: '10 KB',
        modified: '03/09/2014 at 11:45am',
        label: 'index.js'
      },
      {
        size: '10 KB',
        modified: '03/09/2014 at 11:45am',
        label: 'test.js'
      },
      {
        size: '10 KB',
        modified: '03/09/2014 at 11:45am',
        label: 'util.js'
      }
    ]
  },
  {
    size: '56 KB',
    modified: '02/21/2015 at 10:04am',
    label: '.codeclimate.yml'
  },
  {
    size: '33 KB',
    modified: '02/21/2015 at 10:04am',
    label: '.eslintrc'
  },
  {
    size: '101 KB',
    modified: '02/21/2015 at 10:04am',
    label: '.gitignore'
  },
  {
    size: '96 KB',
    modified: '02/21/2015 at 10:04am',
    label: '.travis.yml'
  },
  {
    size: '69 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'index.js'
  },
  {
    size: '666 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'LICENSE'
  },
  {
    size: '187 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'Makefile'
  },
  {
    size: '45 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'package.json'
  },
  {
    size: '10 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'README.md'
  },
  {
    size: '7 KB',
    modified: '02/15/2012 at 1:02pm',
    label: 'util.js'
  },
  {
    size: '10 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'Project page',
    type: 'github-url',
    url: 'https://github.com/mynameistechno/finderjs'
  }
];
var emitter;

module.exports = createExample;

function createExample(container) {
  emitter = finder(container, data, {
    createItemContent: createItemContent
  });

  // when a leaf node selected, display the details in a new column
  emitter.on('leaf-selected', function selected(item) {
    emitter.emit('create-column', createSimpleColumn(item));
  });

  // scroll to the right if necessary when a new column is created
  emitter.on('column-created', function columnCreated() {
    container.scrollLeft = container.scrollWidth - container.clientWidth;
  });
}

// how each item in a column should be rendered
function createItemContent(cfg, item) {
  var data = item.children || cfg.data;
  var frag = document.createDocumentFragment();
  var label = _.el('span');
  var iconPrepend = _.el('i');
  var iconAppend = _.el('i');
  var prependClasses = ['fa'];
  var appendClasses = ['fa'];

  // prepended icon
  if (data) {
    prependClasses.push('fa-folder');
  } else if (item.type === 'github-url') {
    prependClasses.push('fa-github');
  } else {
    prependClasses.push('fa-file-o');
  }
  _.addClass(iconPrepend, prependClasses);

  // text label
  _.append(label, [iconPrepend, _.text(item.label)]);
  frag.appendChild(label);

  // appended icon
  if (data) {
    appendClasses.push('fa-caret-right');
  } else if ('url' in item) {
    appendClasses.push('fa-external-link');
  }
  _.addClass(iconAppend, appendClasses);
  frag.appendChild(iconAppend);

  return frag;
}

function createSimpleColumn(item) {
  var div = _.el('div.fjs-col.leaf-col');
  var row = _.el('div.leaf-row');
  var filename = _.text(item.label);
  var i = _.el('i');
  var size = _.el('div.meta');
  var sizeLabel = _.el('strong');
  var mod = _.el('div.meta');
  var modLabel = _.el('strong');

  _.addClass(i, ['fa', 'fa-file-o']);
  _.append(sizeLabel, _.text('Size: '));
  _.append(size, [sizeLabel, _.text(item.size)]);
  _.append(modLabel, _.text('Modified: '));
  _.append(mod, [modLabel, _.text(item.modified)]);
  _.append(row, [i, filename, size, mod]);

  return _.append(div, row);
}

},{"../index":5,"../util":37}],4:[function(require,module,exports){
'use strict';

var document = require('global/document');
var exampleStatic = require('./example-static');
var exampleStaticSelectPath = require('./example-static-select-path');
var exampleAsync = require('./example-async');

exampleStatic(document.getElementById('container1'));
exampleAsync(document.getElementById('container2'));
exampleStaticSelectPath(document.getElementById('container3'));

},{"./example-async":1,"./example-static":3,"./example-static-select-path":2,"global/document":22}],5:[function(require,module,exports){
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

},{"./util":37,"eventemitter3":18,"global/document":22,"global/window":23,"x-is-array":34,"xtend":36}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

var toStr = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		origDefineProperty(obj, 'x', { enumerable: false, value: obj });
		// eslint-disable-next-line no-unused-vars, no-restricted-syntax
		for (var _ in obj) { // jscs:ignore disallowUnusedVariables
			return false;
		}
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		origDefineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = concat.call(props, Object.getOwnPropertySymbols(map));
	}
	for (var i = 0; i < props.length; i += 1) {
		defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	}
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

},{"object-keys":27}],8:[function(require,module,exports){
'use strict';

/* globals
	Set,
	Map,
	WeakSet,
	WeakMap,

	Promise,

	Symbol,
	Proxy,

	Atomics,
	SharedArrayBuffer,

	ArrayBuffer,
	DataView,
	Uint8Array,
	Float32Array,
	Float64Array,
	Int8Array,
	Int16Array,
	Int32Array,
	Uint8ClampedArray,
	Uint16Array,
	Uint32Array,
*/

var undefined; // eslint-disable-line no-shadow-restricted-names

var ThrowTypeError = Object.getOwnPropertyDescriptor
	? (function () { return Object.getOwnPropertyDescriptor(arguments, 'callee').get; }())
	: function () { throw new TypeError(); };

var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var generator; // = function * () {};
var generatorFunction = generator ? getProto(generator) : undefined;
var asyncFn; // async function() {};
var asyncFunction = asyncFn ? asyncFn.constructor : undefined;
var asyncGen; // async function * () {};
var asyncGenFunction = asyncGen ? getProto(asyncGen) : undefined;
var asyncGenIterator = asyncGen ? asyncGen() : undefined;

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'$ %Array%': Array,
	'$ %ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'$ %ArrayBufferPrototype%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer.prototype,
	'$ %ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'$ %ArrayPrototype%': Array.prototype,
	'$ %ArrayProto_entries%': Array.prototype.entries,
	'$ %ArrayProto_forEach%': Array.prototype.forEach,
	'$ %ArrayProto_keys%': Array.prototype.keys,
	'$ %ArrayProto_values%': Array.prototype.values,
	'$ %AsyncFromSyncIteratorPrototype%': undefined,
	'$ %AsyncFunction%': asyncFunction,
	'$ %AsyncFunctionPrototype%': asyncFunction ? asyncFunction.prototype : undefined,
	'$ %AsyncGenerator%': asyncGen ? getProto(asyncGenIterator) : undefined,
	'$ %AsyncGeneratorFunction%': asyncGenFunction,
	'$ %AsyncGeneratorPrototype%': asyncGenFunction ? asyncGenFunction.prototype : undefined,
	'$ %AsyncIteratorPrototype%': asyncGenIterator && hasSymbols && Symbol.asyncIterator ? asyncGenIterator[Symbol.asyncIterator]() : undefined,
	'$ %Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'$ %Boolean%': Boolean,
	'$ %BooleanPrototype%': Boolean.prototype,
	'$ %DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'$ %DataViewPrototype%': typeof DataView === 'undefined' ? undefined : DataView.prototype,
	'$ %Date%': Date,
	'$ %DatePrototype%': Date.prototype,
	'$ %decodeURI%': decodeURI,
	'$ %decodeURIComponent%': decodeURIComponent,
	'$ %encodeURI%': encodeURI,
	'$ %encodeURIComponent%': encodeURIComponent,
	'$ %Error%': Error,
	'$ %ErrorPrototype%': Error.prototype,
	'$ %eval%': eval, // eslint-disable-line no-eval
	'$ %EvalError%': EvalError,
	'$ %EvalErrorPrototype%': EvalError.prototype,
	'$ %Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'$ %Float32ArrayPrototype%': typeof Float32Array === 'undefined' ? undefined : Float32Array.prototype,
	'$ %Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'$ %Float64ArrayPrototype%': typeof Float64Array === 'undefined' ? undefined : Float64Array.prototype,
	'$ %Function%': Function,
	'$ %FunctionPrototype%': Function.prototype,
	'$ %Generator%': generator ? getProto(generator()) : undefined,
	'$ %GeneratorFunction%': generatorFunction,
	'$ %GeneratorPrototype%': generatorFunction ? generatorFunction.prototype : undefined,
	'$ %Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'$ %Int8ArrayPrototype%': typeof Int8Array === 'undefined' ? undefined : Int8Array.prototype,
	'$ %Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'$ %Int16ArrayPrototype%': typeof Int16Array === 'undefined' ? undefined : Int8Array.prototype,
	'$ %Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'$ %Int32ArrayPrototype%': typeof Int32Array === 'undefined' ? undefined : Int32Array.prototype,
	'$ %isFinite%': isFinite,
	'$ %isNaN%': isNaN,
	'$ %IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'$ %JSON%': JSON,
	'$ %JSONParse%': JSON.parse,
	'$ %Map%': typeof Map === 'undefined' ? undefined : Map,
	'$ %MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'$ %MapPrototype%': typeof Map === 'undefined' ? undefined : Map.prototype,
	'$ %Math%': Math,
	'$ %Number%': Number,
	'$ %NumberPrototype%': Number.prototype,
	'$ %Object%': Object,
	'$ %ObjectPrototype%': Object.prototype,
	'$ %ObjProto_toString%': Object.prototype.toString,
	'$ %ObjProto_valueOf%': Object.prototype.valueOf,
	'$ %parseFloat%': parseFloat,
	'$ %parseInt%': parseInt,
	'$ %Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'$ %PromisePrototype%': typeof Promise === 'undefined' ? undefined : Promise.prototype,
	'$ %PromiseProto_then%': typeof Promise === 'undefined' ? undefined : Promise.prototype.then,
	'$ %Promise_all%': typeof Promise === 'undefined' ? undefined : Promise.all,
	'$ %Promise_reject%': typeof Promise === 'undefined' ? undefined : Promise.reject,
	'$ %Promise_resolve%': typeof Promise === 'undefined' ? undefined : Promise.resolve,
	'$ %Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'$ %RangeError%': RangeError,
	'$ %RangeErrorPrototype%': RangeError.prototype,
	'$ %ReferenceError%': ReferenceError,
	'$ %ReferenceErrorPrototype%': ReferenceError.prototype,
	'$ %Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'$ %RegExp%': RegExp,
	'$ %RegExpPrototype%': RegExp.prototype,
	'$ %Set%': typeof Set === 'undefined' ? undefined : Set,
	'$ %SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'$ %SetPrototype%': typeof Set === 'undefined' ? undefined : Set.prototype,
	'$ %SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'$ %SharedArrayBufferPrototype%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer.prototype,
	'$ %String%': String,
	'$ %StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'$ %StringPrototype%': String.prototype,
	'$ %Symbol%': hasSymbols ? Symbol : undefined,
	'$ %SymbolPrototype%': hasSymbols ? Symbol.prototype : undefined,
	'$ %SyntaxError%': SyntaxError,
	'$ %SyntaxErrorPrototype%': SyntaxError.prototype,
	'$ %ThrowTypeError%': ThrowTypeError,
	'$ %TypedArray%': TypedArray,
	'$ %TypedArrayPrototype%': TypedArray ? TypedArray.prototype : undefined,
	'$ %TypeError%': TypeError,
	'$ %TypeErrorPrototype%': TypeError.prototype,
	'$ %Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'$ %Uint8ArrayPrototype%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array.prototype,
	'$ %Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'$ %Uint8ClampedArrayPrototype%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray.prototype,
	'$ %Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'$ %Uint16ArrayPrototype%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array.prototype,
	'$ %Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'$ %Uint32ArrayPrototype%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array.prototype,
	'$ %URIError%': URIError,
	'$ %URIErrorPrototype%': URIError.prototype,
	'$ %WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'$ %WeakMapPrototype%': typeof WeakMap === 'undefined' ? undefined : WeakMap.prototype,
	'$ %WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,
	'$ %WeakSetPrototype%': typeof WeakSet === 'undefined' ? undefined : WeakSet.prototype
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new TypeError('"allowMissing" argument must be a boolean');
	}

	var key = '$ ' + name;
	if (!(key in INTRINSICS)) {
		throw new SyntaxError('intrinsic ' + name + ' does not exist!');
	}

	// istanbul ignore if // hopefully this is impossible to test :-)
	if (typeof INTRINSICS[key] === 'undefined' && !allowMissing) {
		throw new TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
	}
	return INTRINSICS[key];
};

},{}],9:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('./GetIntrinsic');

var $Object = GetIntrinsic('%Object%');
var $TypeError = GetIntrinsic('%TypeError%');
var $String = GetIntrinsic('%String%');

var assertRecord = require('./helpers/assertRecord');
var $isNaN = require('./helpers/isNaN');
var $isFinite = require('./helpers/isFinite');

var sign = require('./helpers/sign');
var mod = require('./helpers/mod');

var IsCallable = require('is-callable');
var toPrimitive = require('es-to-primitive/es5');

var has = require('has');

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: toPrimitive,

	ToBoolean: function ToBoolean(value) {
		return !!value;
	},
	ToNumber: function ToNumber(value) {
		return +value; // eslint-disable-line no-implicit-coercion
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number)) { return 0; }
		if (number === 0 || !$isFinite(number)) { return number; }
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return $String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return $Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new $TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: IsCallable,
	SameValue: function SameValue(x, y) {
		if (x === y) { // 0 === -0, but they are not identical.
			if (x === 0) { return 1 / x === 1 / y; }
			return true;
		}
		return $isNaN(x) && $isNaN(y);
	},

	// https://www.ecma-international.org/ecma-262/5.1/#sec-8
	Type: function Type(x) {
		if (x === null) {
			return 'Null';
		}
		if (typeof x === 'undefined') {
			return 'Undefined';
		}
		if (typeof x === 'function' || typeof x === 'object') {
			return 'Object';
		}
		if (typeof x === 'number') {
			return 'Number';
		}
		if (typeof x === 'boolean') {
			return 'Boolean';
		}
		if (typeof x === 'string') {
			return 'String';
		}
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
	IsPropertyDescriptor: function IsPropertyDescriptor(Desc) {
		if (this.Type(Desc) !== 'Object') {
			return false;
		}
		var allowed = {
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Get]]': true,
			'[[Set]]': true,
			'[[Value]]': true,
			'[[Writable]]': true
		};

		for (var key in Desc) { // eslint-disable-line
			if (has(Desc, key) && !allowed[key]) {
				return false;
			}
		}

		var isData = has(Desc, '[[Value]]');
		var IsAccessor = has(Desc, '[[Get]]') || has(Desc, '[[Set]]');
		if (isData && IsAccessor) {
			throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
		}
		return true;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-8.10.1
	IsAccessorDescriptor: function IsAccessorDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		assertRecord(this, 'Property Descriptor', 'Desc', Desc);

		if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
			return false;
		}

		return true;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-8.10.2
	IsDataDescriptor: function IsDataDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		assertRecord(this, 'Property Descriptor', 'Desc', Desc);

		if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
			return false;
		}

		return true;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-8.10.3
	IsGenericDescriptor: function IsGenericDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		assertRecord(this, 'Property Descriptor', 'Desc', Desc);

		if (!this.IsAccessorDescriptor(Desc) && !this.IsDataDescriptor(Desc)) {
			return true;
		}

		return false;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-8.10.4
	FromPropertyDescriptor: function FromPropertyDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return Desc;
		}

		assertRecord(this, 'Property Descriptor', 'Desc', Desc);

		if (this.IsDataDescriptor(Desc)) {
			return {
				value: Desc['[[Value]]'],
				writable: !!Desc['[[Writable]]'],
				enumerable: !!Desc['[[Enumerable]]'],
				configurable: !!Desc['[[Configurable]]']
			};
		} else if (this.IsAccessorDescriptor(Desc)) {
			return {
				get: Desc['[[Get]]'],
				set: Desc['[[Set]]'],
				enumerable: !!Desc['[[Enumerable]]'],
				configurable: !!Desc['[[Configurable]]']
			};
		} else {
			throw new $TypeError('FromPropertyDescriptor must be called with a fully populated Property Descriptor');
		}
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-8.10.5
	ToPropertyDescriptor: function ToPropertyDescriptor(Obj) {
		if (this.Type(Obj) !== 'Object') {
			throw new $TypeError('ToPropertyDescriptor requires an object');
		}

		var desc = {};
		if (has(Obj, 'enumerable')) {
			desc['[[Enumerable]]'] = this.ToBoolean(Obj.enumerable);
		}
		if (has(Obj, 'configurable')) {
			desc['[[Configurable]]'] = this.ToBoolean(Obj.configurable);
		}
		if (has(Obj, 'value')) {
			desc['[[Value]]'] = Obj.value;
		}
		if (has(Obj, 'writable')) {
			desc['[[Writable]]'] = this.ToBoolean(Obj.writable);
		}
		if (has(Obj, 'get')) {
			var getter = Obj.get;
			if (typeof getter !== 'undefined' && !this.IsCallable(getter)) {
				throw new TypeError('getter must be a function');
			}
			desc['[[Get]]'] = getter;
		}
		if (has(Obj, 'set')) {
			var setter = Obj.set;
			if (typeof setter !== 'undefined' && !this.IsCallable(setter)) {
				throw new $TypeError('setter must be a function');
			}
			desc['[[Set]]'] = setter;
		}

		if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
			throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
		}
		return desc;
	}
};

module.exports = ES5;

},{"./GetIntrinsic":8,"./helpers/assertRecord":10,"./helpers/isFinite":11,"./helpers/isNaN":12,"./helpers/mod":13,"./helpers/sign":14,"es-to-primitive/es5":16,"has":15,"is-callable":24}],10:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');

var has = require('has');

var predicates = {
  // https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
  'Property Descriptor': function isPropertyDescriptor(ES, Desc) {
    if (ES.Type(Desc) !== 'Object') {
      return false;
    }
    var allowed = {
      '[[Configurable]]': true,
      '[[Enumerable]]': true,
      '[[Get]]': true,
      '[[Set]]': true,
      '[[Value]]': true,
      '[[Writable]]': true
    };

    for (var key in Desc) { // eslint-disable-line
      if (has(Desc, key) && !allowed[key]) {
        return false;
      }
    }

    var isData = has(Desc, '[[Value]]');
    var IsAccessor = has(Desc, '[[Get]]') || has(Desc, '[[Set]]');
    if (isData && IsAccessor) {
      throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
    }
    return true;
  }
};

module.exports = function assertRecord(ES, recordType, argumentName, value) {
  var predicate = predicates[recordType];
  if (typeof predicate !== 'function') {
    throw new $SyntaxError('unknown record type: ' + recordType);
  }
  if (!predicate(ES, value)) {
    throw new $TypeError(argumentName + ' must be a ' + recordType);
  }
  console.log(predicate(ES, value), value);
};

},{"../GetIntrinsic":8,"has":15}],11:[function(require,module,exports){
var $isNaN = Number.isNaN || function (a) { return a !== a; };

module.exports = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

},{}],12:[function(require,module,exports){
module.exports = Number.isNaN || function isNaN(a) {
	return a !== a;
};

},{}],13:[function(require,module,exports){
module.exports = function mod(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};

},{}],14:[function(require,module,exports){
module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};

},{}],15:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":21}],16:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

var isPrimitive = require('./helpers/isPrimitive');

var isCallable = require('is-callable');

// http://ecma-international.org/ecma-262/5.1/#sec-8.12.8
var ES5internalSlots = {
	'[[DefaultValue]]': function (O) {
		var actualHint;
		if (arguments.length > 1) {
			actualHint = arguments[1];
		} else {
			actualHint = toStr.call(O) === '[object Date]' ? String : Number;
		}

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// http://ecma-international.org/ecma-262/5.1/#sec-9.1
module.exports = function ToPrimitive(input) {
	if (isPrimitive(input)) {
		return input;
	}
	if (arguments.length > 1) {
		return ES5internalSlots['[[DefaultValue]]'](input, arguments[1]);
	}
	return ES5internalSlots['[[DefaultValue]]'](input);
};

},{"./helpers/isPrimitive":17,"is-callable":24}],17:[function(require,module,exports){
module.exports = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

},{}],18:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],19:[function(require,module,exports){
'use strict';

var isCallable = require('is-callable');

var toStr = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var forEachArray = function forEachArray(array, iterator, receiver) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
                iterator(array[i], i, array);
            } else {
                iterator.call(receiver, array[i], i, array);
            }
        }
    }
};

var forEachString = function forEachString(string, iterator, receiver) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        if (receiver == null) {
            iterator(string.charAt(i), i, string);
        } else {
            iterator.call(receiver, string.charAt(i), i, string);
        }
    }
};

var forEachObject = function forEachObject(object, iterator, receiver) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
                iterator(object[k], k, object);
            } else {
                iterator.call(receiver, object[k], k, object);
            }
        }
    }
};

var forEach = function forEach(list, iterator, thisArg) {
    if (!isCallable(iterator)) {
        throw new TypeError('iterator must be a function');
    }

    var receiver;
    if (arguments.length >= 3) {
        receiver = thisArg;
    }

    if (toStr.call(list) === '[object Array]') {
        forEachArray(list, iterator, receiver);
    } else if (typeof list === 'string') {
        forEachString(list, iterator, receiver);
    } else {
        forEachObject(list, iterator, receiver);
    }
};

module.exports = forEach;

},{"is-callable":24}],20:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],21:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":20}],22:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":6}],23:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
'use strict';

var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class\b/;
var isES6ClassFn = function isES6ClassFunction(value) {
	try {
		var fnStr = fnToStr.call(value);
		return constructorRegex.test(fnStr);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionToStr(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isCallable(value) {
	if (!value) { return false; }
	if (typeof value !== 'function' && typeof value !== 'object') { return false; }
	if (typeof value === 'function' && !value.prototype) { return true; }
	if (hasToStringTag) { return tryFunctionObject(value); }
	if (isES6ClassFn(value)) { return false; }
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};

},{}],25:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],26:[function(require,module,exports){
'use strict';

var keysShim;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var isArgs = require('./isArguments'); // eslint-disable-line global-require
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
module.exports = keysShim;

},{"./isArguments":28}],27:[function(require,module,exports){
'use strict';

var slice = Array.prototype.slice;
var isArgs = require('./isArguments');

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) { return origKeys(o); } : require('./implementation');

var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./implementation":26,"./isArguments":28}],28:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],29:[function(require,module,exports){
var trim = require('string.prototype.trim')
  , forEach = require('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}

},{"for-each":19,"string.prototype.trim":31}],30:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var ES = require('es-abstract/es5');
var replace = bind.call(Function.call, String.prototype.replace);

var leftWhitespace = /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/;
var rightWhitespace = /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+$/;

module.exports = function trim() {
	var S = ES.ToString(ES.CheckObjectCoercible(this));
	return replace(replace(S, leftWhitespace, ''), rightWhitespace, '');
};

},{"es-abstract/es5":9,"function-bind":21}],31:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var define = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var boundTrim = bind.call(Function.call, getPolyfill());

define(boundTrim, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = boundTrim;

},{"./implementation":30,"./polyfill":32,"./shim":33,"define-properties":7,"function-bind":21}],32:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

var zeroWidthSpace = '\u200b';

module.exports = function getPolyfill() {
	if (String.prototype.trim && zeroWidthSpace.trim() === zeroWidthSpace) {
		return String.prototype.trim;
	}
	return implementation;
};

},{"./implementation":30}],33:[function(require,module,exports){
'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimStringTrim() {
	var polyfill = getPolyfill();
	define(String.prototype, { trim: polyfill }, { trim: function () { return String.prototype.trim !== polyfill; } });
	return polyfill;
};

},{"./polyfill":32,"define-properties":7}],34:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],35:[function(require,module,exports){
"use strict";
var window = require("global/window")
var isFunction = require("is-function")
var parseHeaders = require("parse-headers")
var xtend = require("xtend")

module.exports = createXHR
// Allow use of default import syntax in TypeScript
module.exports.default = createXHR;
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    if(typeof options.callback === "undefined"){
        throw new Error("callback argument missing")
    }

    var called = false
    var callback = function cbOnce(err, response, body){
        if(!called){
            called = true
            options.callback(err, response, body)
        }
    }

    function readystatechange() {
        if (xhr.readyState === 4) {
            setTimeout(loadFunc, 0)
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else {
            body = xhr.responseText || getXml(xhr)
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        return callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        return callback(err, response, response.body)
    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer
    var failureResponse = {
        body: undefined,
        headers: {},
        statusCode: 0,
        method: method,
        url: uri,
        rawRequest: xhr
    }

    if ("json" in options && options.json !== false) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json === true ? body : options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.onabort = function(){
        aborted = true;
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            if (aborted) return
            aborted = true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    // Microsoft Edge browser sends "undefined" when send is called with undefined value.
    // XMLHttpRequest spec says to pass null as body to indicate no body
    // See https://github.com/naugtur/xhr/issues/100.
    xhr.send(body || null)

    return xhr


}

function getXml(xhr) {
    // xhr.responseXML will throw Exception "InvalidStateError" or "DOMException"
    // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML.
    try {
        if (xhr.responseType === "document") {
            return xhr.responseXML
        }
        var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
        if (xhr.responseType === "" && !firefoxBugTakenEffect) {
            return xhr.responseXML
        }
    } catch (e) {}

    return null
}

function noop() {}

},{"global/window":23,"is-function":25,"parse-headers":29,"xtend":36}],36:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],37:[function(require,module,exports){
/**
 * util.js module.
 * @module util
 */
'use strict';

var document = require('global/document');
var isArray = require('x-is-array');

/**
 * check if variable is an element
 * @param  {*} potential element
 * @return {Boolean} return true if is an element
 */
function isElement(element) {
  try {
    // eslint-disable-next-line no-undef
    return element instanceof Element;
  } catch (error) {
    return !!(element && element.nodeType === 1);
  }
}

/**
 * createElement shortcut
 * @param  {String} tag
 * @return {Element} element
 */
function el(element) {
  var classes = [];
  var tag = element;
  var el;

  if (isElement(element)) {
    return element;
  }

  classes = element.split('.');
  if (classes.length > 1) {
    tag = classes[0];
  }
  el = document.createElement(tag);
  addClass(el, classes.slice(1));

  return el;
}

/**
 * createDocumentFragment shortcut
 * @return {DocumentFragment}
 */
function frag() {
  return document.createDocumentFragment();
}

/**
 * createTextNode shortcut
 * @return {TextNode}
 */
function text(text) {
  return document.createTextNode(text);
}

/**
 * remove element
 * @param  {Element} element to remove
 * @return {Element} removed element
 */
function remove(element) {
  if ('remove' in element) {
    element.remove();
  } else {
    element.parentNode.removeChild(element);
  }

  return element;
}

/**
 * Find first element that tests true, starting with the element itself
 * and traversing up through its ancestors
 * @param  {Element} element
 * @param  {Function} test fn - return true when element located
 * @return {Element}
 */
function closest(element, test) {
  var el = element;

  while (el) {
    if (test(el)) {
      return el;
    }
    el = el.parentNode;
  }

  return null;
}

/**
 * Add one or more classnames to an element
 * @param {Element} element
 * @param {Array.<string>|String} array of classnames or string with
 * classnames separated by whitespace
 * @return {Element}
 */
function addClass(element, className) {
  var classNames = className;

  function _addClass(el, cn) {
    if (!el.className) {
      el.className = cn;
    } else if (!hasClass(el, cn)) {
      if (el.classList) {
        el.classList.add(cn);
      } else {
        el.className += ' ' + cn;
      }
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
 * @param  {Element} element
 * @param  {Array.<string>|String} array of classnames or string with
 * @return {Element}
 */
function removeClass(element, className) {
  var classNames = className;

  function _removeClass(el, cn) {
    var classRegex;
    if (el.classList) {
      el.classList.remove(cn);
    } else {
      classRegex = new RegExp('(?:^|\\s)' + cn + '(?!\\S)', 'g');
      el.className = el.className.replace(classRegex, '').trim();
    }
  }

  if (!isArray(className)) {
    classNames = className.trim().split(/\s+/);
  }
  classNames.forEach(_removeClass.bind(null, element));

  return element;
}

/**
 * Check if element has a class
 * @param  {Element}  element
 * @param  {String}  className
 * @return {boolean}
 */
function hasClass(element, className) {
  if (!element || !('className' in element)) {
    return false;
  }

  return element.className.split(/\s+/).indexOf(className) !== -1;
}

/**
 * Return all next siblings
 * @param  {Element} element
 * @return {Array.<element>}
 */
function nextSiblings(element) {
  var next = element.nextSibling;
  var siblings = [];

  while (next) {
    siblings.push(next);
    next = next.nextSibling;
  }

  return siblings;
}

/**
 * Return all prev siblings
 * @param  {Element} element
 * @return {Array.<element>}
 */
function previousSiblings(element) {
  var prev = element.previousSibling;
  var siblings = [];

  while (prev) {
    siblings.push(prev);
    prev = prev.previousSibling;
  }

  return siblings;
}

/**
 * Stop event propagation
 * @param  {Event} event
 * @return {Event}
 */
function stop(event) {
  event.stopPropagation();
  event.preventDefault();

  return event;
}

/**
 * Returns first element in parent that matches selector
 * @param  {Element} parent
 * @param  {String} selector
 * @return {Element | null}
 */
function first(parent, selector) {
  return parent.querySelector(selector);
}

function append(parent, _children) {
  var _frag = frag();
  var children = isArray(_children) ? _children : [_children];

  children.forEach(_frag.appendChild.bind(_frag));
  parent.appendChild(_frag);

  return parent;
}

module.exports = {
  el: el,
  frag: frag,
  text: text,
  closest: closest,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  nextSiblings: nextSiblings,
  previousSiblings: previousSiblings,
  remove: remove,
  stop: stop,
  first: first,
  append: append
};

},{"global/document":22,"x-is-array":34}]},{},[4]);
