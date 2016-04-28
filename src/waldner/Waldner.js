import Bot from 'slackbots';
import Store from '../stores/Store.js';
import UserStore from '../stores/UserStore.js';
import ChannelStore from '../stores/ChannelStore.js';
import GameStore from '../stores/GameStore.js';
import Game from '../models/Game.js';
import User from '../models/User.js';

export default class Waldner {

  constructor( name, token, api ) {
    this.name = name;
    this.bot = new Bot( {name, token });
  }

  run() {
    console.log('Waldner iz alive!'); 

    this.bot.on('start', this.onStart.bind(this));
    this.bot.on('message', this.onMessage.bind(this));
  }

  onStart() {
    console.log('Waldner connected to Slack'); 

    this.bot.getUsers()
      .then((data) => {
        this.userStore = new UserStore( data.members );
        this.me = this.userStore.where( 'name', this.name );
      }).catch( (err) => {console.log('Error fetching users', err)});

    this.bot.getChannels()
      .then( (data) => {
        this.channelStore = new ChannelStore( data.channels );
      }).catch( (err) => {console.log('Error fetching channels', err)});

  }

  onMessage( message ) {

    if (message.type !== 'message' || !message.text ) {
      return; 
    }

    // Commands should always start with waldner
    if (message.text.toLowerCase().indexOf( this.name.toLowerCase() ) === -1) {
      return; 
    }

    console.log('Received message: ', message);

    // Remove bot name from string
    let text = message.text.substring( this.name.length + 1 );

    let user = this.userStore.getById( message.user );
    let channel = this.channelStore.getById( message.channel );


    // Save Game
    
    // find string like "<@grod> <@grod> 11 2, 11 4"
    // Scores can be separated by whitespace or dash and number of sets can be inifinte
    let gameResults = text.match( /\<\@(\S*)\>\ \<\@(\S*)\>\ (\d+[\ |-]\d+.*)/ );
    if ( gameResults && gameResults.length === 4 ) {

      let player1 = this.userStore.getById( gameResults[1] );
      let player2 = this.userStore.getById( gameResults[2] );

      let scoreString = gameResults[3];
      let sets = scoreString.match( /(\d+[\ |-]\d+)/g );

      let scores = [];

      for (let i = 0; i < sets.length; i++) {
        // Split up a score string: '11 4' (or '11-4') becomes [11, 4]
        let s = sets[i].match( /(\d+)[\ |-](\d+)/ );
        if (!s || s.length < 3) { this.sendTo( user, channel, 'Felaktig formatering'); return; }
        scores.push({
          set: [ s[1], s[2] ]
        });
      }

      console.log('Saving game between ' + player1.get('name') + ' and ' + player2.get('name'));

      let gameProps = {
        players: [
          player1.getPropsForGame(),
          player2.getPropsForGame()
        ],
        sets: scores
      };

      console.log('Saving game', gameProps);

      let game = new Game( gameProps );
      
      game.save()
      .then(( response ) => {
        console.log('response', response);
        this.respondTo( user, channel, ':table_tennis_paddle_and_ball: Matchen sparades! :table_tennis_paddle_and_ball:');
      }).catch( (error) => {
        console.log('Saving game error ', error);
        this.respondTo( user, channel, 'Kunde inte spara matchen :crying_cat_face:');
      });
    }

    // View user rank, or current player rank if omitting the  user-id parameter
    else if ( text.indexOf('rank') === 0 ) {
      let results = text.match(/\<\@(\S*)\>/);
      let userId = user.id;
      let weekly = text.indexOf('all time') > -1 ? false : true;
      if (results) {
        userId = results[1];
      }

      console.log('get user id', userId);

      let u = this.userStore.where('id', userId);
      let APIUser = new User({id: u.get('name')});

      APIUser.fetch( process.env.API_BASE + 'players/' + u.get('name') )
        .then( ( data ) => {
          let ratings = APIUser.get('ratings');
          let ladderscore = ratings.weekly;
          let ranks = APIUser.get('rank');
          let rank = ranks.weekly;
          if (!weekly) {
            ladderscore = ratings.all_time; 
            rank = rank.all_time;
          }
          this.respondTo( user, channel, `@${APIUser.get('slack_name')} har ladder score ${ladderscore} och ligger på plats ${rank}`);
        })
        .catch( (error) => {
          console.log('Get user error: ', error);
        });
    }

    // View ladder
    else if (text.indexOf('ladder') === 0) {
      let weekly = text.indexOf('all time') > -1 ? false : true;
      let topPlayers = new Store();
      
      topPlayers.fetch('players/top')
        .then( () => {
          let str = ':trophy: Topplista :trophy:\n```';
          for (let i = 0; i < topPlayers.models.length; i++) {
            let p = topPlayers.models[i];
            let rating = weekly ? p.get('ratings').weekly : p.get('ratings').all_time;
            str += `${i+1}. ${p.get('name')} (${rating})\n`;
          }
          str += '```';
          this.respondTo( user, channel, str);
        })
        .catch( (err) => {
          console.log('Could not fetch ladder', err);
          this.respondTo( user, channel, 'Kunde inte hämta topplistan :tired_face:');
        })
    }

    // View latest Games
    else if ( text.indexOf('games') === 0 ) {
      let games = new GameStore();
      games.fetch().then( () => {
        this.respondTo( user, channel, 'Senaste matcherna :table_tennis_paddle_and_ball:\n'+games.prettyPrint() );
      }).catch((err) => {
        console.log(err);
        this.respondTo( user, channel, 'Kunde inte hämta matcher :cry:' );
      });
    }

    // No message
    else {
      let quotes = [
        'Vet du vad det sjukaste är?\nNär jag möter folk på gatan säger fem av tio fortfarande Kungen.',
        'Medaljerna tänkte jag skicka till ett museum i Köping, men de fick inte plats så nu ligger de i påsar.',
        'Jag var tvungen att sätta ett bunkerslag på 25 meter och "Tickan" sa till mig: "Sätter du det här slaget har du fri dricka i resten av ditt liv".\nJa, ja sa jag, pang mot flaggan och rakt i',
        'Går jag in i en taxi i Kina säger chauffören: "Tja Lao Wa! Läget?".\nJag är halvkines och på slutet fick jag lika mycket stöd som den kines jag mötte.',
        'Alla kineser jag möter och alla som är med dem, ska ta kort innan matcherna. För dem är det lika viktigt som att spela, och det är rätt häftigt. De vill ha något att visa upp i Kina.',
        'Jag tycker att det är bättre ljus här i hallen, än när det är dåligt ljus.'
      ];
      let rand = Math.floor(Math.random() * quotes.length );
      this.respondTo( user, channel, quotes[ rand ] );
    }
  
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
