'use strict';

var finder = require('../index');

var children = [{
  label: 'A',
  value: 'a-1',
  children: [{
    label: 'A1',
    value: 'aa-1',
    url: 'http://www.qualcomm.com'
  }, {
    label: 'A2',
    value: 'aa-2',
    children: [{
      label: 'A2A',
      value: 'ba-1',
      children: [{
        label: 'A2A1',
        value: 'ba-1',
        children: [{
          label: 'A2A1A',
          value: 'ba-1',
          url: 'http://a.com'
        }, {
          label: 'A2A1B',
          value: 'ba-1',
          url: 'http://a.com'
        }, {
          label: 'A2A1C',
          value: 'ba-1',
          url: 'http://a.com'
        }, {
          label: 'A2A1D',
          value: 'ba-1',
          url: 'http://a.com'
        }]
      }]
    }, {
      label: 'A2B',
      value: 'ba-2',
      children: [{
        label: 'A2B1',
        value: 'ba-2',
        url: 'http://test.com'
      }]
    }]
  }]
}, {
  label: 'B',
  value: 'b-1',
  children: [{
    label: 'B1',
    value: 'ba-1',
    url: 'http://www.qualcomm.com'
  }, {
    label: 'B2',
    value: 'ba-2',
    success: function success() {
      console.log('CLICK: ' + this.value);
    }
  }]
}];

var container = document.getElementById('container');


var options = {};

finder(container, children, options);
