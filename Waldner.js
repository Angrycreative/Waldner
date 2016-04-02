import Bot from 'slackbots';
import util from 'util';
import http from 'http';
import request from 'request';

export class Waldner extends Bot {

  constructor( settings ) {
    super( settings );
    this.APIPath = settings.APIPath || 'http://api.angryladder.dev/v1/';
    console.log('Waldner iz alive!'); 
    console.log(this.APIPath);
  }

  run() {
    this.on('start', this.onStart);
    this.on('message', this.onMessage);
  }

  onStart() {
    this.getUsers()
      .then((data) => {
        this.parseUsers( data.members );
      });

    this.getChannels()
      .then( (data) => {
        this.parseChannels( data.channels ) 
      });
  }

  parseChannels( channels ) {
    this.channels = channels; 
  }

  parseUsers( members ) {
    this.members = members; 

  }

  getMemberById(id) {
    let user = null;
    if (this.members) {
      for (let i = 0; i < this.members.length; i++) {
        if (this.members[i].id === id) {
          user = this.members[i];
        }
      }
    }

    return user;
  }

  getChannelById( id ) {
    let channel = null;
    if (this.channels) {
      for (let i = 0; i < this.channels.length; i++) {
        if (this.channels[i].id === id) {
          channel = this.channels[i];
        }
      }
    }

    return channel;
  }

  parseMessage( message, user, channel ) {

    let receiverId = channel || user.id;
    let sendTo = this.getChannelById(receiverId) || this.getMemberById(receiverId);

    let commandValid = false;

    if (message.indexOf('ladder') > -1 ) {
      // this.sendLadder( channel || user.id );
      this.sendLadder( sendTo );
      commandValid = true;
    }

    if (message.indexOf('games') > -1) {
      this.sendLatestGames( sendTo );
      commandValid = true;
    }

    let result = message.match( /\<\@(\S*)\> \<\@(\S*)\>\ (\d*)\ (\d*)/ );
    if ( result ) {
      let player1 = result[1];
      let player2 = result[2];
      let score1 = result[3];
      let score2 = result[4];
      this.saveGame( sendTo, player1, player2, score1, score2 );
      commandValid = true;
    }

    if (!commandValid) {
      this.postTo( sendTo.name, this.getHelpString() );
    }

  }

  sendLatestGames( sendTo ) {
    request.get(this.APIPath + 'games', (error, response, body) => {
      if (response.statusCode === 200) {
        let json = JSON.parse(body);
        let str = 'Senaste matcherna';
        for (let i = 0; i < json.data.length; i++) {
          let game = json.data[i];
          str += '\n' + game.player1.name + ' vs ' + game.player2.name + ' : ' + game.score1 + '-' + game.score2;
        }
        this.postTo(sendTo.name, str);

      } else {
        this.postTo(sendTo.name, 'Serverfel :(');
      }
    });
  }

  sendLadder( sendTo ) {

    request.get( this.APIPath + 'players/top?limit=1000', (error, response, body) => {
      var json = JSON.parse( body );
      var users = json.data;
      var response = '';

      users.sort(function(a, b) { 
          return b.rating - a.rating;
      })
      for (let i = 0; i < users.length; i++) {
        var u = users[i];
        response += '\n' + (i+1) + '. ' + u.name + ' : ' + u.rating;
      }

      // this.postTo(receiver, response);
      this.postTo(sendTo.name, response);
    });
  }

  getHelpString() {
    return  'Jag kände inte igen kommandot. Testa någon av dessa:'+
            '\n"@waldner ladder" - visar ladder' +
            '\n"@waldner games" - visar senaste matcherna' +
            '\n"@waldner @user1 @user2 11 3" - Sparar en match som slutade 11 - 3';
  }

  saveGame( receiver, player1, player2, score1, score2 ) {

    if (score1 < 11 && score2 < 11) {
      this.postTo(receiver.name, 'För låga poäng, yo.');
      return;
    }
    if (score1 === score2) {
      this.postTo(receiver.name, 'Hallå! Det går inte att kryssa i pingpong!!!');
      return;
    }

    let game = {
      player1: '1',
      player2: '3',
      score1,
      score2,
    };

    request.post({
      url: this.APIPath + 'games',
      json:true,
      headers: {
        'Content-Type': 'application/json',
      },
      formData: game
    })
      .on('response', (response) => {
        if (response.statusCode === 200) {
          this.postTo(receiver.name, 'Matchen sparad!');
        } else {
          this.postTo(receiver.name, 'Serverfel :(');
        }
      })
      .on('error', (err) => {
        this.postTo(receiver.name, 'Feck. Något gick fel!', err.statusMessage);
      })
  }

  onMessage( message ) {
    if ( message.text && message.user ) {
      let user = this.getMemberById( message.user );
      let channel = message.channel[0] === 'C' ? message.channel : null;
      this.parseMessage( message.text, user, channel );
    }
  }

}
