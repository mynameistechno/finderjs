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
