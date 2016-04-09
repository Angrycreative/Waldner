import path from 'path';
import dotenv from 'dotenv';
import Waldner from './Waldner.js';

let env = null;

env = dotenv.config();

const settings = {
  token: process.env.TOKEN,
  name: process.env.BOT_NAME,
  APIPath: process.env.API_BASE
}

const waldner = new Waldner( settings.name, settings.token );
waldner.run();
