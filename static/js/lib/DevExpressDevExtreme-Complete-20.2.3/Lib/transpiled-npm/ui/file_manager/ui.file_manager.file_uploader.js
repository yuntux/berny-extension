"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _deferred = require("../../core/utils/deferred");

var _window = require("../../core/utils/window");

var _guid = _interopRequireDefault(require("../../core/guid"));

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _file_uploader = _interopRequireDefault(require("../file_uploader"));

var _uiFile_manager = require("./ui.file_manager.common");

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

var FILE_MANAGER_FILE_UPLOADER_CLASS = 'dx-filemanager-fileuploader';
var FILE_MANAGER_FILE_UPLOADER_DROPZONE_PLACEHOLER_CLASS = 'dx-filemanager-fileuploader-dropzone-placeholder';

var FileManagerFileUploader = /*#__PURE__*/function (_Widget) {
  _inherits(FileManagerFileUploader, _Widget);

  var _super = _createSuper(FileManagerFileUploader);

  function FileManagerFileUploader() {
    _classCallCheck(this, FileManagerFileUploader);

    return _super.apply(this, arguments);
  }

  _createClass(FileManagerFileUploader, [{
    key: "_initMarkup",
    value: function _initMarkup() {
      this._initActions();

      this.$element().addClass(FILE_MANAGER_FILE_UPLOADER_CLASS);
      this._uploaderInfos = [];
      this._dropZoneEnterCounter = 1;

      this._createInternalFileUploader();

      this._createDropZonePlaceholder();

      this._setDropZonePlaceholderVisible(false);

      _get(_getPrototypeOf(FileManagerFileUploader.prototype), "_initMarkup", this).call(this);
    }
  }, {
    key: "_createInternalFileUploader",
    value: function _createInternalFileUploader() {
      var _this = this;

      var chunkSize = this._getController().chunkSize;

      var $fileUploader = (0, _renderer.default)('<div>').appendTo(this.$element());

      var fileUploader = this._createComponent($fileUploader, _file_uploader.default, {
        name: 'file',
        multiple: true,
        showFileList: false,
        activeStateEnabled: false,
        focusStateEnabled: false,
        hoverStateEnabled: false,
        labelText: '',
        readyToUploadMessage: '',
        accept: '*',
        chunkSize: chunkSize,
        dropZone: this.option('dropZone'),
        onValueChanged: function onValueChanged(e) {
          return _this._onFileUploaderValueChanged(e);
        },
        onProgress: function onProgress(e) {
          return _this._onFileUploaderProgress(e);
        },
        onUploaded: function onUploaded(e) {
          return _this._onFileUploaderUploaded(e);
        },
        onUploadAborted: function onUploadAborted(e) {
          return _this._onFileUploaderUploadAborted(e);
        },
        onUploadError: function onUploadError(e) {
          return _this._onFileUploaderUploadError(e);
        },
        onDropZoneEnter: function onDropZoneEnter() {
          return _this._setDropZonePlaceholderVisible(true);
        },
        onDropZoneLeave: function onDropZoneLeave() {
          return _this._setDropZonePlaceholderVisible(false);
        }
      });

      fileUploader.option({
        uploadChunk: function uploadChunk(file, chunksData) {
          return _this._fileUploaderUploadChunk(fileUploader, file, chunksData);
        },
        abortUpload: function abortUpload(file, chunksData) {
          return _this._fileUploaderAbortUpload(fileUploader, file, chunksData);
        }
      });
      var uploaderInfo = {
        fileUploader: fileUploader
      };

      this._uploaderInfos.push(uploaderInfo);
    }
  }, {
    key: "tryUpload",
    value: function tryUpload() {
      var info = this._findAndUpdateAvailableUploaderInfo();

      if (info) {
        info.fileUploader._selectButtonClickHandler();
      }
    }
  }, {
    key: "cancelUpload",
    value: function cancelUpload(sessionId) {
      this._cancelUpload(sessionId);
    }
  }, {
    key: "cancelFileUpload",
    value: function cancelFileUpload(sessionId, fileIndex) {
      this._cancelUpload(sessionId, fileIndex);
    }
  }, {
    key: "_cancelUpload",
    value: function _cancelUpload(sessionId, fileIndex) {
      var _this$_findUploaderIn = this._findUploaderInfoBySessionId(sessionId),
          fileUploader = _this$_findUploaderIn.fileUploader;

      fileUploader.abortUpload(fileIndex);
    }
  }, {
    key: "_fileUploaderUploadChunk",
    value: function _fileUploaderUploadChunk(fileUploader, file, chunksInfo) {
      var _this$_findSessionByF = this._findSessionByFile(fileUploader, file),
          session = _this$_findSessionByF.session,
          fileIndex = _this$_findSessionByF.fileIndex;

      var controller = session.controller;
      chunksInfo.fileIndex = fileIndex;
      return controller.uploadFileChunk(file, chunksInfo);
    }
  }, {
    key: "_fileUploaderAbortUpload",
    value: function _fileUploaderAbortUpload(fileUploader, file, chunksInfo) {
      var _this$_findSessionByF2 = this._findSessionByFile(fileUploader, file),
          session = _this$_findSessionByF2.session,
          fileIndex = _this$_findSessionByF2.fileIndex;

      var controller = session.controller;
      chunksInfo.fileIndex = fileIndex;
      return controller.abortFileUpload(file, chunksInfo);
    }
  }, {
    key: "_onFileUploaderValueChanged",
    value: function _onFileUploaderValueChanged(_ref) {
      var _this2 = this;

      var component = _ref.component,
          value = _ref.value;

      if (value.length === 0) {
        return;
      }

      var files = value.slice();

      var uploaderInfo = this._findUploaderInfo(component);

      this._uploadFiles(uploaderInfo, files);

      setTimeout(function () {
        if (!_this2._findAndUpdateAvailableUploaderInfo()) {
          _this2._createInternalFileUploader();
        }
      });
    }
  }, {
    key: "_onFileUploaderProgress",
    value: function _onFileUploaderProgress(_ref2) {
      var component = _ref2.component,
          file = _ref2.file,
          bytesLoaded = _ref2.bytesLoaded,
          bytesTotal = _ref2.bytesTotal;

      var _this$_findSessionByF3 = this._findSessionByFile(component, file),
          session = _this$_findSessionByF3.session,
          fileIndex = _this$_findSessionByF3.fileIndex;

      var fileValue = bytesTotal !== 0 ? bytesLoaded / bytesTotal : 1;
      var commonValue = component.option('progress') / 100;
      var args = {
        sessionId: session.id,
        fileIndex: fileIndex,
        commonValue: commonValue,
        fileValue: fileValue
      };

      this._raiseUploadProgress(args);
    }
  }, {
    key: "_onFileUploaderUploaded",
    value: function _onFileUploaderUploaded(_ref3) {
      var component = _ref3.component,
          file = _ref3.file;

      var deferred = this._getDeferredForFile(component, file);

      deferred.resolve();
    }
  }, {
    key: "_onFileUploaderUploadAborted",
    value: function _onFileUploaderUploadAborted(_ref4) {
      var component = _ref4.component,
          file = _ref4.file;

      var deferred = this._getDeferredForFile(component, file);

      deferred.resolve({
        canceled: true
      });
    }
  }, {
    key: "_onFileUploaderUploadError",
    value: function _onFileUploaderUploadError(_ref5) {
      var component = _ref5.component,
          file = _ref5.file,
          error = _ref5.error;

      var deferred = this._getDeferredForFile(component, file);

      deferred.reject(error);
    }
  }, {
    key: "_createDropZonePlaceholder",
    value: function _createDropZonePlaceholder() {
      this._$dropZonePlaceholder = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_FILE_UPLOADER_DROPZONE_PLACEHOLER_CLASS).appendTo(this.option('dropZonePlaceholderContainer'));
    }
  }, {
    key: "_adjustDropZonePlaceholder",
    value: function _adjustDropZonePlaceholder() {
      if (!(0, _window.hasWindow)()) {
        return;
      }

      var $dropZoneTarget = this.option('dropZone');
      var placeholderBorderTopWidth = parseFloat(this._$dropZonePlaceholder.css('borderTopWidth'));
      var placeholderBorderLeftWidth = parseFloat(this._$dropZonePlaceholder.css('borderLeftWidth'));
      var $placeholderContainer = this.option('dropZonePlaceholderContainer');
      var containerBorderBottomWidth = parseFloat($placeholderContainer.css('borderBottomWidth'));
      var containerBorderLeftWidth = parseFloat($placeholderContainer.css('borderLeftWidth'));
      var containerHeight = $placeholderContainer.innerHeight();
      var containerOffset = $placeholderContainer.offset();
      var dropZoneOffset = $dropZoneTarget.offset();

      this._$dropZonePlaceholder.css({
        top: dropZoneOffset.top - containerOffset.top - containerHeight - containerBorderBottomWidth,
        left: dropZoneOffset.left - containerOffset.left - containerBorderLeftWidth
      });

      this._$dropZonePlaceholder.height($dropZoneTarget.get(0).offsetHeight - placeholderBorderTopWidth * 2);

      this._$dropZonePlaceholder.width($dropZoneTarget.get(0).offsetWidth - placeholderBorderLeftWidth * 2);
    }
  }, {
    key: "_setDropZonePlaceholderVisible",
    value: function _setDropZonePlaceholderVisible(visible) {
      this._dropZoneEnterCounter += visible ? 1 : -1;

      if (this._dropZoneEnterCounter < 0) {
        this._resetDropZoneEnterCounter();
      }

      if (visible && this._dropZoneEnterCounter === 1) {
        this._adjustDropZonePlaceholder();

        this._$dropZonePlaceholder.css('display', '');

        return;
      }

      if (!visible && this._dropZoneEnterCounter === 0) {
        this._$dropZonePlaceholder.css('display', 'none');
      }
    }
  }, {
    key: "_resetDropZoneEnterCounter",
    value: function _resetDropZoneEnterCounter() {
      this._dropZoneEnterCounter = 0;
    }
  }, {
    key: "_uploadFiles",
    value: function _uploadFiles(uploaderInfo, files) {
      this._setDropZonePlaceholderVisible(false);

      var sessionId = new _guid.default().toString();

      var controller = this._getController();

      var deferreds = files.map(function () {
        return new _deferred.Deferred();
      });
      var session = {
        id: sessionId,
        controller: controller,
        files: files,
        deferreds: deferreds
      };
      uploaderInfo.session = session;
      var sessionInfo = {
        sessionId: sessionId,
        deferreds: deferreds,
        files: files
      };

      this._raiseUploadSessionStarted(sessionInfo);

      return (0, _uiFile_manager.whenSome)(deferreds).always(function () {
        return setTimeout(function () {
          uploaderInfo.fileUploader.reset();
          uploaderInfo.session = null;
        });
      });
    }
  }, {
    key: "_getDeferredForFile",
    value: function _getDeferredForFile(fileUploader, file) {
      var _this$_findSessionByF4 = this._findSessionByFile(fileUploader, file),
          session = _this$_findSessionByF4.session,
          fileIndex = _this$_findSessionByF4.fileIndex;

      return session.deferreds[fileIndex];
    }
  }, {
    key: "_findSessionByFile",
    value: function _findSessionByFile(fileUploader, file) {
      var uploaderInfo = this._findUploaderInfo(fileUploader);

      var session = uploaderInfo.session;
      var fileIndex = session.files.indexOf(file);
      return {
        session: session,
        fileIndex: fileIndex
      };
    }
  }, {
    key: "_findUploaderInfoBySessionId",
    value: function _findUploaderInfoBySessionId(sessionId) {
      for (var i = 0; i < this._uploaderInfos.length; i++) {
        var uploaderInfo = this._uploaderInfos[i];
        var session = uploaderInfo.session;

        if (session && session.id === sessionId) {
          return uploaderInfo;
        }
      }

      return null;
    }
  }, {
    key: "_findAndUpdateAvailableUploaderInfo",
    value: function _findAndUpdateAvailableUploaderInfo() {
      var _info;

      var info = null;

      for (var i = 0; i < this._uploaderInfos.length; i++) {
        var currentInfo = this._uploaderInfos[i];
        currentInfo.fileUploader.option('dropZone', '');

        if (!info && !currentInfo.session) {
          info = currentInfo;
        }
      }

      (_info = info) === null || _info === void 0 ? void 0 : _info.fileUploader.option('dropZone', this.option('dropZone'));
      return info;
    }
  }, {
    key: "_findUploaderInfo",
    value: function _findUploaderInfo(fileUploader) {
      for (var i = 0; i < this._uploaderInfos.length; i++) {
        var info = this._uploaderInfos[i];

        if (info.fileUploader === fileUploader) {
          return info;
        }
      }

      return null;
    }
  }, {
    key: "_getController",
    value: function _getController() {
      var controllerGetter = this.option('getController');
      return controllerGetter();
    }
  }, {
    key: "_raiseUploadSessionStarted",
    value: function _raiseUploadSessionStarted(sessionInfo) {
      this._actions.onUploadSessionStarted({
        sessionInfo: sessionInfo
      });
    }
  }, {
    key: "_raiseUploadProgress",
    value: function _raiseUploadProgress(args) {
      this._actions.onUploadProgress(args);
    }
  }, {
    key: "_initActions",
    value: function _initActions() {
      this._actions = {
        onUploadSessionStarted: this._createActionByOption('onUploadSessionStarted'),
        onUploadProgress: this._createActionByOption('onUploadProgress')
      };
    }
  }, {
    key: "_getDefaultOptions",
    value: function _getDefaultOptions() {
      return (0, _extend.extend)(_get(_getPrototypeOf(FileManagerFileUploader.prototype), "_getDefaultOptions", this).call(this), {
        getController: null,
        onUploadSessionStarted: null,
        onUploadProgress: null
      });
    }
  }, {
    key: "_optionChanged",
    value: function _optionChanged(args) {
      var name = args.name;

      switch (name) {
        case 'getController':
          this.repaint();
          break;

        case 'onUploadSessionStarted':
        case 'onUploadProgress':
          this._actions[name] = this._createActionByOption(name);
          break;

        case 'dropZone':
          this._findAndUpdateAvailableUploaderInfo();

          this._adjustDropZonePlaceholder();

          this._resetDropZoneEnterCounter();

          break;

        case 'dropZonePlaceholderContainer':
          this._$dropZonePlaceholder.detach();

          this._$dropZonePlaceholder.appendTo(args.value);

          break;

        default:
          _get(_getPrototypeOf(FileManagerFileUploader.prototype), "_optionChanged", this).call(this, args);

      }
    }
  }]);

  return FileManagerFileUploader;
}(_ui.default);

var _default = FileManagerFileUploader;
exports.default = _default;
module.exports = exports.default;