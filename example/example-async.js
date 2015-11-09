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
