'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function successValidator(ret) {
  console.error('dentro ret');
  console.error(ret);
  return true;
}

var req = require('fetchival');
req.fetch = require('node-fetch');

var Owsync = function () {
  function Owsync() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? { backend: 'http://storefinder.depalop.com', successValidator: successValidator } : arguments[0];

    _classCallCheck(this, Owsync);

    console.error('dentro il costruttore');
    this.atoms = new Map();
    this.backend = options.backend;
    this.successValidator = options.successValidator;
  }

  _createClass(Owsync, [{
    key: 'add',
    value: function add(id, data) {
      this.atoms.set(id, data);
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this.atoms.get(id);
    }
  }, {
    key: 'gets',
    value: function gets() {
      return this.atoms;
    }
  }, {
    key: 'send',
    value: function send(id) {
      var _this = this;

      console.error('sending ', id);
      var data = this.atoms.get(id);
      return req(this.backend).post(data).then(successValidator).then(function (ret) {
        console.error('dovrebbe essere ok!');
        if (ret) {
          // success validator
          // remove this id from Map
          _this.atoms.delete(id);
          console.error("cancello l'elemento !", id);
          return true;
        }
        return false;
      }).catch(function (e) {
        console.error(e);
        return false;
      });
    }
  }, {
    key: 'sync',
    value: function sync() {
      console.error('devo mandare ', this.atoms.size);
      var proms = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.atoms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var atom = _step.value;

          console.error('mando ', atom);
          proms.push(this.send(atom));
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

      return Promise.all(proms);
    }
  }]);

  return Owsync;
}();

exports.default = Owsync;