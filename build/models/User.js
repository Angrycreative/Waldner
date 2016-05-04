'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Model2 = require('./Model.js');

var _Model3 = _interopRequireDefault(_Model2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var User = function (_Model) {
  _inherits(User, _Model);

  function User(props) {
    _classCallCheck(this, User);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(User).call(this, props));

    _this.url = 'users';
    return _this;
  }

  // Necessary props with format that server needs

  _createClass(User, [{
    key: 'getPropsForGame',
    value: function getPropsForGame() {
      return {
        // id: this.get('id'),
        name: this.get('real_name'),
        email: this.get('profile').email,
        slack_id: this.get('id'),
        slack_name: this.get('name'),
        avatar_url: this.get('profile').image_original
      };
    }
  }, {
    key: 'printStats',
    value: function printStats() {
      var str = 'Statistik för ' + this.get('name');
      str += '\n```';

      str += 'Ranking, veckan:  ' + this.get('rank').weekly + '\n';
      str += 'Ranking, maraton: ' + this.get('rank').all_time + '\n';
      str += 'Rating, veckan:   ' + this.get('ratings').weekly + '\n';
      str += 'Rating, totalt:   ' + this.get('ratings').all_time + '\n';
      str += 'Spelade matcher:  ' + this.get('stats').games_played + '\n';
      str += 'Vinster:          ' + this.get('stats').wins + '\n';
      str += 'Förluster:        ' + this.get('stats').loses + '\n';
      str += 'Vunna set:        ' + this.get('stats').set_wins + '\n';
      str += 'Förlorade set:    ' + this.get('stats').set_loses + '\n';
      str += 'Vunna poäng:      ' + this.get('stats').total_points + '\n';
      str += 'Förlorade poäng:  ' + this.get('stats').total_points_against + '\n';

      str += '```';
      return str;
    }
  }]);

  return User;
}(_Model3.default);

exports.default = User;