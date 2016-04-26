'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
  function Model(props) {
    _classCallCheck(this, Model);

    this.props = props || {};
    if (props && props.id) {
      this.id = props.id;
    }
  }

  _createClass(Model, [{
    key: 'get',
    value: function get(key) {
      return this.props[key];
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      var _this = this;

      return new Promise(function (resolve, reject) {

        if (!_this.id) {
          reject('ID undefined');
        }

        _request2.default.get(process.env.API_BASE + _this.url + '/' + _this.id, function (error, response, body) {
          if (error || response.statusCode < 200 || response.statusCode >= 300) {
            reject(error);
          } else {
            _this.props = JSON.parse(body).data;
            resolve(body);
          }
        });
      });
    }
  }, {
    key: 'save',
    value: function save() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {

        _request2.default.post({
          url: process.env.API_BASE + _this2.url,
          json: true,
          headers: {
            'Content-Type': 'application/json'
          },
          formData: _this2.props
        }, function (err, response, body) {
          console.log('err', err);
          console.log('response', response);
          console.log('body', body);
          if (error || response.statusCode < 200 || response.statusCode >= 300) {
            reject(error);
          } else {
            // this.props = JSON.parse(body).data;
            resolve(body);
          }
        });
      });
    }
  }]);

  return Model;
}();

exports.default = Model;