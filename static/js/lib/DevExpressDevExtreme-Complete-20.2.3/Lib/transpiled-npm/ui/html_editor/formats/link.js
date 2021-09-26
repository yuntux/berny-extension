"use strict";

exports.default = void 0;

var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));

var _type = require("../../../core/utils/type");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ExtLink = {};

if (_devextremeQuill.default) {
  var Link = _devextremeQuill.default.import('formats/link');

  ExtLink = /*#__PURE__*/function (_Link) {
    _inherits(ExtLink, _Link);

    var _super = _createSuper(ExtLink);

    function ExtLink() {
      _classCallCheck(this, ExtLink);

      return _super.apply(this, arguments);
    }

    _createClass(ExtLink, [{
      key: "formats",
      value: function formats() {
        var formats = _get(_getPrototypeOf(ExtLink.prototype), "formats", this).call(this);

        var _ExtLink$formats = ExtLink.formats(this.domNode),
            href = _ExtLink$formats.href,
            target = _ExtLink$formats.target;

        formats.link = href;
        formats.target = target;
        return formats;
      }
    }, {
      key: "format",
      value: function format(name, value) {
        if (name === 'link' && (0, _type.isObject)(value)) {
          if (value.text) {
            this.domNode.innerText = value.text;
          }

          if (value.target) {
            this.domNode.setAttribute('target', '_blank');
          } else {
            this.domNode.removeAttribute('target');
          }

          this.domNode.setAttribute('href', value.href);
        } else {
          _get(_getPrototypeOf(ExtLink.prototype), "format", this).call(this, name, value);
        }
      }
    }], [{
      key: "create",
      value: function create(data) {
        var HREF = data && data.href || data;

        var node = _get(_getPrototypeOf(ExtLink), "create", this).call(this, HREF);

        if ((0, _type.isObject)(data)) {
          if (data.text) {
            node.innerText = data.text;
          }

          if (!data.target) {
            node.removeAttribute('target');
          }
        }

        return node;
      }
    }, {
      key: "formats",
      value: function formats(domNode) {
        return {
          href: domNode.getAttribute('href'),
          target: domNode.getAttribute('target')
        };
      }
    }, {
      key: "value",
      value: function value(domNode) {
        return {
          href: domNode.getAttribute('href'),
          text: domNode.innerText,
          target: !!domNode.getAttribute('target')
        };
      }
    }]);

    return ExtLink;
  }(Link);
}

var _default = ExtLink;
exports.default = _default;
module.exports = exports.default;