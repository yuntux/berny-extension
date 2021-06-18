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

var ExtImage = {};

if (_devextremeQuill.default) {
  var Image = _devextremeQuill.default.import('formats/image');

  ExtImage = /*#__PURE__*/function (_Image) {
    _inherits(ExtImage, _Image);

    var _super = _createSuper(ExtImage);

    function ExtImage() {
      _classCallCheck(this, ExtImage);

      return _super.apply(this, arguments);
    }

    _createClass(ExtImage, [{
      key: "formats",
      value: function formats() {
        var formats = _get(_getPrototypeOf(ExtImage.prototype), "formats", this).call(this);

        var floatValue = this.domNode.style['float'];

        if (floatValue) {
          formats['float'] = floatValue;
        }

        return formats;
      }
    }, {
      key: "format",
      value: function format(name, value) {
        if (name === 'float') {
          this.domNode.style[name] = value;
        } else {
          _get(_getPrototypeOf(ExtImage.prototype), "format", this).call(this, name, value);
        }
      }
    }], [{
      key: "create",
      value: function create(data) {
        var SRC = data && data.src || data;

        var node = _get(_getPrototypeOf(ExtImage), "create", this).call(this, SRC);

        if ((0, _type.isObject)(data)) {
          var setAttribute = function setAttribute(attr, value) {
            data[attr] && node.setAttribute(attr, value);
          };

          setAttribute('alt', data.alt);
          setAttribute('width', data.width);
          setAttribute('height', data.height);
        }

        return node;
      }
    }, {
      key: "formats",
      value: function formats(domNode) {
        var formats = _get(_getPrototypeOf(ExtImage), "formats", this).call(this, domNode);

        formats['imageSrc'] = domNode.getAttribute('src');
        return formats;
      }
    }, {
      key: "value",
      value: function value(domNode) {
        return {
          src: domNode.getAttribute('src'),
          width: domNode.getAttribute('width'),
          height: domNode.getAttribute('height'),
          alt: domNode.getAttribute('alt')
        };
      }
    }]);

    return ExtImage;
  }(Image);

  ExtImage.blotName = 'extendedImage';
}

var _default = ExtImage;
exports.default = _default;
module.exports = exports.default;