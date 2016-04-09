import path from 'path';
import dotenv from 'dotenv';
import Waldner from './Waldner.js';

let env = process.env.NODE_ENV;
let envFile = '.env';

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
