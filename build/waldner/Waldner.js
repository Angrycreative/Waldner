'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slackbots = require('slackbots');

var _slackbots2 = _interopRequireDefault(_slackbots);

var _Store = require('../stores/Store.js');

var _Store2 = _interopRequireDefault(_Store);

var _UserStore = require('../stores/UserStore.js');

var _UserStore2 = _interopRequireDefault(_UserStore);

var _ChannelStore = require('../stores/ChannelStore.js');

var _ChannelStore2 = _interopRequireDefault(_ChannelStore);

var _GameStore = require('../stores/GameStore.js');

var _GameStore2 = _interopRequireDefault(_GameStore);

var _Game = require('../models/Game.js');

var _Game2 = _interopRequireDefault(_Game);

var _User = require('../models/User.js');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Waldner = function () {
  function Waldner(name, token, api) {
    _classCallCheck(this, Waldner);

    this.name = name;
    this.bot = new _slackbots2.default({ name: name, token: token });
  }

  _createClass(Waldner, [{
    key: 'run',
    value: function run() {
      console.log('Waldner iz alive!');

      this.bot.on('start', this.onStart.bind(this));
      this.bot.on('message', this.onMessage.bind(this));
    }
  }, {
    key: 'onStart',
    value: function onStart() {
      var _this = this;

      console.log('Waldner connected to Slack');

      this.bot.getUsers().then(function (data) {
        _this.userStore = new _UserStore2.default(data.members);
        _this.me = _this.userStore.where('name', _this.name);
      }).catch(function (err) {
        console.log('Error fetching users', err);
      });

      this.bot.getChannels().then(function (data) {
        _this.channelStore = new _ChannelStore2.default(data.channels);
      }).catch(function (err) {
        console.log('Error fetching channels', err);
      });
    }
  }, {
    key: 'onMessage',
    value: function onMessage(message) {
      var _this2 = this;

      if (message.type !== 'message' || !message.text) {
        return;
      }

      // Commands should always start with waldner
      if (message.text.toLowerCase().indexOf(this.name.toLowerCase()) === -1) {
        return;
      }

      console.log('Received message: ', message);

      // Remove bot name from string
      var text = message.text.substring(this.name.length + 1);

      var user = this.userStore.getById(message.user);
      var channel = this.channelStore.getById(message.channel);

      // Save Game

      // find string like "<@grod> <@grod> 11 2, 11 4"
      // Scores can be separated by whitespace or dash and number of sets can be inifinte
      var gameResults = text.match(/\<\@(\S*)\>\ \<\@(\S*)\>\ (\d+[\ |-]\d+.*)/);
      if (gameResults && gameResults.length === 4) {

        var player1 = this.userStore.getById(gameResults[1]);
        var player2 = this.userStore.getById(gameResults[2]);

        var scoreString = gameResults[3];
        var sets = scoreString.match(/(\d+[\ |-]\d+)/g);

        var scores = [];

        for (var i = 0; i < sets.length; i++) {
          // Split up a score string: '11 4' (or '11-4') becomes [11, 4]
          var s = sets[i].match(/(\d+)[\ |-](\d+)/);
          if (!s || s.length < 3) {
            this.sendTo(user, channel, 'Felaktig formatering');return;
          }
          scores.push({
            set: [s[1], s[2]]
          });
        }

        console.log('Saving game between ' + player1.get('name') + ' and ' + player2.get('name'));

        var gameProps = {
          players: [player1.getPropsForGame(), player2.getPropsForGame()],
          sets: scores
        };

        console.log('Saving game', gameProps);

        var game = new _Game2.default(gameProps);

        game.save().then(function (response) {
          console.log('response', response);
          _this2.respondTo(user, channel, ':table_tennis_paddle_and_ball: Matchen sparades! :table_tennis_paddle_and_ball:');
        }).catch(function (error) {
          console.log('Saving game error ', error);
          _this2.respondTo(user, channel, 'Kunde inte spara matchen :crying_cat_face:');
        });
      }

      // View user rank, or current player rank if omitting the  user-id parameter
      else if (text.indexOf('rank') === 0) {
          (function () {
            var results = text.match(/\<\@(\S*)\>/);
            var userId = user.id;
            var weekly = text.indexOf('all time') > -1 ? false : true;
            if (results) {
              userId = results[1];
            }

            console.log('get user id', userId);

            var u = _this2.userStore.where('id', userId);
            var APIUser = new _User2.default({ id: u.get('name') });

            APIUser.fetch(process.env.API_BASE + 'players/' + u.get('name')).then(function (data) {
              var ratings = APIUser.get('ratings');
              var ladderscore = ratings.weekly;
              var ranks = APIUser.get('rank');
              var rank = ranks.weekly;
              if (!weekly) {
                ladderscore = ratings.all_time;
                rank = rank.all_time;
              }
              _this2.respondTo(user, channel, '@' + APIUser.get('slack_name') + ' har ladder score ' + ladderscore + ' och ligger på plats ' + rank);
            }).catch(function (error) {
              console.log('Get user error: ', error);
            });
          })();
        }

        // View ladder
        else if (text.indexOf('ladder') === 0) {
            (function () {
              var weekly = text.indexOf('all time') > -1 ? false : true;
              var topPlayers = new _Store2.default();

              topPlayers.fetch('players/top').then(function () {
                var str = ':trophy: Topplista :trophy:\n```';
                for (var _i = 0; _i < topPlayers.models.length; _i++) {
                  var p = topPlayers.models[_i];
                  var rating = weekly ? p.get('ratings').weekly : p.get('ratings').all_time;
                  str += _i + 1 + '. ' + p.get('name') + ' (' + rating + ')\n';
                }
                str += '```';
                _this2.respondTo(user, channel, str);
              }).catch(function (err) {
                console.log('Could not fetch ladder', err);
                _this2.respondTo(user, channel, 'Kunde inte hämta topplistan :tired_face:');
              });
            })();
          }

          // View latest Games
          else if (text.indexOf('games') === 0) {
              (function () {
                var games = new _GameStore2.default();
                games.fetch().then(function () {
                  _this2.respondTo(user, channel, 'Senaste matcherna :table_tennis_paddle_and_ball:\n' + games.prettyPrint());
                }).catch(function (err) {
                  console.log(err);
                  _this2.respondTo(user, channel, 'Kunde inte hämta matcher :cry:');
                });
              })();
            }

            // No message
            else {
                var quotes = ['Vet du vad det sjukaste är?\nNär jag möter folk på gatan säger fem av tio fortfarande Kungen.', 'Medaljerna tänkte jag skicka till ett museum i Köping, men de fick inte plats så nu ligger de i påsar.', 'Jag var tvungen att sätta ett bunkerslag på 25 meter och "Tickan" sa till mig: "Sätter du det här slaget har du fri dricka i resten av ditt liv".\nJa, ja sa jag, pang mot flaggan och rakt i', 'Går jag in i en taxi i Kina säger chauffören: "Tja Lao Wa! Läget?".\nJag är halvkines och på slutet fick jag lika mycket stöd som den kines jag mötte.', 'Alla kineser jag möter och alla som är med dem, ska ta kort innan matcherna. För dem är det lika viktigt som att spela, och det är rätt häftigt. De vill ha något att visa upp i Kina.', 'Jag tycker att det är bättre ljus här i hallen, än när det är dåligt ljus.'];
                var rand = Math.floor(Math.random() * quotes.length);
                this.respondTo(user, channel, quotes[rand]);
              }
    }

    // Check if message was posted in a channel or Direct Message

  }, {
    key: 'respondTo',
    value: function respondTo(user, channel, message, params) {
      params = params || {};
      if (!params.icon_user) {
        params.icon_url = 'http://www.jorgenpersson.nu/wp-content/uploads/2015/02/legenden-jo-waldner.jpg';
      }

      if (channel) {
        this.bot.postTo(channel.get('name'), message, params);
      } else if (user) {
        this.bot.postTo(user.get('name'), message, params);
      }
    }
  }]);

  return Waldner;
}();

exports.default = Waldner;