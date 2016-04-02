import path from 'path';
import dotenv from 'dotenv';
import {Waldner} from './Waldner.js';


const env = dotenv.config();

const settings = {
  token: process.env.TOKEN,
  name: process.env.BOT_NAME,
  APIPath: process.env.API_BASE
}
// const settings = {
//   token: 'xoxb-30988241137-f3S77ht3xHQ1n41V7yZ5CFho',
//   name: 'Waldner',
//   APIPath: 'http://api.angryladder.dev/v1/'
// };

const waldner = new Waldner(settings);
waldner.run();
