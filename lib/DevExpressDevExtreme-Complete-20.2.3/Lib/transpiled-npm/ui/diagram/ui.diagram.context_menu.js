"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _context_menu = _interopRequireDefault(require("../context_menu"));

var _diagram = _interopRequireDefault(require("./diagram.commands_manager"));

var _uiDiagram = _interopRequireDefault(require("./ui.diagram.menu_helper"));

var _diagram2 = _interopRequireDefault(require("./diagram.bar"));

var _diagram3 = require("./diagram.importer");

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

var DIAGRAM_TOUCHBAR_CLASS = 'dx-diagram-touchbar';
var DIAGRAM_TOUCHBAR_OVERLAY_CLASS = 'dx-diagram-touchbar-overlay';
var DIAGRAM_TOUCHBAR_TARGET_CLASS = 'dx-diagram-touchbar-target';
var DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH = 800;
var DIAGRAM_TOUCHBAR_Y_OFFSET = 32;

var DiagramContextMenuWrapper = /*#__PURE__*/function (_Widget) {
  _inherits(DiagramContextMenuWrapper, _Widget);

  var _super = _createSuper(DiagramContextMenuWrapper);

  function DiagramContextMenuWrapper() {
    _classCallCheck(this, DiagramContextMenuWrapper);

    return _super.apply(this, arguments);
  }

  _createClass(DiagramContextMenuWrapper, [{
    key: "_init",
    value: function _init() {
      _get(_getPrototypeOf(DiagramContextMenuWrapper.prototype), "_init", this).call(this);

      this._createOnVisibilityChangingAction();

      this._createOnInternalCommand();

      this._createOnCustomCommand();

      this._createOnItemClickAction();

      this._tempState = undefined;
      this._commands = [];
      this._commandToIndexMap = {};
      this.bar = new DiagramContextMenuBar(this);
    }
  }, {
    key: "_initMarkup",
    value: function _initMarkup() {
      var _this = this;

      _get(_getPrototypeOf(DiagramContextMenuWrapper.prototype), "_initMarkup", this).call(this);

      this._commands = this._getCommands();
      this._commandToIndexMap = {};

      this._fillCommandToIndexMap(this._commands, []);

      this._$contextMenuTargetElement = (0, _renderer.default)('<div>').addClass(DIAGRAM_TOUCHBAR_TARGET_CLASS).appendTo(this.$element());
      var $contextMenu = (0, _renderer.default)('<div>').appendTo(this.$element());
      this._contextMenuInstance = this._createComponent($contextMenu, DiagramContextMenu, {
        isTouchBarMode: this._isTouchBarMode(),
        cssClass: this._isTouchBarMode() ? DIAGRAM_TOUCHBAR_CLASS : _uiDiagram.default.getContextMenuCssClass(),
        closeOnOutsideClick: false,
        showEvent: '',
        focusStateEnabled: false,
        items: this._commands,
        position: this._isTouchBarMode() ? {
          my: {
            x: 'center',
            y: 'bottom'
          },
          at: {
            x: 'center',
            y: 'top'
          },
          of: this._$contextMenuTargetElement
        } : {},
        itemTemplate: function itemTemplate(itemData, itemIndex, itemElement) {
          _uiDiagram.default.getContextMenuItemTemplate(this, itemData, itemIndex, itemElement);
        },
        onItemClick: function onItemClick(_ref) {
          var itemData = _ref.itemData;
          return _this._onItemClick(itemData);
        },
        onShowing: function onShowing(e) {
          if (_this._inOnShowing === true) return;
          _this._inOnShowing = true;

          _this._onVisibilityChangingAction({
            visible: true,
            component: _this
          });

          e.component.option('items', e.component.option('items'));
          delete _this._inOnShowing;
        }
      });
    }
  }, {
    key: "_show",
    value: function _show(x, y, selection) {
      this._contextMenuInstance.hide();

      if (this._isTouchBarMode()) {
        this._$contextMenuTargetElement.show();

        if (!selection) {
          selection = {
            x: x,
            y: y,
            width: 0,
            height: 0
          };
        }

        var widthCorrection = selection.width > DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH ? 0 : (DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH - selection.width) / 2;

        this._$contextMenuTargetElement.css({
          left: selection.x - widthCorrection,
          top: selection.y - DIAGRAM_TOUCHBAR_Y_OFFSET,
          width: selection.width + 2 * widthCorrection,
          height: selection.height + 2 * DIAGRAM_TOUCHBAR_Y_OFFSET
        });

        this._contextMenuInstance.show();
      } else {
        this._contextMenuInstance.option('position', {
          offset: x + ' ' + y
        });

        this._contextMenuInstance.show();
      }
    }
  }, {
    key: "_hide",
    value: function _hide() {
      this._$contextMenuTargetElement.hide();

      this._contextMenuInstance.hide();
    }
  }, {
    key: "_isTouchBarMode",
    value: function _isTouchBarMode() {
      var _getDiagram = (0, _diagram3.getDiagram)(),
          Browser = _getDiagram.Browser;

      return Browser.TouchUI;
    }
  }, {
    key: "_onItemClick",
    value: function _onItemClick(itemData) {
      var processed = false;

      if (this._onItemClickAction) {
        processed = this._onItemClickAction(itemData);
      }

      if (!processed) {
        _uiDiagram.default.onContextMenuItemClick(this, itemData, this._executeCommand.bind(this));

        this._contextMenuInstance.hide();
      }
    }
  }, {
    key: "_executeCommand",
    value: function _executeCommand(command, name, value) {
      if (typeof command === 'number') {
        this.bar.raiseBarCommandExecuted(command, value);
      } else if (typeof command === 'string') {
        this._onInternalCommandAction({
          command: command
        });
      }

      if (name !== undefined) {
        this._onCustomCommandAction({
          name: name
        });
      }
    }
  }, {
    key: "_createOnInternalCommand",
    value: function _createOnInternalCommand() {
      this._onInternalCommandAction = this._createActionByOption('onInternalCommand');
    }
  }, {
    key: "_createOnCustomCommand",
    value: function _createOnCustomCommand() {
      this._onCustomCommandAction = this._createActionByOption('onCustomCommand');
    }
  }, {
    key: "_getCommands",
    value: function _getCommands() {
      return _diagram.default.getContextMenuCommands(this.option('commands'));
    }
  }, {
    key: "_fillCommandToIndexMap",
    value: function _fillCommandToIndexMap(commands, indexPath) {
      var _this2 = this;

      commands.forEach(function (command, index) {
        var commandIndexPath = indexPath.concat([index]);

        if (command.command !== undefined) {
          _this2._commandToIndexMap[command.command] = commandIndexPath;
        }

        if (Array.isArray(command.items)) {
          _this2._fillCommandToIndexMap(command.items, commandIndexPath);
        }
      });
    }
  }, {
    key: "_setItemEnabled",
    value: function _setItemEnabled(key, enabled) {
      this._setItemVisible(key, enabled);
    }
  }, {
    key: "_setItemVisible",
    value: function _setItemVisible(key, visible) {
      var itemOptionText = _uiDiagram.default.getItemOptionText(this._contextMenuInstance, this._commandToIndexMap[key]);

      _uiDiagram.default.updateContextMenuItemVisible(this._contextMenuInstance, itemOptionText, visible);
    }
  }, {
    key: "_setItemValue",
    value: function _setItemValue(key, value) {
      var itemOptionText = _uiDiagram.default.getItemOptionText(this._contextMenuInstance, this._commandToIndexMap[key]);

      _uiDiagram.default.updateContextMenuItemValue(this._contextMenuInstance, itemOptionText, key, value);
    }
  }, {
    key: "_setItemSubItems",
    value: function _setItemSubItems(key, items) {
      var itemOptionText = _uiDiagram.default.getItemOptionText(this._contextMenuInstance, this._commandToIndexMap[key]);

      _uiDiagram.default.updateContextMenuItems(this._contextMenuInstance, itemOptionText, key, items);
    }
  }, {
    key: "_setEnabled",
    value: function _setEnabled(enabled) {
      this._contextMenuInstance.option('disabled', !enabled);
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return this._inOnShowing;
    }
  }, {
    key: "_createOnVisibilityChangingAction",
    value: function _createOnVisibilityChangingAction() {
      this._onVisibilityChangingAction = this._createActionByOption('onVisibilityChanging');
    }
  }, {
    key: "_createOnItemClickAction",
    value: function _createOnItemClickAction() {
      this._onItemClickAction = this._createActionByOption('onItemClick');
    }
  }, {
    key: "_optionChanged",
    value: function _optionChanged(args) {
      switch (args.name) {
        case 'onVisibilityChanging':
          this._createOnVisibilityChangingAction();

          break;

        case 'onInternalCommand':
          this._createOnInternalCommand();

          break;

        case 'onCustomCommand':
          this._createOnCustomCommand();

          break;

        case 'onItemClick':
          this._createOnItemClickAction();

          break;

        case 'commands':
          this._invalidate();

          break;

        case 'export':
          break;

        default:
          _get(_getPrototypeOf(DiagramContextMenuWrapper.prototype), "_optionChanged", this).call(this, args);

      }
    }
  }]);

  return DiagramContextMenuWrapper;
}(_ui.default);

