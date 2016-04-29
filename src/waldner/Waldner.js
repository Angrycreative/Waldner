import Bot from './Bot.js';
import Store from '../stores/Store.js';
import UserStore from '../stores/UserStore.js';
import ChannelStore from '../stores/ChannelStore.js';
import GameStore from '../stores/GameStore.js';
import Game from '../models/Game.js';
import User from '../models/User.js';

export default class Waldner {

  constructor( name, token, api ) {
    this.name = name;
    this.bot = new Bot( name, token );
  }

  run() {
    console.log('Waldner iz alive!'); 
    this.setupListeners();
    this.bot.init();
  }

  setupListeners() {

    // Rank player, with player id optional
    this.bot.hears( /rank(\ \<\@(\S+)\>)?/i, ( message, userPresent, userId ) => {

      userId = userId || message.user;
      this.getRankForUser( userId, responseString => {
        this.bot.respond( message, responseString );
      });

    });

    // Responds with the ladder
    this.bot.hears( /ladder/i, ( message ) => {
      this.getLadder( (responseString) => {
        this.bot.respond( message, responseString );
      });
    });

    // List games
    this.bot.hears( /games/i, ( message ) => {
      let games = new GameStore();
      games.fetch()
        .then( () => {
          this.bot.respond( message, 'Senaste matcherna :table_tennis_paddle_and_ball:\n'+games.prettyPrint() );
        })
        .catch( () => {
          this.bot.respond( message, 'Kunde inte hämta matcher :cry:' );
        })
    });

    // Save a game
    this.bot.hears( /\<\@(\S*)\>\ \<\@(\S*)\>\ (\d+[\ |-]\d+.*)/i, ( message, firstUserId, secondUserId, sets) => {
      sets = sets.replace(',', ' ').replace('  ', ' ').split(' ');

      let firstUser = new User( this.bot.getUser( firstUserId ) );
      let secondUser = new User( this.bot.getUser( secondUserId ) );

      console.log(firstUser);

      let scores = sets.map( (set) => {
        let s1 = set.split('-')[0];
        let s2 = set.split('-')[1];
        return { set: [ s1, s2 ]};
      });

      new Game({
        players: [
          firstUser.getPropsForGame(),
          secondUser.getPropsForGame()
        ],
        sets: scores
      }).save()
      .then(() => {
        this.bot.respond( message, ':table_tennis_paddle_and_ball: Matchen sparades! :table_tennis_paddle_and_ball:');
      })
      .catch(() => {
        this.bot.respond( message, 'Kunde inte spara matchen :crying_cat_face:');
      });

    });

    this.bot.hears(/help/i, (message) => {
      this.bot.respond( message, 'Hahahahahahaaaaaa.. Fuck off');
    });

    this.bot.hears(/^waldner$/i, (message) => {
      let quotes = [
        'Vet du vad det sjukaste är?\nNär jag möter folk på gatan säger fem av tio fortfarande Kungen.',
        'Medaljerna tänkte jag skicka till ett museum i Köping, men de fick inte plats så nu ligger de i påsar.',
        'Jag var tvungen att sätta ett bunkerslag på 25 meter och "Tickan" sa till mig: "Sätter du det här slaget har du fri dricka i resten av ditt liv".\nJa, ja sa jag, pang mot flaggan och rakt i',
        'Går jag in i en taxi i Kina säger chauffören: "Tja Lao Wa! Läget?".\nJag är halvkines och på slutet fick jag lika mycket stöd som den kines jag mötte.',
        'Alla kineser jag möter och alla som är med dem, ska ta kort innan matcherna. För dem är det lika viktigt som att spela, och det är rätt häftigt. De vill ha något att visa upp i Kina.',
        'Jag tycker att det är bättre ljus här i hallen, än när det är dåligt ljus.'
      ];
      let rand = Math.floor(Math.random() * quotes.length );
      this.bot.respond( message, quotes[ rand ] );
    });

  }

  getLadder( callback ) {

    let topPlayers = new Store();
    topPlayers.fetch('players/top')
      .then( () => {
        let str = ':trophy: Topplista :trophy:\n```';
        for (let i = 0; i < topPlayers.models.length; i++) {
          let p = topPlayers.models[i];
          let rating = p.get('ratings').all_time;
          str += `${i+1}. ${p.get('name')} (${rating})\n`;
        }
        str += '```';
        callback( str );
      })
      .catch( (err) => {
        console.log('Could not fetch ladder', err);
        callback( 'Kunde inte hämta topplistan :tired_face:' );
      })
  }

  getRankForUser( userId, callback ) {
    let user = new User({id: userId});

    console.log('user id', userId);
    user.fetch( process.env.API_BASE + 'players/' + userId )
      .then( ( data ) => {
        let ratings = user.get('ratings');
        let ladderscore = ratings.all_time;
        let ranks = user.get('rank');
        let rank = ranks.all_time;
        callback( `@${user.get('slack_name')} har ladder score ${ladderscore} och ligger på plats ${rank}` );
      })
      .catch( (error) => {
        callback('Kunde inte hämta användare :cry: ' + error);
      });
  }


  // Check if message was posted in a channel or Direct Message
  respondTo( user, channel, message, params ) {
    params = params || {};
    if (!params.icon_user) {
      params.icon_url = 'http://www.jorgenpersson.nu/wp-content/uploads/2015/02/legenden-jo-waldner.jpg';
    }

    if ( channel ) {
      this.bot.postTo( channel.get('name'), message, params );
    } else if ( user ) {
      this.bot.postTo( user.get('name'), message, params );
    }
  }

}
