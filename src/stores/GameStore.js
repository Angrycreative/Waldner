import Store from './Store.js';
import Game from '../models/Game.js';

export default class GameStore extends Store {
  constructor( data ) {
    super( data, Game );
  }

  prettyPrint() {
    let str = '```';

    let playerNames = [];
    let scores = [];

    for (let i = 0; i < this.models.length; i++) {
      let game = this.models[i];
      let players = game.get('players');
      let sets = game.get('sets');
      let p1 = players[0].name;
      let p2 = players[1].name;

      playerNames.push( p1 + ' vs ' + p2);

      scores.push( sets.map( (set) => {
        return set.score1 + '-' + set.score2;
      }).join(', ') );
    }

    str += this.combineLines( playerNames, scores );

    str += '```';
    return str;
  }

  combineLines( playerNames, scores ) {

    const maxLength = playerNames.reduce( (prevVal, line) => {
      return Math.max( prevVal, line.length );
    }, 0);

    return playerNames.map( (players, idx) => {
      let p = players;  
      while (p.length < maxLength) {
        p += ' ';
      }
      return p + ' ' + scores[idx];
    }).join('\n');

  }
}
