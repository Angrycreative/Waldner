'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  get: function get(url) {

    return new Promise(function (resolve, reject) {

      _request2.default.get(url, function (error, response, body) {
        if (body.errors) {
          console.log('Error in GET', body.errors);
          reject(body.errors);
        } else {
          resolve(body);
        }
      });
    });
  },

  post: function post(url, data) {
    return new Promise(function (resolve, reject) {

      _request2.default.post({
        url: url,
        json: true,
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      }, function (error, response, body) {
        if (body.status === 'error') {
          console.log('Error in POST', body.errors);
          reject(body.errors);
        } else {
          resolve(body);
        }
      });
    });
  }

};