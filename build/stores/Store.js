'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _Model = require('../models/Model.js');

var _Model2 = _interopRequireDefault(_Model);

var _Http = require('../Http.js');

var _Http2 = _interopRequireDefault(_Http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
  function Store(data, ModelClass) {
    _classCallCheck(this, Store);

    this.ModelClass = ModelClass || _Model2.default;
    this.rawData = data;
    this.models = [];

    if (data) {
      this.parseData(data);
    }
  }

  // Fetch all models on current index endpoint

  _createClass(Store, [{
    key: 'fetch',
    value: function fetch(url) {
      var _this = this;

      return new Promise(function (resolve, reject) {

        url = url || _this.ModelClass.url;
        _Http2.default.get(process.env.API_BASE + url).then(function (data) {
          _this.parseData(JSON.parse(data).data);
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'parseData',
    value: function parseData(data) {
      if (!data) {
        return;
      }

      // Loop every instance and create new Model objects
      this.models = [];
      for (var i = 0; i < data.length; i++) {
        var model = new this.ModelClass();
        model.props = data[i];
        // If ID is found we want to set it to the core object
        model.id = model.props.id;
        this.models.push(model);
      }
    }

    // Fetch with 'where' query

  }, {
    key: 'where',
    value: function where(key, value) {
      for (var i = 0; i < this.models.length; i++) {
        if (this.models[i].props[key] === value) {
          return this.models[i];
        }
      }
      return null;
    }

    // Shorthand for fetching with where

  }, {
    key: 'getById',
    value: function getById(id) {
      return this.where('id', id);
    }
  }]);

  return Store;
}();

exports.default = Store;