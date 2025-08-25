"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRowSelection = exports.rowSelectionStateInitializer = void 0;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var signature_1 = require("../../../constants/signature");
var useGridEvent_1 = require("../../utils/useGridEvent");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var useGridLogger_1 = require("../../utils/useGridLogger");
var useGridSelector_1 = require("../../utils/useGridSelector");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var gridRowSelectionSelector_1 = require("./gridRowSelectionSelector");
var gridFocusStateSelector_1 = require("../focus/gridFocusStateSelector");
var gridFilterSelector_1 = require("../filter/gridFilterSelector");
var colDef_1 = require("../../../colDef");
var gridEditRowModel_1 = require("../../../models/gridEditRowModel");
var keyboardUtils_1 = require("../../../utils/keyboardUtils");
var useGridVisibleRows_1 = require("../../utils/useGridVisibleRows");
var constants_1 = require("../../../internals/constants");
var gridClasses_1 = require("../../../constants/gridClasses");
var domUtils_1 = require("../../../utils/domUtils");
var utils_1 = require("./utils");
var gridRowSelectionManager_1 = require("../../../models/gridRowSelectionManager");
var pagination_1 = require("../pagination");
var emptyModel = { type: 'include', ids: new Set() };
var rowSelectionStateInitializer = function (state, props) {
    var _a;
    return (__assign(__assign({}, state), { rowSelection: props.rowSelection ? ((_a = props.rowSelectionModel) !== null && _a !== void 0 ? _a : emptyModel) : emptyModel }));
};
exports.rowSelectionStateInitializer = rowSelectionStateInitializer;
/**
 * @requires useGridRows (state, method) - can be after
 * @requires useGridParamsApi (method) - can be after
 * @requires useGridFocus (state) - can be after
 * @requires useGridKeyboardNavigation (`cellKeyDown` event must first be consumed by it)
 */
