[![Build Status](https://travis-ci.org/mynameistechno/finderjs.svg?branch=master)](https://travis-ci.org/mynameistechno/finderjs)
[![Code Climate](https://codeclimate.com/github/mynameistechno/finderjs/badges/gpa.svg)](https://codeclimate.com/github/mynameistechno/finderjs)
[![Test Coverage](https://codeclimate.com/github/mynameistechno/finderjs/badges/coverage.svg)](https://codeclimate.com/github/mynameistechno/finderjs/coverage)

# finderjs

Finder-like UI component for viewing hierarchical content in columns.

Demo:

[http://mynameistechno.github.io/finderjs/](http://mynameistechno.github.io/finderjs/)

## Installation

```bash
npm install finderjs
```

## Usage

Use it as a CommonJS module, as a standalone script, or as a jQuery plugin. Roll your own CSS or feel free to use the styling in `example/finderjs.css`, which leverages flexbox.

In its simpelst form:
```javascript
var f = finder(container, data, options);
```

Parameter | Type | Description
----------|------|------------
container | Element| Container element for finder
[data](#source-is-an-array)| Array&#124;Function | Data source can be an array or function
[options](#options)| Object | Configure classNames, item rendering, etc

### Data

The hierarchical data is represented with nested arrays. A data source can be an array or a function that executes a callback with the data (an array). This is handy for asynchronous data, such as a remote web service.

#### Source is an array

Each item in the array itself should be an object. When the data source is an array, each object that doesn't contain a `children` property is considered a leaf node. When a leaf node is selected, the `leaf-selected` event will be emitted. When present, the value of the `children` property should be an array. When a node has children and it is selected, it will use the `children` to populate the next column.

```javascript
var container = document.getElementById('container');
var data = [{
  label: 'Item 1',
  children: [{
    label: 'Item 1A',
    children: [{
      label: 'Item 1A1'
    }]
  }, {
    label: 'Item 1B'
  }]
}];
var options = {};

var f = finder(container, data, options);

f.on('leaf-selected', function(item) {
  console.log('Leaf selected', item);
});
```

See [this example](example/example-static.js) for more details.

#### Source is a function

When the data source is a function there is no need for the `children` property. This function will be called on every selection and will pass along the selected item. A callback is provided and should be called only if there are children for a new column.

```javascript
var container = document.getElementById('container');
var options = {};

/**
 * This function will be called on load and on every selection.
 * @param  {Object}   parent - item that was selected
 * @param  {Object}   cfg    - config object
 * @param  {Function} callback - call this with the data (Array)
 */
function remoteSource(parent, cfg, callback) {
  var children = [...];

  if (children.length) {
    callback(children);
  }
}

var f = finder(container, remoteSource, options);
```

See [this example](example/example-async.js) for more details.

#### Notes

If an object has a `url` property it will be treated slightly differently: the anchor tag that wraps the item will have the `href` attribute assigned to it. Upon selection of this item the browser will be redirected to the provided URL.

### Events

`finder` will return an EventEmitter which allows you to listen to (and emit) the following events:

Event                    | Description
-------------------------|-------------------------
`item-selected`          | An item was selected (clicked or keyboard arrow)
`leaf-selected`          | A leaf node was selected
`create-column `         | Append a column to the container
`column-created`         | A column was appended to the container
`navigate`               | Navigate the finder by going `up`, `down`, `right`, or `left`

See the examples for more [details](example).

### Options

Option | Type |Description
-------|------|-----------
`className`| Object | Override the [default classnames](https://github.com/mynameistechno/finderjs/blob/master/index.js#L14) by populating this object
`createItemContent` | Function | Define how each item is rendered. The first parameter passed in is the `config` object and the second is the `item` object that is currently being iterated on. It should return an HTML Element.

## Project commands

Command       | Description
--------------|-------------------------------------
`make build`  | Build finderjs and example
`make install`| Clears node_modules and installs
`make clean`  | Remove build and coverage data
`make lint`   | Lint files
`make test`   | Run tests
`make cover`  | Run coverage tests
`make watch in=<file> out=<file>` | Watchify a file

