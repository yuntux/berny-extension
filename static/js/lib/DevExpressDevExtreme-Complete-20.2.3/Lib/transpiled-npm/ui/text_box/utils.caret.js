"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _type = require("../../core/utils/type");

var _browser = _interopRequireDefault(require("../../core/utils/browser"));

var _devices = _interopRequireDefault(require("../../core/devices"));

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _devices$real = _devices.default.real(),
    ios = _devices$real.ios,
    mac = _devices$real.mac;

var isFocusingOnCaretChange = _browser.default.msie || ios || mac;

var getCaret = function getCaret(input) {
  var range;

  try {
    range = {
      start: input.selectionStart,
      end: input.selectionEnd
    };
  } catch (e) {
    range = {
      start: 0,
      end: 0
    };
  }

  return range;
};

var setCaret = function setCaret(input, position) {
  if (!_dom_adapter.default.getBody().contains(input)) {
    return;
  }

  try {
    input.selectionStart = position.start;
    input.selectionEnd = position.end;
  } catch (e) {}
};

var caret = function caret(input, position) {
  input = (0, _renderer.default)(input).get(0);

  if (!(0, _type.isDefined)(position)) {
    return getCaret(input);
  } // NOTE: IE and AppleWebKit-based browsers focuses element input after caret position has changed


  if (isFocusingOnCaretChange && _dom_adapter.default.getActiveElement() !== input) {
    return;
  }

  setCaret(input, position);
};

var _default = caret;
exports.default = _default;
module.exports = exports.default;