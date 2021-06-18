"use strict";

exports.default = void 0;

var _date = _interopRequireDefault(require("../../../core/utils/date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MONDAY_INDEX = 1;
var SATURDAY_INDEX = 6;
var SUNDAY_INDEX = 0;

var workWeekUtils = /*#__PURE__*/function () {
  function workWeekUtils() {
    _classCallCheck(this, workWeekUtils);
  }

  _createClass(workWeekUtils, null, [{
    key: "isDataOnWeekend",
    value: function isDataOnWeekend(date) {
      var day = date.getDay();
      return day === SATURDAY_INDEX || day === SUNDAY_INDEX;
    }
  }, {
    key: "getFirstDayOfWeek",
    value: function getFirstDayOfWeek(firstDayOfWeekOption) {
      return firstDayOfWeekOption || MONDAY_INDEX;
    }
  }, {
    key: "getWeekendsCount",
    value: function getWeekendsCount(days) {
      return 2 * Math.floor(days / 7);
    }
  }, {
    key: "getFirstViewDate",
    value: function getFirstViewDate(viewStart, firstDayOfWeek) {
      var firstViewDate = _date.default.getFirstWeekDate(viewStart, firstDayOfWeek);

      return _date.default.normalizeDateByWeek(firstViewDate, viewStart);
    }
  }]);

  return workWeekUtils;
}();

var _default = workWeekUtils;
exports.default = _default;
module.exports = exports.default;