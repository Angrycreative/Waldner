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
      let winner = game.get('winner');

      if (!players || players.length < 2) {
        continue;
      }


      let p1 = players[0].name;
      let p2 = players[1].name;

      if (String(winner) === "1") {
        p1 = `(${p1})`;
      } else {
        p2 = `(${p2})`;
      }

      playerNames.push( p1 + ' vs ' + p2);

      scores.push( sets.map( (set) => {
        return set.scores[0] + '-' + set.scores[1];
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
      return p + '  ' + scores[idx];
    }).join('\n');

  }
}
