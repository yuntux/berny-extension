"use strict";

var _uiTree_list = _interopRequireDefault(require("./ui.tree_list.core"));

var _uiGrid_core = _interopRequireDefault(require("../grid_core/ui.grid_core.grid_view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GridView = _uiGrid_core.default.views.gridView.inherit(function () {
  return {
    _getWidgetAriaLabel: function _getWidgetAriaLabel() {
      return 'dxTreeList-ariaTreeList';
    },
    _getTableRoleName: function _getTableRoleName() {
      return 'treegrid';
    }
  };
}());

_uiTree_list.default.registerModule('gridView', {
  defaultOptions: _uiGrid_core.default.defaultOptions,
  controllers: _uiGrid_core.default.controllers,
  views: {
    gridView: GridView
  },
  extenders: {
    controllers: {
      resizing: {
        _toggleBestFitMode: function _toggleBestFitMode(isBestFit) {
          this.callBase(isBestFit);

          if (!this.option('legacyRendering')) {
            var $rowsTable = this._rowsView._getTableElement();

            $rowsTable.find('.dx-treelist-cell-expandable').toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
          }
        }
      }
    }
  }
});