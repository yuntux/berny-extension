"use strict";

Object.defineProperty(exports, "ErrorCode", {
  enumerable: true,
  get: function get() {
    return _errors.default;
  }
});
exports.FileManagerMessages = void 0;

var _message = _interopRequireDefault(require("../../localization/message"));

var _errors = _interopRequireDefault(require("../../file_management/errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FileManagerMessages = {
  get: function get(errorId, args) {
    switch (errorId) {
      case _errors.default.NoAccess:
        return _message.default.format('dxFileManager-errorNoAccess');

      case _errors.default.FileExists:
        return _message.default.format('dxFileManager-errorFileExistsFormat', args);

      case _errors.default.FileNotFound:
        return _message.default.format('dxFileManager-errorFileNotFoundFormat', args);

      case _errors.default.DirectoryExists:
        return _message.default.format('dxFileManager-errorDirectoryExistsFormat', args);

      case _errors.default.DirectoryNotFound:
        return _message.default.format('dxFileManager-errorDirectoryNotFoundFormat', args);

      case _errors.default.WrongFileExtension:
        return _message.default.format('dxFileManager-errorWrongFileExtension');

      case _errors.default.MaxFileSizeExceeded:
        return _message.default.format('dxFileManager-errorMaxFileSizeExceeded');

      case _errors.default.InvalidSymbols:
        return _message.default.format('dxFileManager-errorInvalidSymbols');
    }

    return _message.default.format('dxFileManager-errorDefault');
  }
};
exports.FileManagerMessages = FileManagerMessages;