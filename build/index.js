'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _Waldner = require('./waldner/Waldner.js');

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

console.log('API Path', settings.APIPath);

var waldner = new _Waldner2.default(settings.name, settings.token);
// waldner.on('close', waldnerStopped);
waldner.run();

// Waldner stop. Restart waldner
// function waldnerStopped() {
//   console.log('Waldner disconnected');
//   let tries = 0;
//   let maxTries = 20;
//
//   let interval = setInterval( () => {
//     console.log('Trying to connect...');
//     waldner.run();
//     tries ++;
//     if (tries >= maxTries) {
//       console.log('Max tries reached. Quitting...');
//       process.exit()
//     }
//   }, 2000 );
//
//   waldner.once('start', () => {
//     clearInterval( interval );
//   });
// }

if (env === 'heroku') {
  console.log('Starting http server on port: ', process.env.PORT);
  startServer('127.0.0.1', process.env.PORT);
} else if (env === 'openshift') {
  startServer(process.env.OPENSHIFT_NODEJS_IP, process.env.OPENSHIFT_NODEJS_PORT);
}

function startServer(host, port) {
  console.log('Starting http server on port: ', port);
  _http2.default.createServer(function (request, response) {

    response.writeHead(200, { "Content-Type": "text/html" });
    response.end('<em>Waldner woke up...</em>');
  }).listen(port, host || '127.0.0.1');
}