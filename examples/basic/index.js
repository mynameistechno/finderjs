'use strict';

var finder = require('../../src/finder');

var data = [{
  label: 'A',
  value: 'a-1',
  data: [{
    label: 'A1',
    value: 'aa-1',
    url: 'http://www.qualcomm.com'
  }, {
    label: 'A2',
    value: 'aa-2',
    data: [{
      label: 'A2A',
      value: 'ba-1',
      data: [{
        label: 'A2A1',
        value: 'ba-1',
        data: [{
          label: 'A2A1A',
          value: 'ba-1',
          url: 'http://a.com'
        }, {
          label: 'A2A1A',
          value: 'ba-1',
          url: 'http://a.com'
        }, {
          label: 'A2A1A',
          value: 'ba-1',
          url: 'http://a.com'
        }, {
          label: 'A2A1A',
          value: 'ba-1',
          url: 'http://a.com'
        }]
      }]
    }, {
      label: 'A2B',
      value: 'ba-2',
      data: [{
        label: 'A2B1',
        value: 'ba-2',
        url: 'http://test.com'
      }]
    }]
  }]
}, {
  label: 'B',
  value: 'b-1',
  data: [{
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

finder(container, data, options);
