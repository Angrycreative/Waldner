import Store from './Store.js';
import Game from '../models/Game.js';

export default class GameStore extends Store {
  constructor( data ) {
    super( data, Game );
  }

  prettyPrint() {
    let str = '';
    for (let i = 0; i < this.models.length; i++) {
      var game = this.models[i];
      let p1 = game.get('player1').name;
      let p2 = game.get('player2').name;
      let s1 = game.get('score1');
      let s2 = game.get('score2');
      str += `${p1} vs ${p2} : ${s1}-${s2}\n`;
    }
    return str;
  }
}
