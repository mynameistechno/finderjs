'use strict';

var xhr = require('xhr');
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
var container1 = document.getElementById('container1');
var options = {};
finder(container1, children, options);

function remoteSource(parent, config, callback) {
  xhr({
    uri: 'http://jsonplaceholder.typicode.com/users'
  }, function done(err, resp, body) {
    var data = JSON.parse(body);

    callback(data.map(function each(item) {
      return {
        label: item.address.city,
        id: item.id
      };
    }));
  });
}
finder(container2, remoteSource, options);
