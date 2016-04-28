'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Store2 = require('./Store.js');

var _Store3 = _interopRequireDefault(_Store2);

var _Game = require('../models/Game.js');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameStore = function (_Store) {
  _inherits(GameStore, _Store);

  function GameStore(data) {
    _classCallCheck(this, GameStore);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GameStore).call(this, data, _Game2.default));
  }

  _createClass(GameStore, [{
    key: 'prettyPrint',
    value: function prettyPrint() {
      var str = '```';

      var playerNames = [];
      var scores = [];

      for (var i = 0; i < this.models.length; i++) {
        var game = this.models[i];
        var players = game.get('players');
        var winner = game.get('winner');
        var sets = game.get('sets');

        if (!players || players.length < 2) {
          continue;
        }

        var p1 = players[0].name;
        var p2 = players[1].name;

        if (winner === 1) {
          p1 = '(' + p1 + ')';
        } else {
          p2 = '(' + p2 + ')';
        }

        playerNames.push(p1 + ' vs ' + p2);

        scores.push(sets.map(function (set) {
          return set.scores[0] + '-' + set.scores[1];
        }).join(', '));
      }

      str += this.combineLines(playerNames, scores);

      str += '```';
      return str;
    }
  }, {
    key: 'combineLines',
    value: function combineLines(playerNames, scores) {

      var maxLength = playerNames.reduce(function (prevVal, line) {
        return Math.max(prevVal, line.length);
      }, 0);

      return playerNames.map(function (players, idx) {
        var p = players;
        while (p.length < maxLength) {
          p += ' ';
        }
        return p + '  ' + scores[idx];
      }).join('\n');
    }
  }]);

  return GameStore;
}(_Store3.default);

exports.default = GameStore;