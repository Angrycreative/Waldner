'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Store2 = require('./Store.js');

var _Store3 = _interopRequireDefault(_Store2);

var _Channel = require('../models/Channel.js');

var _Channel2 = _interopRequireDefault(_Channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChannelStore = function (_Store) {
  _inherits(ChannelStore, _Store);

  function ChannelStore(data) {
    _classCallCheck(this, ChannelStore);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ChannelStore).call(this, data, _Channel2.default));
  }

  return ChannelStore;
}(_Store3.default);

exports.default = ChannelStore;