var DiagramContextMenu = /*#__PURE__*/function (_ContextMenu) {
  _inherits(DiagramContextMenu, _ContextMenu);

  var _super2 = _createSuper(DiagramContextMenu);

  function DiagramContextMenu() {
    _classCallCheck(this, DiagramContextMenu);

    return _super2.apply(this, arguments);
  }

  _createClass(DiagramContextMenu, [{
    key: "_renderContextMenuOverlay",
    value: function _renderContextMenuOverlay() {
      var _this3 = this;

      _get(_getPrototypeOf(DiagramContextMenu.prototype), "_renderContextMenuOverlay", this).call(this);

      if (this._overlay && this.option('isTouchBarMode')) {
        this._overlay && this._overlay.option('onShown', function () {
          var $content = (0, _renderer.default)(_this3._overlay.$content());
          $content.parent().addClass(DIAGRAM_TOUCHBAR_OVERLAY_CLASS);
        });
      }
    }
  }]);

  return DiagramContextMenu;
}(_context_menu.default);

var DiagramContextMenuBar = /*#__PURE__*/function (_DiagramBar) {
  _inherits(DiagramContextMenuBar, _DiagramBar);

  var _super3 = _createSuper(DiagramContextMenuBar);

  function DiagramContextMenuBar(owner) {
    _classCallCheck(this, DiagramContextMenuBar);

    return _super3.call(this, owner);
  }

  _createClass(DiagramContextMenuBar, [{
    key: "getCommandKeys",
    value: function getCommandKeys() {
      return this._getKeys(this._owner._commands);
    }
  }, {
    key: "setItemValue",
    value: function setItemValue(key, value) {
      this._owner._setItemValue(key, value);
    }
  }, {
    key: "setItemEnabled",
    value: function setItemEnabled(key, enabled) {
      this._owner._setItemEnabled(key, enabled);
    }
  }, {
    key: "setItemVisible",
    value: function setItemVisible(key, visible) {
      this._owner._setItemVisible(key, visible);
    }
  }, {
    key: "setItemSubItems",
    value: function setItemSubItems(key, items) {
      this._owner._setItemSubItems(key, items);
    }
  }, {
    key: "setEnabled",
    value: function setEnabled(enabled) {
      this._owner._setEnabled(enabled);
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return this._owner.isVisible();
    }
  }]);

  return DiagramContextMenuBar;
}(_diagram2.default);

var _default = {
  DiagramContextMenuWrapper: DiagramContextMenuWrapper,
  DiagramContextMenu: DiagramContextMenu
};
exports.default = _default;
module.exports = exports.default;