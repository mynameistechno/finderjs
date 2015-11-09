'use strict';

var finder = require('../index');
var _ = require('../util');

// sample data
var data = [{
  size: '10 KB',
  modified: '02/21/2015 at 10:04am',
  label: 'build',
  children: [{
    size: '44 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'build',
    children: [{
      size: '2 KB',
      modified: '02/21/2015 at 10:04am',
      label: 'finder.js'
    }]
  }, {
    size: '11 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'finder.js'
  }]
}, {
  size: '9 KB',
  modified: '02/21/2015 at 10:04am',
  label: 'example',
  children: [{
    size: '10 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'example',
    children: [{
      size: '33 KB',
      modified: '02/21/2015 at 10:04am',
      label: 'bundle.js'
    }, {
      size: '103 KB',
      modified: '02/21/2015 at 10:04am',
      label: 'finderjs.css'
    }, {
      size: '56 KB',
      modified: '02/21/2015 at 10:04am',
      label: 'index.html'
    }, {
      size: '122 KB',
      modified: '02/21/2015 at 10:04am',
      label: 'index.js'
    }]
  }, {
    size: '8 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'bundle.js'
  }, {
    size: '6 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'finderjs.css'
  }, {
    size: '4 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'index.html'
  }, {
    size: '2 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'index.js'
  }]
}, {
  size: '10 KB',
  modified: '02/21/2015 at 10:04am',
  label: 'test',
  children: [{
    size: '10 KB',
    modified: '03/09/2014 at 11:45am',
    label: 'index.js'
  }, {
    size: '10 KB',
    modified: '03/09/2014 at 11:45am',
    label: 'test.js'
  }, {
    size: '10 KB',
    modified: '03/09/2014 at 11:45am',
    label: 'util.js'
  }]
}, {
  size: '56 KB',
  modified: '02/21/2015 at 10:04am',
  label: '.codeclimate.yml'
}, {
  size: '33 KB',
  modified: '02/21/2015 at 10:04am',
  label: '.eslintrc'
}, {
  size: '101 KB',
  modified: '02/21/2015 at 10:04am',
  label: '.gitignore'
}, {
  size: '96 KB',
  modified: '02/21/2015 at 10:04am',
  label: '.travis.yml'
}, {
  size: '69 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'index.js'
}, {
  size: '666 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'LICENSE'
}, {
  size: '187 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'Makefile'
}, {
  size: '45 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'package.json'
}, {
  size: '10 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'README.md'
}, {
  size: '7 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'util.js'
}, {
  size: '10 KB',
  modified: '02/21/2015 at 10:04am',
  label: 'Project page',
  type: 'github-url',
  url: 'https://github.com/mynameistechno/finderjs'
}];
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
