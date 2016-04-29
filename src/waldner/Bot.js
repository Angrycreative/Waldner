import SlackBot from 'slackbots';

export default class Bot {

  constructor( name, token ) {
    this.name = name;
    this.slackBot = new SlackBot({ name, token});

    // Stores patterns, keywords and their respective callbacks
    this.vocabulary = [];
  }

  init() {
    this.slackBot.on( 'start', this.onStart.bind(this) ) ;
    this.slackBot.on( 'message', this.onMessage.bind(this) );
  }

  onStart() {
  
  }

  onMessage( message ) {

    if (!message || !message.text || message.subtype === 'bot_message') {
      return; 
    }

    if ( message.channel[0] === 'C') {  // in channel
      // If in channel, we must prefix command with bot name
      if ( message.text.toLowerCase().indexOf( this.name.toLowerCase() ) !== 0 ) {
        return; 
      }
    }

    for ( let command of this.vocabulary ) {

      if ( command.type = 'regexp' ) {
        let match = message.text.match( command.pattern );
        if ( match ) {

          if (match.length > 1) {
            // Remove first element, which matches the entire string
            match.shift();
          }
          command.callback( message, ...match );
        }
      }

    }
  
  }

  hears( pattern, callback ) {

    let type = 'regexp';

    this.vocabulary.push({
      type,
      pattern,
      callback
    });

  }

  respond( message, text, mood ) {
    let receiver = this.getUserName( message.user );

    // Channels are prefixed with 'C', users with 'U' and direct message with 'D'
    console.log(message.channel);
    if ( message.channel[0] === 'C') {
      receiver = this.getChannelName( message.channel );
    }

    console.log('Mood', mood);

    mood = mood || 'normal';
    let moodIcons = {
      'normal': 'http://api.angryladder.elmered.com/assets/images/serve.png',
      'happy': 'http://api.angryladder.elmered.com/assets/images/happy.png',
      'medal': 'http://api.angryladder.elmered.com/assets/images/medal.png'
    }

    let params = {
      icon_url: moodIcons[ mood ]
      // icon_url: 'http://www.jorgenpersson.nu/wp-content/uploads/2015/02/legenden-jo-waldner.jpg'
    }

    this.slackBot.postTo( receiver, text, params );
  }

  getChannelName( slackId ) {
    for ( let channel of this.slackBot.channels ) {
      if ( channel.id === slackId ) {
        return channel.name; 
      }
    }
    return null;
  }

  getUserName( slackId ) {
    let user = this.getUser( slackId );
    return user ? user.name : null;
  }

  getUser( slackId ) {
    for ( let user of this.slackBot.users ) {
      if ( user.id === slackId ) {
        return user; 
      }
    }
    return null;
  }

}
