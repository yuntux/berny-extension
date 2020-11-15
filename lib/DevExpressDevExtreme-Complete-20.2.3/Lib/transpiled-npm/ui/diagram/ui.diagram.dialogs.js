"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _message = _interopRequireDefault(require("../../localization/message"));

var _popup = _interopRequireDefault(require("../popup"));

var _extend = require("../../core/utils/extend");

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

var DiagramDialog = /*#__PURE__*/function (_Widget) {
  _inherits(DiagramDialog, _Widget);

  var _super = _createSuper(DiagramDialog);

  function DiagramDialog() {
    _classCallCheck(this, DiagramDialog);

    return _super.apply(this, arguments);
  }

  _createClass(DiagramDialog, [{
    key: "_init",
    value: function _init() {
      _get(_getPrototypeOf(DiagramDialog.prototype), "_init", this).call(this);

      this._command = undefined;
      this._isShown = false;

      this._createOnGetContentOption();

      this._createOnHiddenOption();
    }
  }, {
    key: "_initMarkup",
    value: function _initMarkup() {
      _get(_getPrototypeOf(DiagramDialog.prototype), "_initMarkup", this).call(this);

      this._command = this.option('command');
      this._$popupElement = (0, _renderer.default)('<div>').appendTo(this.$element());
      this._popup = this._createComponent(this._$popupElement, _popup.default, {
        title: this.option('title'),
        maxWidth: this.option('maxWidth'),
        height: this.option('height'),
        toolbarItems: this.option('toolbarItems'),
        onHidden: this._onHiddenAction
      });
    }
  }, {
    key: "_clean",
    value: function _clean() {
      delete this._popup;
      this._$popupElement && this._$popupElement.remove();
    }
  }, {
    key: "_getDefaultOptions",
    value: function _getDefaultOptions() {
      return (0, _extend.extend)(_get(_getPrototypeOf(DiagramDialog.prototype), "_getDefaultOptions", this).call(this), {
        title: '',
        maxWidth: 500,
        height: 'auto',
        toolbarItems: this._getToolbarItems()
      });
    }
  }, {
    key: "_getToolbarItems",
    value: function _getToolbarItems() {
      return [this._getOkToolbarItem(), this._getCancelToolbarItem()];
    }
  }, {
    key: "_getOkToolbarItem",
    value: function _getOkToolbarItem() {
      return {
        widget: 'dxButton',
        location: 'after',
        toolbar: 'bottom',
        options: {
          text: _message.default.format('dxDiagram-dialogButtonOK'),
          onClick: function () {
            this._command.execute(this._commandParameter);

            this._hide();
          }.bind(this)
        }
      };
    }
  }, {
    key: "_getCancelToolbarItem",
    value: function _getCancelToolbarItem() {
      return {
        widget: 'dxButton',
        location: 'after',
        toolbar: 'bottom',
        options: {
          text: _message.default.format('dxDiagram-dialogButtonCancel'),
          onClick: this._hide.bind(this)
        }
      };
    }
  }, {
    key: "_optionChanged",
    value: function _optionChanged(args) {
      switch (args.name) {
        case 'title':
        case 'maxWidth':
        case 'height':
        case 'toolbarItems':
          this._popup.option(args.name, args.value);

          break;

        case 'command':
          this._command = args.value;
          break;

        case 'onGetContent':
          this._createOnGetContentOption();

          break;

        case 'onHidden':
          this._createOnHiddenOption();

          break;

        default:
          _get(_getPrototypeOf(DiagramDialog.prototype), "_optionChanged", this).call(this, args);

      }
    }
  }, {
    key: "_createOnGetContentOption",
    value: function _createOnGetContentOption() {
      this._onGetContentAction = this._createActionByOption('onGetContent');
    }
  }, {
    key: "_createOnHiddenOption",
    value: function _createOnHiddenOption() {
      this._onHiddenAction = this._createActionByOption('onHidden');
    }
  }, {
    key: "_hide",
    value: function _hide() {
      this._popup.hide();

      this._isShown = false;
    }
  }, {
    key: "_show",
    value: function _show() {
      this._popup.$content().empty().append(this._onGetContentAction());

      this._popup.show();

      this._isShown = true;
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return this._isShown;
    }
  }]);

  return DiagramDialog;
}(_ui.default);

var _default = DiagramDialog;
exports.default = _default;
module.exports = exports.default;