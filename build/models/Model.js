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

    this.props = props;
  }

  _createClass(Model, [{
    key: 'get',
    value: function get(key) {
      return this.props[key];
    }
  }, {
    key: 'save',
    value: function save() {
      var _this = this;

      return new Promise(function (resolve, reject) {

        _request2.default.post({
          url: process.env.API_BASE + _this.url,
          json: true,
          headers: {
            'Content-Type': 'application/json'
          },
          formData: _this.props
        }).on('response', function (response) {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(response);
          } else {
            reject(response);
          }
        }).on('error', function (error) {
          reject(error);
        });
      });
    }
  }]);

  return Model;
}();

exports.default = Model;