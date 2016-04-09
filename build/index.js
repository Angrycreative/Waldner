'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _Waldner = require('./Waldner.js');

var _Waldner2 = _interopRequireDefault(_Waldner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = null;

env = _dotenv2.default.config();

var settings = {
  token: process.env.TOKEN,
  name: process.env.BOT_NAME,
  APIPath: process.env.API_BASE
};

var waldner = new _Waldner2.default(settings.name, settings.token);
waldner.run();