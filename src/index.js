import path from 'path';
import dotenv from 'dotenv';
import Waldner from './Waldner.js';

import http from 'http';

let env = process.env.NODE_ENV;
let envFile = '.env';
console.log('Starting on environment: ', env);

if ( env ) {
  envFile = envFile += '.' + process.env.NODE_ENV;
}

dotenv.config( {path: './' + envFile } );

const settings = {
  token: process.env.TOKEN,
  name: process.env.BOT_NAME,
  APIPath: process.env.API_BASE
}

const waldner = new Waldner( settings.name, settings.token );
waldner.run();


if ( env === 'heroku' ) {
  startServer();
}

function startServer() {
  var serverPort = process.env.PORT || 8000;
  console.log('Starting http server on port: ', process.env.PORT);

  http.createServer( (request, response) => {

    response.writeHead(200, {"Content-Type": "text/html"});
    response.end('<em>Waldner woke up...</em>');
  
  }).listen( serverPort )

}
