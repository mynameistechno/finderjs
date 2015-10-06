'use strict';

var finder = require('../../src/finder');

var data = [{
  label: 'A: Choice 1',
  value: 'a-1',
  data: [{
    label: 'AA: Choice 1',
    value: 'aa-1',
    url: 'http://www.qualcomm.com'
  }, {
    label: 'AA: Choice 2',
    value: 'aa-2',
    url: 'https://www.codeaurora.org/'
  }]
}, {
  label: 'B: Choice 1',
  value: 'b-1',
  data: [{
    label: 'BA: Choice 1',
    value: 'ba-1',
    url: 'http://www.qualcomm.com'
  }, {
    label: 'BA: Choice 2',
    value: 'ba-2',
    success: function success() {
      console.log('CLICK: ' + this.value);
    }
  }]
}];

var container = document.getElementById('container');


var options = {};

finder(container, data, options);
