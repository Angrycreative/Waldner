'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slackbots = require('slackbots');

var _slackbots2 = _interopRequireDefault(_slackbots);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bot = function () {
  function Bot(name, token) {
    _classCallCheck(this, Bot);

    this.name = name;
    this.slackBot = new _slackbots2.default({ name: name, token: token });

    // Stores patterns, keywords and their respective callbacks
    this.vocabulary = [];
  }

  _createClass(Bot, [{
    key: 'init',
    value: function init() {
      this.slackBot.on('start', this.onStart.bind(this));
      this.slackBot.on('message', this.onMessage.bind(this));
    }
  }, {
    key: 'onStart',
    value: function onStart() {}
  }, {
    key: 'onMessage',
    value: function onMessage(message) {

      if (!message || !message.text || message.subtype === 'bot_message') {
        return;
      }

      if (message.channel[0] === 'C') {
        // in channel
        // If in channel, we must prefix command with bot name
        if (message.text.toLowerCase().indexOf(this.name.toLowerCase()) !== 0) {
          return;
        }
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.vocabulary[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var command = _step.value;


          if (command.type = 'regexp') {
            var match = message.text.match(command.pattern);
            if (match) {

              if (match.length > 1) {
                // Remove first element, which matches the entire string
                match.shift();
              }
              command.callback.apply(command, [message].concat(_toConsumableArray(match)));
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'hears',
    value: function hears(pattern, callback) {

      var type = 'regexp';

      this.vocabulary.push({
        type: type,
        pattern: pattern,
        callback: callback
      });
    }
  }, {
    key: 'respond',
    value: function respond(message, text, mood) {
      var receiver = this.getUserName(message.user);

      // Channels are prefixed with 'C', users with 'U' and direct message with 'D'
      console.log(message.channel);
      if (message.channel[0] === 'C') {
        receiver = this.getChannelName(message.channel);
      }

      console.log('Mood', mood);

      mood = mood || 'normal';
      var moodIcons = {
        'normal': 'http://api.angryladder.elmered.com/assets/images/serve.png',
        'happy': 'http://api.angryladder.elmered.com/assets/images/happy.png',
        'medal': 'http://api.angryladder.elmered.com/assets/images/medal.png'
      };

      var params = {
        icon_url: moodIcons[mood]
        // icon_url: 'http://www.jorgenpersson.nu/wp-content/uploads/2015/02/legenden-jo-waldner.jpg'
      };

      this.slackBot.postTo(receiver, text, params);
    }
  }, {
    key: 'getChannelName',
    value: function getChannelName(slackId) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.slackBot.channels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var channel = _step2.value;

          if (channel.id === slackId) {
            return channel.name;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return null;
    }
  }, {
    key: 'getUserName',
    value: function getUserName(slackId) {
      var user = this.getUser(slackId);
      return user ? user.name : null;
    }
  }, {
    key: 'getUser',
    value: function getUser(slackId) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.slackBot.users[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var user = _step3.value;

          if (user.id === slackId) {
            return user;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return null;
    }
  }]);

  return Bot;
}();

exports.default = Bot;