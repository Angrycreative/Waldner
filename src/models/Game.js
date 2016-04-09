import Model from './Model.js';

export default class Game extends Model {

  constructor( props ) {
    super( props );
    this.url = 'games';
  }

}

Game.url = 'games';
