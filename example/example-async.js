'use strict';

var xhr = require('xhr');
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
  var loading = createSimpleColumn(
    'Loading...', ['fa', 'fa-refresh', 'fa-spin']);
  var xhrUid = ++xhrCnt;

  cfg.emitter.emit('create-column', loading);
  xhr({
    uri: 'http://jsonplaceholder.typicode.com/users'
  }, function done(err, resp, body) {
    var data = JSON.parse(body);

    _.remove(loading);

    // stale request
    if (xhrUid !== xhrCnt) {
      return;
    }

    callback(data.map(function each(item) {
      return {
        label: item.address.city,
        id: item.id
      };
    }));
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
  if (data) {
    prependClasses.push('fa-folder');
  } else if (item.type === 'github-url') {
    prependClasses.push('fa-github');
  } else {
    prependClasses.push('fa-file-o');
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

function createSimpleColumn(text, classes) {
  var div = _.el('div.fjs-col.leaf-col');
  var row = _.el('div.leaf-row');
  var text = _.text(text);
  var i = _.el('i');

  _.addClass(i, classes);
  _.append(row, [i, text]);

  return _.append(div, row);
}


