"use strict";

exports.default = void 0;

var _utils = require("../core/utils");

var _type = require("../../core/utils/type");

var _default = {
  _fromValue: function _fromValue(value) {
    return value !== null ? (0, _utils.getLogExt)(value, this._canvasOptions.base, this._businessRange.allowNegatives, this._businessRange.linearThreshold) : value;
  },
  _toValue: function _toValue(value) {
    return value !== null ? (0, _utils.raiseToExt)(value, this._canvasOptions.base, this._businessRange.allowNegatives, this._businessRange.linearThreshold) : value;
  },
  getMinBarSize: function getMinBarSize(minBarSize) {
    var visibleArea = this.getCanvasVisibleArea();
    var minValue = this.from(visibleArea.min + minBarSize);
    var canvasOptions = this._canvasOptions;
    return Math.pow(canvasOptions.base, canvasOptions.rangeMinVisible + this._fromValue(this.from(visibleArea.min)) - this._fromValue(!(0, _type.isDefined)(minValue) ? this.from(visibleArea.max) : minValue));
  },
  checkMinBarSize: function checkMinBarSize(initialValue, minShownValue, stackValue) {
    var canvasOptions = this._canvasOptions;
    var prevValue = stackValue - initialValue;
    var baseMethod = this.constructor.prototype.checkMinBarSize;
    var minBarSize;
    var updateValue;

    if ((0, _type.isDefined)(minShownValue) && prevValue > 0) {
      minBarSize = baseMethod(this._fromValue(stackValue / prevValue), this._fromValue(minShownValue) - canvasOptions.rangeMinVisible);
      updateValue = Math.pow(canvasOptions.base, this._fromValue(prevValue) + minBarSize) - prevValue;
    } else {
      updateValue = baseMethod(initialValue, minShownValue);
    }

    return updateValue;
  }
};
exports.default = _default;
module.exports = exports.default;