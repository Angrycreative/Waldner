'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slackbots = require('slackbots');

var _slackbots2 = _interopRequireDefault(_slackbots);

var _Model = require('./models/Model.js');

var _Model2 = _interopRequireDefault(_Model);

var _Store = require('./stores/Store.js');

var _Store2 = _interopRequireDefault(_Store);

var _UserStore = require('./stores/UserStore.js');

var _UserStore2 = _interopRequireDefault(_UserStore);

var _ChannelStore = require('./stores/ChannelStore.js');

var _ChannelStore2 = _interopRequireDefault(_ChannelStore);

var _GameStore = require('./stores/GameStore.js');

var _GameStore2 = _interopRequireDefault(_GameStore);

var _Game = require('./models/Game.js');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Waldner = function (_Bot) {
  _inherits(Waldner, _Bot);

  function Waldner(name, token, api) {
    _classCallCheck(this, Waldner);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Waldner).call(this, { name: name, token: token }));
  }

  _createClass(Waldner, [{
    key: 'run',
    value: function run() {
      console.log('Waldner iz alive!');

      this.on('start', this.onStart);
      this.on('message', this.onMessage);
    }
  }, {
    key: 'onStart',
    value: function onStart() {
      var _this2 = this;

      console.log('Waldner connected to Slack');

      this.getUsers().then(function (data) {
        _this2.userStore = new _UserStore2.default(data.members);
        _this2.me = _this2.userStore.where('name', _this2.name);
      }).catch(function (err) {
        console.log('Error fetching users', err);
      });

      this.getChannels().then(function (data) {
        _this2.channelStore = new _ChannelStore2.default(data.channels);
      }).catch(function (err) {
        console.log('Error fetching channels', err);
      });
    }
  }, {
    key: 'onMessage',
    value: function onMessage(message) {
      var _this3 = this;

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
          scores: scores
        };

        console.log('Saving game', gameProps);

        var game = new _Game2.default(gameProps);

        game.save().then(function (response) {
          _this3.respondTo(user, channel, 'Matchen sparades!');
        }).catch(function (error) {
          console.log('Saving game error ', error);
          _this3.respondTo(user, channel, 'Kunde inte spara matchen');
        });
      }

      // View user rank, or current player rank if omitting the  user-id parameter
      else if (text.indexOf('rank') === 0) {
          var results = text.match(/\<\@(\S*)\>/);
          var userId = user.id;
          if (results) {
            userId = results[0];
          }
          var u = new User({ id: userId });
          u.fetch();
          then(function () {}).catch(function () {});
        }

        // View ladder
        else if (text.indexOf('ladder') === 0) {
            (function () {
              var topPlayers = new _Store2.default();
              topPlayers.fetch('players/top').then(function () {
                var str = 'Topplista\n';
                for (var _i = 0; _i < topPlayers.models.length; _i++) {
                  var p = topPlayers.models[_i];
                  str += _i + 1 + '. ' + p.get('name') + ' - ' + p.get('rating') + '\n';
                }
                _this3.respondTo(user, channel, str);
              }).catch(function (err) {
                console.log('Could not fetch ladder', err);
                _this3.respondTo(user, channel, 'Kunde inte hämta topplistan :cry:');
              });
            })();
          }

          // View latest Games
          else if (text.indexOf('games') === 0) {
              (function () {
                var games = new _GameStore2.default();
                games.fetch().then(function () {
                  _this3.respondTo(user, channel, 'Senaste matcherna\n' + games.prettyPrint());
                }).catch(function () {
                  _this3.respondTo(user, channel, 'Kunde inte hämta matcher');
                });
              })();
            }
    }

    // Check if message was posted in a channel or Direct Message

  }, {
    key: 'respondTo',
    value: function respondTo(user, channel, message, params) {
      if (channel) {
        this.postTo(channel.get('name'), message, params);
      } else if (user) {
        this.postTo(user.get('name'), message, params);
      }
    }
  }]);

  return Waldner;
}(_slackbots2.default);

exports.default = Waldner;