import Bot from 'slackbots';
import Model from './models/Model.js';
import Store from './stores/Store.js';
import UserStore from './stores/UserStore.js';
import ChannelStore from './stores/ChannelStore.js';
import GameStore from './stores/GameStore.js';
import Game from './models/Game.js';

export default class Waldner extends Bot {

  constructor( name, token, api ) {
    super( {name, token} );
  }

  run() {
    console.log('Waldner iz alive!'); 

    this.on('start', this.onStart);
    this.on('message', this.onMessage);
  }

  onStart() {

    this.getUsers()
      .then((data) => {
        this.userStore = new UserStore( data.members );
        this.me = this.userStore.where( 'name', this.name );
      });

    this.getChannels()
      .then( (data) => {
        this.channelStore = new ChannelStore( data.channels );
      });

  }

  onMessage( message ) {

    if (message.type !== 'message') {
      return; 
    }

    let text = message.text;
    let user = this.userStore.getById( message.user );
    let channel = this.channelStore.getById( message.channel );


    // Save Game
    
    // find string like "<@grod> <@grod> 11 2, 11 4"
    // Scores can be separated by whitespace or dash and number of sets can be inifinte
    let gameResults = text.match( /\<\@(\S*)\>\ \<\@(\S*)\>\ (\d+[\ |-]\d+.*)/ );
    if ( gameResults.length === 4 ) {

      let player1 = this.userStore.getById( gameResults[1] );
      let player2 = this.userStore.getById( gameResults[2] );

      let scoreString = gameResults[3];
      let sets = scoreString.match( /(\d+[\ |-]\d+)/g );

      let scores = [];

      for (let i = 0; i < sets.length; i++) {
        // Split up a score string: '11 4' (or '11-4') becomes [11, 4]
        let s = sets[i].match( /(\d+)[\ |-](\d+)/ );
        if (s.length < 3) { this.sendTo( user, channel, 'Felaktig formatering'); return; }
        scores.push({
          set: [ s[1], s[2] ]
        });
      }

      let gameProps = {
        players: [
          player1.getPropsForGame(),
          player2.getPropsForGame()
        ],
        scores: scores
      };

      let game = new Game( gameProps );
      
      game.save()
      .then(( response ) => {
        this.respondTo( user, channel, 'Matchen sparades!');
      }).catch( (error) => {
        this.respondTo( user, channel, 'Kunde inte spara matchen');
      });

    }

    // View ladder
    if (text.indexOf('ladder') === 0) {
      let topPlayers = new Store();
      topPlayers.fetch('players/top')
        .then( () => {
          let str = 'Topplista\n';
          for (let i = 0; i < topPlayers.models.length; i++) {
            var p = topPlayers.models[i];
            str += `${i+1}. ${p.get('name')} - ${p.get('rating')}\n`;
          }
          this.respondTo( user, channel, str);
        })
        .catch( () => {
          this.respondTo( user, channel, 'Kunde inte hämta topplistan');
        })
    }

    // View latest Games
    if ( text.indexOf('games') === 0 ) {
      let games = new GameStore();
      games.fetch().then( () => {
        this.respondTo( user, channel, games.prettyPrint() );
      }).catch(() => {
        this.respondTo( user, channel, 'Kunde inte hämta matcher' );
      });
    }
  
  }

  // Check if message was posted in a channel or Direct Message
  respondTo( user, channel, message ) {
    if ( channel ) {
      this.postTo( channel.get('name'), message );
    } else if ( user ) {
      this.postTo( user.get('name'), message );
    }
  }

}