var useGridRowSelection = function (apiRef, props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useGridSelection');
    var runIfRowSelectionIsEnabled = React.useCallback(function (callback) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (props.rowSelection) {
                callback.apply(void 0, args);
            }
        };
    }, [props.rowSelection]);
    var isNestedData = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowsSelector_1.gridRowMaximumTreeDepthSelector) > 1;
    var applyAutoSelection = props.signature !== signature_1.GridSignature.DataGrid &&
        (((_a = props.rowSelectionPropagation) === null || _a === void 0 ? void 0 : _a.parents) || ((_b = props.rowSelectionPropagation) === null || _b === void 0 ? void 0 : _b.descendants)) &&
        isNestedData;
    var propRowSelectionModel = React.useMemo(function () {
        return props.rowSelectionModel;
    }, [props.rowSelectionModel]);
    var lastRowToggled = React.useRef(null);
    apiRef.current.registerControlState({
        stateId: 'rowSelection',
        propModel: propRowSelectionModel,
        propOnChange: props.onRowSelectionModelChange,
        stateSelector: gridRowSelectionSelector_1.gridRowSelectionStateSelector,
        changeEvent: 'rowSelectionChange',
    });
    var checkboxSelection = props.checkboxSelection, disableRowSelectionOnClick = props.disableRowSelectionOnClick, propIsRowSelectable = props.isRowSelectable;
    var canHaveMultipleSelection = (0, utils_1.isMultipleRowSelectionEnabled)(props);
    var tree = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowsSelector_1.gridRowTreeSelector);
    var expandMouseRowRangeSelection = React.useCallback(function (id) {
        var _a;
        var endId = id;
        var startId = (_a = lastRowToggled.current) !== null && _a !== void 0 ? _a : id;
        var isSelected = apiRef.current.isRowSelected(id);
        if (isSelected) {
            var visibleRowIds = (0, gridFilterSelector_1.gridExpandedSortedRowIdsSelector)(apiRef);
            var startIndex = visibleRowIds.findIndex(function (rowId) { return rowId === startId; });
            var endIndex = visibleRowIds.findIndex(function (rowId) { return rowId === endId; });
            if (startIndex === endIndex) {
                return;
            }
            if (startIndex > endIndex) {
                endId = visibleRowIds[endIndex + 1];
            }
            else {
                endId = visibleRowIds[endIndex - 1];
            }
        }
        lastRowToggled.current = id;
        apiRef.current.selectRowRange({ startId: startId, endId: endId }, !isSelected);
    }, [apiRef]);
    var getRowsToBeSelected = (0, useEventCallback_1.default)(function () {
        var rowsToBeSelected = props.pagination && props.checkboxSelectionVisibleOnly && props.paginationMode === 'client'
            ? (0, pagination_1.gridPaginatedVisibleSortedGridRowIdsSelector)(apiRef)
            : (0, gridFilterSelector_1.gridExpandedSortedRowIdsSelector)(apiRef);
        return rowsToBeSelected;
    });
    /*
     * API METHODS
     */
    var setRowSelectionModel = React.useCallback(function (model, reason) {
        if (props.signature === signature_1.GridSignature.DataGrid &&
            !canHaveMultipleSelection &&
            (model.type !== 'include' || model.ids.size > 1)) {
            throw new Error([
                'MUI X: `rowSelectionModel` can only contain 1 item in DataGrid.',
                'You need to upgrade to DataGridPro or DataGridPremium component to unlock multiple selection.',
            ].join('\n'));
        }
        var currentModel = (0, gridRowSelectionSelector_1.gridRowSelectionStateSelector)(apiRef);
        if (currentModel !== model) {
            logger.debug("Setting selection model");
            apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { rowSelection: props.rowSelection ? model : emptyModel })); }, reason);
        }
    }, [apiRef, logger, props.rowSelection, props.signature, canHaveMultipleSelection]);
    var isRowSelected = React.useCallback(function (id) {
        var selectionManager = (0, gridRowSelectionSelector_1.gridRowSelectionManagerSelector)(apiRef);
        return selectionManager.has(id);
    }, [apiRef]);
    var isRowSelectable = React.useCallback(function (id) {
        if (props.rowSelection === false) {
            return false;
        }
        if (propIsRowSelectable && !propIsRowSelectable(apiRef.current.getRowParams(id))) {
            return false;
        }
        var rowNode = (0, gridRowsSelector_1.gridRowNodeSelector)(apiRef, id);
        if ((rowNode === null || rowNode === void 0 ? void 0 : rowNode.type) === 'footer' || (rowNode === null || rowNode === void 0 ? void 0 : rowNode.type) === 'pinnedRow') {
            return false;
        }
        return true;
    }, [apiRef, props.rowSelection, propIsRowSelectable]);
    var getSelectedRows = React.useCallback(function () { return (0, gridRowSelectionSelector_1.gridRowSelectionIdsSelector)(apiRef); }, [apiRef]);
    var selectRow = React.useCallback(function (id, isSelected, resetSelection) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (isSelected === void 0) { isSelected = true; }
        if (resetSelection === void 0) { resetSelection = false; }
        if (!apiRef.current.isRowSelectable(id)) {
            return;
        }
        lastRowToggled.current = id;
        if (resetSelection) {
            logger.debug("Setting selection for row ".concat(id));
            var newSelectionModel_1 = {
                type: 'include',
                ids: new Set(),
            };
            var addRow = function (rowId) {
                newSelectionModel_1.ids.add(rowId);
            };
            if (isSelected) {
                addRow(id);
                if (applyAutoSelection) {
                    (0, utils_1.findRowsToSelect)(apiRef, tree, id, (_b = (_a = props.rowSelectionPropagation) === null || _a === void 0 ? void 0 : _a.descendants) !== null && _b !== void 0 ? _b : false, (_d = (_c = props.rowSelectionPropagation) === null || _c === void 0 ? void 0 : _c.parents) !== null && _d !== void 0 ? _d : false, addRow);
                }
            }
            apiRef.current.setRowSelectionModel(newSelectionModel_1, 'singleRowSelection');
        }
        else {
            logger.debug("Toggling selection for row ".concat(id));
            var selectionModel = (0, gridRowSelectionSelector_1.gridRowSelectionStateSelector)(apiRef);
            var newSelectionModel = {
                type: selectionModel.type,
                ids: new Set(selectionModel.ids),
            };
            var selectionManager_1 = (0, gridRowSelectionManager_1.createRowSelectionManager)(newSelectionModel);
            selectionManager_1.unselect(id);
            var addRow = function (rowId) {
                selectionManager_1.select(rowId);
            };
            var removeRow = function (rowId) {
                selectionManager_1.unselect(rowId);
            };
            if (isSelected) {
                addRow(id);
                if (applyAutoSelection) {
                    (0, utils_1.findRowsToSelect)(apiRef, tree, id, (_f = (_e = props.rowSelectionPropagation) === null || _e === void 0 ? void 0 : _e.descendants) !== null && _f !== void 0 ? _f : false, (_h = (_g = props.rowSelectionPropagation) === null || _g === void 0 ? void 0 : _g.parents) !== null && _h !== void 0 ? _h : false, addRow);
                }
            }
            else if (applyAutoSelection) {
                (0, utils_1.findRowsToDeselect)(apiRef, tree, id, (_k = (_j = props.rowSelectionPropagation) === null || _j === void 0 ? void 0 : _j.descendants) !== null && _k !== void 0 ? _k : false, (_m = (_l = props.rowSelectionPropagation) === null || _l === void 0 ? void 0 : _l.parents) !== null && _m !== void 0 ? _m : false, removeRow);
            }
            var isSelectionValid = (newSelectionModel.type === 'include' && newSelectionModel.ids.size < 2) ||
                canHaveMultipleSelection;
            if (isSelectionValid) {
                apiRef.current.setRowSelectionModel(newSelectionModel, 'singleRowSelection');
            }
        }
    }, [
        apiRef,
        logger,
        applyAutoSelection,
        tree,
        (_c = props.rowSelectionPropagation) === null || _c === void 0 ? void 0 : _c.descendants,
        (_d = props.rowSelectionPropagation) === null || _d === void 0 ? void 0 : _d.parents,
        canHaveMultipleSelection,
    ]);
    var selectRows = React.useCallback(function (ids, isSelected, resetSelection) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (isSelected === void 0) { isSelected = true; }
        if (resetSelection === void 0) { resetSelection = false; }
        logger.debug("Setting selection for several rows");
        if (props.rowSelection === false) {
            return;
        }
        var selectableIds = new Set();
        for (var i = 0; i < ids.length; i += 1) {
            var id = ids[i];
            if (apiRef.current.isRowSelectable(id)) {
                selectableIds.add(id);
            }
        }
        var currentSelectionModel = (0, gridRowSelectionSelector_1.gridRowSelectionStateSelector)(apiRef);
        var newSelectionModel;
        if (resetSelection) {
            newSelectionModel = { type: 'include', ids: selectableIds };
            if (isSelected) {
                var selectionManager_2 = (0, gridRowSelectionManager_1.createRowSelectionManager)(newSelectionModel);
                if (applyAutoSelection) {
                    var addRow = function (rowId) {
                        selectionManager_2.select(rowId);
                    };
                    for (var _i = 0, selectableIds_1 = selectableIds; _i < selectableIds_1.length; _i++) {
                        var id = selectableIds_1[_i];
                        (0, utils_1.findRowsToSelect)(apiRef, tree, id, (_b = (_a = props.rowSelectionPropagation) === null || _a === void 0 ? void 0 : _a.descendants) !== null && _b !== void 0 ? _b : false, (_d = (_c = props.rowSelectionPropagation) === null || _c === void 0 ? void 0 : _c.parents) !== null && _d !== void 0 ? _d : false, addRow);
                    }
                }
            }
            else {
                newSelectionModel.ids = new Set();
            }
            if (currentSelectionModel.type === newSelectionModel.type &&
                newSelectionModel.ids.size === currentSelectionModel.ids.size &&
                Array.from(newSelectionModel.ids).every(function (id) { return currentSelectionModel.ids.has(id); })) {
                return;
            }
        }
        else {
            newSelectionModel = {
                type: currentSelectionModel.type,
                ids: new Set(currentSelectionModel.ids),
            };
            var selectionManager_3 = (0, gridRowSelectionManager_1.createRowSelectionManager)(newSelectionModel);
            var addRow = function (rowId) {
                selectionManager_3.select(rowId);
            };
            var removeRow = function (rowId) {
                selectionManager_3.unselect(rowId);
            };
            for (var _o = 0, selectableIds_2 = selectableIds; _o < selectableIds_2.length; _o++) {
                var id = selectableIds_2[_o];
                if (isSelected) {
                    selectionManager_3.select(id);
                    if (applyAutoSelection) {
                        (0, utils_1.findRowsToSelect)(apiRef, tree, id, (_f = (_e = props.rowSelectionPropagation) === null || _e === void 0 ? void 0 : _e.descendants) !== null && _f !== void 0 ? _f : false, (_h = (_g = props.rowSelectionPropagation) === null || _g === void 0 ? void 0 : _g.parents) !== null && _h !== void 0 ? _h : false, addRow);
                    }
                }
                else {
                    removeRow(id);
                    if (applyAutoSelection) {
                        (0, utils_1.findRowsToDeselect)(apiRef, tree, id, (_k = (_j = props.rowSelectionPropagation) === null || _j === void 0 ? void 0 : _j.descendants) !== null && _k !== void 0 ? _k : false, (_m = (_l = props.rowSelectionPropagation) === null || _l === void 0 ? void 0 : _l.parents) !== null && _m !== void 0 ? _m : false, removeRow);
                    }
                }
            }
        }
        var isSelectionValid = (newSelectionModel.type === 'include' && newSelectionModel.ids.size < 2) ||
            canHaveMultipleSelection;
        if (isSelectionValid) {
            apiRef.current.setRowSelectionModel(newSelectionModel, 'multipleRowsSelection');
        }
    }, [
        logger,
        applyAutoSelection,
        canHaveMultipleSelection,
        apiRef,
        tree,
        (_e = props.rowSelectionPropagation) === null || _e === void 0 ? void 0 : _e.descendants,
        (_f = props.rowSelectionPropagation) === null || _f === void 0 ? void 0 : _f.parents,
        props.rowSelection,
    ]);
    var getPropagatedRowSelectionModel = React.useCallback(function (inputSelectionModel) {
        var _a, _b, _c, _d;
        if (!isNestedData ||
            !applyAutoSelection ||
            (inputSelectionModel.ids.size === 0 && inputSelectionModel.type === 'include')) {
            return inputSelectionModel;
        }
        var propagatedSelectionModel = {
            type: inputSelectionModel.type,
            ids: new Set(inputSelectionModel.ids),
        };
        var selectionManager = (0, gridRowSelectionManager_1.createRowSelectionManager)(propagatedSelectionModel);
        var addRow = function (rowId) {
            selectionManager.select(rowId);
        };
        for (var _i = 0, _e = inputSelectionModel.ids; _i < _e.length; _i++) {
            var id = _e[_i];
            (0, utils_1.findRowsToSelect)(apiRef, tree, id, (_b = (_a = props.rowSelectionPropagation) === null || _a === void 0 ? void 0 : _a.descendants) !== null && _b !== void 0 ? _b : false, (_d = (_c = props.rowSelectionPropagation) === null || _c === void 0 ? void 0 : _c.parents) !== null && _d !== void 0 ? _d : false, addRow, selectionManager);
        }
        return propagatedSelectionModel;
    }, [
        apiRef,
        tree,
        (_g = props.rowSelectionPropagation) === null || _g === void 0 ? void 0 : _g.descendants,
        (_h = props.rowSelectionPropagation) === null || _h === void 0 ? void 0 : _h.parents,
        isNestedData,
        applyAutoSelection,
    ]);
    var selectRowRange = React.useCallback(function (_a, isSelected, resetSelection) {
        var startId = _a.startId, endId = _a.endId;
        if (isSelected === void 0) { isSelected = true; }
        if (resetSelection === void 0) { resetSelection = false; }
        if (!apiRef.current.getRow(startId) || !apiRef.current.getRow(endId)) {
            return;
        }
        logger.debug("Expanding selection from row ".concat(startId, " to row ").concat(endId));
        // Using rows from all pages allow to select a range across several pages
        var allPagesRowIds = (0, gridFilterSelector_1.gridExpandedSortedRowIdsSelector)(apiRef);
        var startIndex = allPagesRowIds.indexOf(startId);
        var endIndex = allPagesRowIds.indexOf(endId);
        var _b = startIndex > endIndex ? [endIndex, startIndex] : [startIndex, endIndex], start = _b[0], end = _b[1];
        var rowsBetweenStartAndEnd = allPagesRowIds.slice(start, end + 1);
        apiRef.current.selectRows(rowsBetweenStartAndEnd, isSelected, resetSelection);
    }, [apiRef, logger]);
    var selectionPublicApi = {
        selectRow: selectRow,
        setRowSelectionModel: setRowSelectionModel,
        getSelectedRows: getSelectedRows,
        isRowSelected: isRowSelected,
        isRowSelectable: isRowSelectable,
    };
    var selectionPrivateApi = {
        selectRows: selectRows,
        selectRowRange: selectRowRange,
        getPropagatedRowSelectionModel: getPropagatedRowSelectionModel,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, selectionPublicApi, 'public');
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, selectionPrivateApi, props.signature === signature_1.GridSignature.DataGrid ? 'private' : 'public');
    /*
     * EVENTS
     */
    var isFirstRender = React.useRef(true);
    var removeOutdatedSelection = React.useCallback(function (sortModelUpdated) {
        var _a, _b;
        if (sortModelUpdated === void 0) { sortModelUpdated = false; }
        if (isFirstRender.current) {
            return;
        }
        var currentSelection = (0, gridRowSelectionSelector_1.gridRowSelectionStateSelector)(apiRef);
        var rowsLookup = (0, gridRowsSelector_1.gridRowsLookupSelector)(apiRef);
        var rowTree = (0, gridRowsSelector_1.gridRowTreeSelector)(apiRef);
        var filteredRowsLookup = (0, gridFilterSelector_1.gridFilteredRowsLookupSelector)(apiRef);
        var isNonExistent = function (id) {
            if (props.filterMode === 'server') {
                return !rowsLookup[id];
            }
            return !rowTree[id] || filteredRowsLookup[id] === false;
        };
        var newSelectionModel = {
            type: currentSelection.type,
            ids: new Set(currentSelection.ids),
        };
        var selectionManager = (0, gridRowSelectionManager_1.createRowSelectionManager)(newSelectionModel);
        var hasChanged = false;
        for (var _i = 0, _c = currentSelection.ids; _i < _c.length; _i++) {
            var id = _c[_i];
            if (isNonExistent(id)) {
                if (props.keepNonExistentRowsSelected) {
                    continue;
                }
                selectionManager.unselect(id);
                hasChanged = true;
                continue;
            }
            if (!((_a = props.rowSelectionPropagation) === null || _a === void 0 ? void 0 : _a.parents)) {
                continue;
            }
            var node = tree[id];
            if ((node === null || node === void 0 ? void 0 : node.type) === 'group') {
                var isAutoGenerated = node.isAutoGenerated;
                if (isAutoGenerated) {
                    selectionManager.unselect(id);
                    hasChanged = true;
                    continue;
                }
                // Keep previously selected tree data parents selected if all their children are filtered out
                if (!node.children.every(function (childId) { return filteredRowsLookup[childId] === false; })) {
                    selectionManager.unselect(id);
                    hasChanged = true;
                }
            }
        }
        // For nested data, on row tree updation (filtering, adding rows, etc.) when the selection is
        // not empty, we need to re-run scanning of the tree to propagate the selection changes
        // Example: A parent whose de-selected children are filtered out should now be selected
        var shouldReapplyPropagation = isNestedData &&
            ((_b = props.rowSelectionPropagation) === null || _b === void 0 ? void 0 : _b.parents) &&
            (newSelectionModel.ids.size > 0 ||
                // In case of exclude selection, newSelectionModel.ids.size === 0 means all rows are selected
                newSelectionModel.type === 'exclude');
        if (hasChanged || (shouldReapplyPropagation && !sortModelUpdated)) {
            if (shouldReapplyPropagation) {
                if (newSelectionModel.type === 'exclude') {
                    var unfilteredSelectedRowIds = getRowsToBeSelected();
                    var selectedRowIds = [];
                    for (var i = 0; i < unfilteredSelectedRowIds.length; i += 1) {
                        var rowId = unfilteredSelectedRowIds[i];
                        if ((props.keepNonExistentRowsSelected || !isNonExistent(rowId)) &&
                            selectionManager.has(rowId)) {
                            selectedRowIds.push(rowId);
                        }
                    }
                    apiRef.current.selectRows(selectedRowIds, true, true);
                }
                else {
                    apiRef.current.selectRows(Array.from(newSelectionModel.ids), true, true);
                }
            }
            else {
                apiRef.current.setRowSelectionModel(newSelectionModel, 'multipleRowsSelection');
            }
        }
    }, [
        apiRef,
        isNestedData,
        (_j = props.rowSelectionPropagation) === null || _j === void 0 ? void 0 : _j.parents,
        props.keepNonExistentRowsSelected,
        props.filterMode,
        tree,
        getRowsToBeSelected,
    ]);
    var handleSingleRowSelection = React.useCallback(function (id, event) {
        var hasCtrlKey = event.metaKey || event.ctrlKey;
        // multiple selection is only allowed if:
        // - it is a checkboxSelection
        // - it is a keyboard selection
        // - Ctrl is pressed
        var isMultipleSelectionDisabled = !checkboxSelection && !hasCtrlKey && !(0, keyboardUtils_1.isKeyboardEvent)(event);
        var resetSelection = !canHaveMultipleSelection || isMultipleSelectionDisabled;
        var isSelected = apiRef.current.isRowSelected(id);
        var selectedRowsCount = (0, gridRowSelectionSelector_1.gridRowSelectionCountSelector)(apiRef);
        // Clicking on a row should toggle the selection except when a range of rows is already selected and the selection should reset
        // In that case, we want to keep the current row selected (https://github.com/mui/mui-x/pull/15509#discussion_r1878082687)
        var shouldStaySelected = selectedRowsCount > 1 && resetSelection;
        var newSelectionState = shouldStaySelected || !isSelected;
        apiRef.current.selectRow(id, newSelectionState, resetSelection);
    }, [apiRef, canHaveMultipleSelection, checkboxSelection]);
    var handleRowClick = React.useCallback(function (params, event) {
        var _a;
        if (disableRowSelectionOnClick) {
            return;
        }
        var field = (_a = event.target
            .closest(".".concat(gridClasses_1.gridClasses.cell))) === null || _a === void 0 ? void 0 : _a.getAttribute('data-field');
        if (field === colDef_1.GRID_CHECKBOX_SELECTION_COL_DEF.field) {
            // click on checkbox should not trigger row selection
            return;
        }
        if (field === constants_1.GRID_DETAIL_PANEL_TOGGLE_FIELD) {
            // click to open the detail panel should not select the row
            return;
        }
        if (field) {
            var column = apiRef.current.getColumn(field);
            if ((column === null || column === void 0 ? void 0 : column.type) === colDef_1.GRID_ACTIONS_COLUMN_TYPE) {
                return;
            }
        }
        var rowNode = (0, gridRowsSelector_1.gridRowNodeSelector)(apiRef, params.id);
        if (rowNode.type === 'pinnedRow') {
            return;
        }
        if (event.shiftKey && canHaveMultipleSelection) {
            expandMouseRowRangeSelection(params.id);
        }
        else {
            handleSingleRowSelection(params.id, event);
        }
    }, [
        disableRowSelectionOnClick,
        canHaveMultipleSelection,
        apiRef,
        expandMouseRowRangeSelection,
        handleSingleRowSelection,
    ]);
    var preventSelectionOnShift = React.useCallback(function (params, event) {
        var _a;
        if (canHaveMultipleSelection && event.shiftKey) {
            (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
        }
    }, [canHaveMultipleSelection]);
    var handleRowSelectionCheckboxChange = React.useCallback(function (params, event) {
        if (canHaveMultipleSelection && event.nativeEvent.shiftKey) {
            expandMouseRowRangeSelection(params.id);
        }
        else {
            apiRef.current.selectRow(params.id, params.value, !canHaveMultipleSelection);
        }
    }, [apiRef, expandMouseRowRangeSelection, canHaveMultipleSelection]);
    var toggleAllRows = React.useCallback(function (value) {
        var _a;
        var filterModel = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
        var quickFilterModel = (0, gridFilterSelector_1.gridQuickFilterValuesSelector)(apiRef);
        var hasFilters = filterModel.items.length > 0 || (quickFilterModel === null || quickFilterModel === void 0 ? void 0 : quickFilterModel.some(function (val) { return val.length; }));
        if (!props.isRowSelectable &&
            !props.checkboxSelectionVisibleOnly &&
            (!isNestedData || ((_a = props.rowSelectionPropagation) === null || _a === void 0 ? void 0 : _a.descendants)) &&
            !hasFilters) {
            apiRef.current.setRowSelectionModel({
                type: value ? 'exclude' : 'include',
                ids: new Set(),
            }, 'multipleRowsSelection');
        }
        else {
            apiRef.current.selectRows(getRowsToBeSelected(), value);
        }
    }, [
        apiRef,
        getRowsToBeSelected,
        props.checkboxSelectionVisibleOnly,
        props.isRowSelectable,
        (_k = props.rowSelectionPropagation) === null || _k === void 0 ? void 0 : _k.descendants,
        isNestedData,
    ]);
    var handleHeaderSelectionCheckboxChange = React.useCallback(function (params) {
        toggleAllRows(params.value);
    }, [toggleAllRows]);
    var handleCellKeyDown = React.useCallback(function (params, event) {
        // Get the most recent cell mode because it may have been changed by another listener
        if (apiRef.current.getCellMode(params.id, params.field) === gridEditRowModel_1.GridCellModes.Edit) {
            return;
        }
        // Ignore portal
        // Do not apply shortcuts if the focus is not on the cell root component
        if ((0, domUtils_1.isEventTargetInPortal)(event)) {
            return;
        }
        if ((0, keyboardUtils_1.isNavigationKey)(event.key) && event.shiftKey) {
            // The cell that has focus after the keyboard navigation
            var focusCell = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
            if (focusCell && focusCell.id !== params.id) {
                event.preventDefault();
                var isNextRowSelected = apiRef.current.isRowSelected(focusCell.id);
                if (!canHaveMultipleSelection) {
                    apiRef.current.selectRow(focusCell.id, !isNextRowSelected, true);
                    return;
                }
                var newRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(focusCell.id);
                var previousRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(params.id);
                var start = void 0;
                var end = void 0;
                if (newRowIndex > previousRowIndex) {
                    if (isNextRowSelected) {
                        // We are navigating to the bottom of the page and adding selected rows
                        start = previousRowIndex;
                        end = newRowIndex - 1;
                    }
                    else {
                        // We are navigating to the bottom of the page and removing selected rows
                        start = previousRowIndex;
                        end = newRowIndex;
                    }
                }
                else {
                    // eslint-disable-next-line no-lonely-if
                    if (isNextRowSelected) {
                        // We are navigating to the top of the page and removing selected rows
                        start = newRowIndex + 1;
                        end = previousRowIndex;
                    }
                    else {
                        // We are navigating to the top of the page and adding selected rows
                        start = newRowIndex;
                        end = previousRowIndex;
                    }
                }
                var visibleRows = (0, useGridVisibleRows_1.getVisibleRows)(apiRef);
                var rowsBetweenStartAndEnd = [];
                for (var i = start; i <= end; i += 1) {
                    rowsBetweenStartAndEnd.push(visibleRows.rows[i].id);
                }
                apiRef.current.selectRows(rowsBetweenStartAndEnd, !isNextRowSelected);
                return;
            }
        }
        if (event.key === ' ' && event.shiftKey) {
            event.preventDefault();
            handleSingleRowSelection(params.id, event);
            return;
        }
        if (String.fromCharCode(event.keyCode) === 'A' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            toggleAllRows(true);
        }
    }, [apiRef, canHaveMultipleSelection, handleSingleRowSelection, toggleAllRows]);
    var syncControlledState = (0, useEventCallback_1.default)(function () {
        if (!props.rowSelection) {
            apiRef.current.setRowSelectionModel(emptyModel);
            return;
        }
        if (propRowSelectionModel === undefined) {
            return;
        }
        if (!applyAutoSelection ||
            !isNestedData ||
            (propRowSelectionModel.type === 'include' && propRowSelectionModel.ids.size === 0)) {
            apiRef.current.setRowSelectionModel(propRowSelectionModel);
            return;
        }
        var newSelectionModel = apiRef.current.getPropagatedRowSelectionModel(propRowSelectionModel);
        if (newSelectionModel.type !== propRowSelectionModel.type ||
            newSelectionModel.ids.size !== propRowSelectionModel.ids.size ||
            !Array.from(propRowSelectionModel.ids).every(function (id) { return newSelectionModel.ids.has(id); })) {
            apiRef.current.setRowSelectionModel(newSelectionModel);
            return;
        }
        apiRef.current.setRowSelectionModel(propRowSelectionModel);
    });
    (0, useGridEvent_1.useGridEvent)(apiRef, 'sortedRowsSet', runIfRowSelectionIsEnabled(function () { return removeOutdatedSelection(true); }));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'filteredRowsSet', runIfRowSelectionIsEnabled(function () { return removeOutdatedSelection(); }));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'rowClick', runIfRowSelectionIsEnabled(handleRowClick));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'rowSelectionCheckboxChange', runIfRowSelectionIsEnabled(handleRowSelectionCheckboxChange));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'headerSelectionCheckboxChange', handleHeaderSelectionCheckboxChange);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellMouseDown', runIfRowSelectionIsEnabled(preventSelectionOnShift));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellKeyDown', runIfRowSelectionIsEnabled(handleCellKeyDown));
    /*
     * EFFECTS
     */
    React.useEffect(function () {
        syncControlledState();
    }, [apiRef, propRowSelectionModel, props.rowSelection, syncControlledState]);
    var isStateControlled = propRowSelectionModel != null;
    React.useEffect(function () {
        if (isStateControlled || !props.rowSelection || typeof isRowSelectable !== 'function') {
            return;
        }
        // props.isRowSelectable changed
        var currentSelection = (0, gridRowSelectionSelector_1.gridRowSelectionStateSelector)(apiRef);
        if (currentSelection.type !== 'include') {
            return;
        }
        var selectableIds = new Set();
        for (var _i = 0, _a = currentSelection.ids; _i < _a.length; _i++) {
            var id = _a[_i];
            if (isRowSelectable(id)) {
                selectableIds.add(id);
            }
        }
        if (selectableIds.size < currentSelection.ids.size) {
            apiRef.current.setRowSelectionModel({ type: currentSelection.type, ids: selectableIds });
        }
    }, [apiRef, isRowSelectable, isStateControlled, props.rowSelection]);
    React.useEffect(function () {
        if (!props.rowSelection || isStateControlled) {
            return;
        }
        var currentSelection = (0, gridRowSelectionSelector_1.gridRowSelectionStateSelector)(apiRef);
        if (!canHaveMultipleSelection &&
            ((currentSelection.type === 'include' && currentSelection.ids.size > 1) ||
                currentSelection.type === 'exclude')) {
            // See https://github.com/mui/mui-x/issues/8455
            apiRef.current.setRowSelectionModel(emptyModel);
        }
    }, [apiRef, canHaveMultipleSelection, checkboxSelection, isStateControlled, props.rowSelection]);
    React.useEffect(function () {
        runIfRowSelectionIsEnabled(removeOutdatedSelection);
    }, [removeOutdatedSelection, runIfRowSelectionIsEnabled]);
    React.useEffect(function () {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
    }, []);
};
exports.useGridRowSelection = useGridRowSelection;
