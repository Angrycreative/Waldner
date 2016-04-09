'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _Waldner = require('./Waldner.js');

var _Waldner2 = _interopRequireDefault(_Waldner);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV;
var envFile = '.env';
console.log('Starting on environment: ', env);

if (env) {
  envFile = envFile += '.' + process.env.NODE_ENV;
}

_dotenv2.default.config({ path: './' + envFile });

var settings = {
  token: process.env.TOKEN,
  name: process.env.BOT_NAME,
  APIPath: process.env.API_BASE
};

var waldner = new _Waldner2.default(settings.name, settings.token);
waldner.run();

if (env === 'heroku') {
  startServer('127.0.0.1', process.env.PORT);
} else if (env === 'openshift') {
  startServer(process.env.OPENSHIFT_NODEJS_IP, process.env.OPENSHIFT_NODEJS_IP);
}

function startServer(host, port) {
  // var serverPort = process.env.PORT || 8000;
  console.log('Starting http server on port: ', port);

  _http2.default.createServer(function (request, response) {

    response.writeHead(200, { "Content-Type": "text/html" });
    response.end('<em>Waldner woke up...</em>');
  }).listen(port, host || '127.0.0.1');
}