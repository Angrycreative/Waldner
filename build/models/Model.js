'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _Http = require('../Http.js');

var _Http2 = _interopRequireDefault(_Http);

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
    value: function fetch(url) {
      var _this = this;

      return new Promise(function (resolve, reject) {

        if (!_this.id) {
          reject('ID undefined');
        }

        url = url || process.env.API_BASE + _this.url + '/' + _this.id;

        _Http2.default.get(url).then(function (data) {
          _this.props = JSON.parse(data).data;
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'save',
    value: function save() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {

        console.log(process.env.API_BASE + _this2.url);
        console.log('props', _this2.props);

        _Http2.default.post(process.env.API_BASE + _this2.url, _this2.props).then(function (data) {
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }]);

  return Model;
}();

exports.default = Model;