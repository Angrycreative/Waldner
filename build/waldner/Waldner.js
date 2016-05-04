'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bot = require('./Bot.js');

var _Bot2 = _interopRequireDefault(_Bot);

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
    this.bot = new _Bot2.default(name, token);
  }

  _createClass(Waldner, [{
    key: 'run',
    value: function run() {
      console.log('Waldner iz alive!');
      this.setupListeners();
      this.bot.init();
    }
  }, {
    key: 'setupListeners',
    value: function setupListeners() {
      var _this = this;

      // Rank player, with player id optional
      this.bot.hears(/rank(\ \<\@(\S+)\>)?(\ all\ time)?/i, function (message, userPresent, userId, allTime) {

        userId = userId || message.user;
        _this.getRankForUser(userId, function (responseString) {
          _this.bot.respond(message, responseString, 'medal');
        }, allTime);
      });

      // Responds with the ladder
      this.bot.hears(/ladder(\ all\ time)?/i, function (message, allTime) {
        _this.getLadder(function (responseString) {
          _this.bot.respond(message, responseString, 'medal');
        }, allTime);
      });

      // List games
      this.bot.hears(/games(\ \<\@(\S*)\>)?/i, function (message, userPresent, userId) {
        // TODO: Handle player games
        var games = new _GameStore2.default();
        games.fetch().then(function () {
          _this.bot.respond(message, 'Senaste matcherna :table_tennis_paddle_and_ball:\n' + games.prettyPrint(), 'happy');
        }).catch(function () {
          _this.bot.respond(message, 'Kunde inte hämta matcher :cry:');
        });
      });

      this.bot.hears(/stats(\ \<\@(\S*)\>)?/i, function (message, userPresent, userId) {
        userId = userId || message.user;
        _this.getUser(userId, function (user) {
          _this.bot.respond(message, user.printStats());
        }, function (error) {
          _this.bot.respond(message, error);
        });
      });

      // Save a game
      this.bot.hears(/\<\@(\S*)\>\ \<\@(\S*)\>\ (\d+[\ |-]\d+.*)/i, function (message, firstUserId, secondUserId, sets) {
        sets = sets.replace(',', ' ').replace('  ', ' ').split(' ');

        var firstUser = new _User2.default(_this.bot.getUser(firstUserId));
        var secondUser = new _User2.default(_this.bot.getUser(secondUserId));

        console.log(firstUser);

        var scores = sets.map(function (set) {
          var s1 = set.split('-')[0];
          var s2 = set.split('-')[1];
          return { set: [s1, s2] };
        });

        new _Game2.default({
          players: [firstUser.getPropsForGame(), secondUser.getPropsForGame()],
          sets: scores
        }).save().then(function () {
          _this.bot.respond(message, ':table_tennis_paddle_and_ball: Matchen sparades! :table_tennis_paddle_and_ball:', 'happy');
        }).catch(function () {
          _this.bot.respond(message, 'Kunde inte spara matchen :crying_cat_face:');
        });
      });

      this.bot.hears(/help/i, function (message) {
        _this.bot.respond(message, 'Hahahahahahaaaaaa.. Fuck off');
      });

      this.bot.hears(/^waldner$/i, function (message) {
        var quotes = ['Vet du vad det sjukaste är?\nNär jag möter folk på gatan säger fem av tio fortfarande Kungen.', 'Medaljerna tänkte jag skicka till ett museum i Köping, men de fick inte plats så nu ligger de i påsar.', 'Jag var tvungen att sätta ett bunkerslag på 25 meter och "Tickan" sa till mig: "Sätter du det här slaget har du fri dricka i resten av ditt liv".\nJa, ja sa jag, pang mot flaggan och rakt i', 'Går jag in i en taxi i Kina säger chauffören: "Tja Lao Wa! Läget?".\nJag är halvkines och på slutet fick jag lika mycket stöd som den kines jag mötte.', 'Alla kineser jag möter och alla som är med dem, ska ta kort innan matcherna. För dem är det lika viktigt som att spela, och det är rätt häftigt. De vill ha något att visa upp i Kina.', 'Jag tycker att det är bättre ljus här i hallen, än när det är dåligt ljus.'];
        var rand = Math.floor(Math.random() * quotes.length);
        _this.bot.respond(message, quotes[rand], 'happy');
      });
    }
  }, {
    key: 'getLadder',
    value: function getLadder(callback, allTime) {

      console.log('ALL TIME', allTime);

      var topPlayers = new _Store2.default();
      topPlayers.fetch('players/top?include=stats').then(function () {
        var str = ':trophy: Veckans topplista :trophy:\n```';
        if (allTime) {
          str = ':trophy: Maratonlista :trophy:\n```';
        }
        for (var i = 0; i < topPlayers.models.length; i++) {
          var p = topPlayers.models[i];
          var rating = p.get('ratings').weekly;
          var wins = p.get('stats').wins;
          var losses = p.get('stats').loses;
          if (allTime) {
            rating = p.get('ratings').all_time;
          }
          str += i + 1 + '. ' + p.get('name') + ' (' + rating + '): ' + wins + '-' + losses + '\n';
        }
        str += '```';
        callback(str);
      }).catch(function (err) {
        console.log('Could not fetch ladder', err);
        callback('Kunde inte hämta topplistan :tired_face:');
      });
    }
  }, {
    key: 'getRankForUser',
    value: function getRankForUser(userId, callback, allTime) {
      var user = new _User2.default({ id: userId });

      console.log('user id', userId);
      user.fetch(process.env.API_BASE + 'players/' + userId + '?include=stats').then(function (data) {
        var ratings = user.get('ratings');
        var ladderscore = ratings.weekly;
        var ranks = user.get('rank');
        var rank = ranks.weekly;
        if (allTime) {
          ladderscore = ratings.all_time;
          rank = ranks.all_time;
        }

        var emoji = '';
        if (rank == 1) {
          emoji = ':party::sports_medal::trophy:';
        }

        callback('@' + user.get('slack_name') + ' har ladder score ' + ladderscore + ' och ligger på plats ' + rank + ' ' + emoji);
      }).catch(function (error) {
        callback('Kunde inte hämta spelare :cry: ' + error);
      });
    }
  }, {
    key: 'getUser',
    value: function getUser(userId, successCallback, errorCallback) {
      var user = new _User2.default({ id: userId });
      console.log('uid', userId);
      user.fetch(process.env.API_BASE + 'players/' + userId + '?include=stats').then(function (data) {
        successCallback(user);
      }).catch(function (error) {
        errorCallback('Kunde inte hämta spelare ' + error);
      });
    }
  }]);

  return Waldner;
}();

exports.default = Waldner;