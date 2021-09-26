"use strict";

exports.DataGridProps = exports.DataGridExport = exports.DataGridLoadPanel = exports.DataGridKeyboardNavigation = exports.DataGridHeaderFilter = exports.DataGridFilterRow = exports.DataGridFilterPanel = exports.DataGridStateStoring = exports.DataGridSorting = exports.DataGridSearchPanel = exports.DataGridColumnFixing = exports.DataGridColumnChooser = exports.DataGridRowDragging = exports.DataGridMasterDetail = exports.DataGridPager = exports.DataGridSummary = exports.DataGridSummaryTotalItem = exports.DataGridSummaryGroupItem = exports.DataGridGrouping = exports.DataGridGroupPanel = exports.DataGridSortByGroupSummaryInfoItem = exports.DataGridPaging = exports.DataGridSelection = exports.DataGridScrolling = exports.DataGridEditing = exports.DataGridEditingTexts = exports.DataGridColumn = exports.DataGridColumnLookup = exports.DataGridColumnHeaderFilter = exports.DataGridColumnButton = void 0;

var _widget = require("../common/widget");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DataGridColumnButton = {};
exports.DataGridColumnButton = DataGridColumnButton;
var DataGridColumnHeaderFilter = {};
exports.DataGridColumnHeaderFilter = DataGridColumnHeaderFilter;
var DataGridColumnLookup = {};
exports.DataGridColumnLookup = DataGridColumnLookup;
var DataGridColumn = {};
exports.DataGridColumn = DataGridColumn;
var DataGridEditingTexts = {};
exports.DataGridEditingTexts = DataGridEditingTexts;
var DataGridEditing = {};
exports.DataGridEditing = DataGridEditing;
var DataGridScrolling = {};
exports.DataGridScrolling = DataGridScrolling;
var DataGridSelection = {};
exports.DataGridSelection = DataGridSelection;
var DataGridPaging = {};
exports.DataGridPaging = DataGridPaging;
var DataGridSortByGroupSummaryInfoItem = {};
exports.DataGridSortByGroupSummaryInfoItem = DataGridSortByGroupSummaryInfoItem;
var DataGridGroupPanel = {};
exports.DataGridGroupPanel = DataGridGroupPanel;
var DataGridGrouping = {};
exports.DataGridGrouping = DataGridGrouping;
var DataGridSummaryGroupItem = {};
exports.DataGridSummaryGroupItem = DataGridSummaryGroupItem;
var DataGridSummaryTotalItem = {};
exports.DataGridSummaryTotalItem = DataGridSummaryTotalItem;
var DataGridSummary = {};
exports.DataGridSummary = DataGridSummary;
var DataGridPager = {};
exports.DataGridPager = DataGridPager;
var DataGridMasterDetail = {};
exports.DataGridMasterDetail = DataGridMasterDetail;
var DataGridRowDragging = {};
exports.DataGridRowDragging = DataGridRowDragging;
var DataGridColumnChooser = {};
exports.DataGridColumnChooser = DataGridColumnChooser;
var DataGridColumnFixing = {};
exports.DataGridColumnFixing = DataGridColumnFixing;
var DataGridSearchPanel = {};
exports.DataGridSearchPanel = DataGridSearchPanel;
var DataGridSorting = {};
exports.DataGridSorting = DataGridSorting;
var DataGridStateStoring = {};
exports.DataGridStateStoring = DataGridStateStoring;
var DataGridFilterPanel = {};
exports.DataGridFilterPanel = DataGridFilterPanel;
var DataGridFilterRow = {};
exports.DataGridFilterRow = DataGridFilterRow;
var DataGridHeaderFilter = {};
exports.DataGridHeaderFilter = DataGridHeaderFilter;
var DataGridKeyboardNavigation = {};
exports.DataGridKeyboardNavigation = DataGridKeyboardNavigation;
var DataGridLoadPanel = {};
exports.DataGridLoadPanel = DataGridLoadPanel;
var DataGridExport = {};
exports.DataGridExport = DataGridExport;

var DataGridProps = _objectSpread(_objectSpread({}, _widget.WidgetProps), {}, {
  showColumnHeaders: true,
  defaultFilterValue: null,
  filterValueChange: function filterValueChange() {},
  defaultFocusedColumnIndex: -1,
  focusedColumnIndexChange: function focusedColumnIndexChange() {},
  defaultFocusedRowIndex: -1,
  focusedRowIndexChange: function focusedRowIndexChange() {},
  defaultFocusedRowKey: null,
  focusedRowKeyChange: function focusedRowKeyChange() {},
  defaultSelectedRowKeys: [],
  selectedRowKeysChange: function selectedRowKeysChange() {},
  defaultSelectionFilter: [],
  selectionFilterChange: function selectionFilterChange() {}
});

exports.DataGridProps = DataGridProps;