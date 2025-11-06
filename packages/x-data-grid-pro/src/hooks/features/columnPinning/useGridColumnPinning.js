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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridColumnPinning = exports.columnPinningStateInitializer = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var columnPinningStateInitializer = function (state, props, apiRef) {
    var _a;
    apiRef.current.caches.columnPinning = {
        orderedFieldsBeforePinningColumns: null,
    };
    var model;
    if (props.pinnedColumns) {
        model = props.pinnedColumns;
    }
    else if ((_a = props.initialState) === null || _a === void 0 ? void 0 : _a.pinnedColumns) {
        model = props.initialState.pinnedColumns;
    }
    else {
        model = {};
    }
    return __assign(__assign({}, state), { pinnedColumns: model });
};
exports.columnPinningStateInitializer = columnPinningStateInitializer;
var useGridColumnPinning = function (apiRef, props) {
    var _a;
    var pinnedColumns = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridPinnedColumnsSelector);
    /**
     * PRE-PROCESSING
     */
    var calculateScrollLeft = React.useCallback(function (initialValue, params) {
        var visiblePinnedColumns = (0, internals_1.gridVisiblePinnedColumnDefinitionsSelector)(apiRef);
        if (!params.colIndex ||
            (visiblePinnedColumns.left.length === 0 && visiblePinnedColumns.right.length === 0)) {
            return initialValue;
        }
        var visibleColumns = (0, x_data_grid_1.gridVisibleColumnDefinitionsSelector)(apiRef);
        var columnsTotalWidth = (0, x_data_grid_1.gridColumnsTotalWidthSelector)(apiRef);
        var columnPositions = (0, x_data_grid_1.gridColumnPositionsSelector)(apiRef);
        var clientWidth = apiRef.current.virtualScrollerRef.current.clientWidth;
        // When using RTL, `scrollLeft` becomes negative, so we must ensure that we only compare values.
        var scrollLeft = Math.abs(apiRef.current.virtualScrollerRef.current.scrollLeft);
        var offsetWidth = visibleColumns[params.colIndex].computedWidth;
        var offsetLeft = columnPositions[params.colIndex];
        var leftPinnedColumnsWidth = columnPositions[visiblePinnedColumns.left.length];
        var rightPinnedColumnsWidth = columnsTotalWidth -
            columnPositions[columnPositions.length - visiblePinnedColumns.right.length];
        var elementBottom = offsetLeft + offsetWidth;
        if (elementBottom - (clientWidth - rightPinnedColumnsWidth) > scrollLeft) {
            var left = elementBottom - (clientWidth - rightPinnedColumnsWidth);
            return __assign(__assign({}, initialValue), { left: left });
        }
        if (offsetLeft < scrollLeft + leftPinnedColumnsWidth) {
            var left = offsetLeft - leftPinnedColumnsWidth;
            return __assign(__assign({}, initialValue), { left: left });
        }
        return initialValue;
    }, [apiRef]);
    var addColumnMenuItems = React.useCallback(function (columnMenuItems, colDef) {
        if (props.disableColumnPinning) {
            return columnMenuItems;
        }
        if (colDef.pinnable === false) {
            return columnMenuItems;
        }
        return __spreadArray(__spreadArray([], columnMenuItems, true), ['columnMenuPinningItem'], false);
    }, [props.disableColumnPinning]);
    var checkIfCanBeReordered = React.useCallback(function (initialValue, _a) {
        var targetIndex = _a.targetIndex;
        var visiblePinnedColumns = (0, internals_1.gridVisiblePinnedColumnDefinitionsSelector)(apiRef);
        if (visiblePinnedColumns.left.length === 0 && visiblePinnedColumns.right.length === 0) {
            return initialValue;
        }
        if (visiblePinnedColumns.left.length > 0 && targetIndex < visiblePinnedColumns.left.length) {
            return false;
        }
        if (visiblePinnedColumns.right.length > 0) {
            var visibleColumns = (0, x_data_grid_1.gridVisibleColumnDefinitionsSelector)(apiRef);
            var firstRightPinnedColumnIndex = visibleColumns.length - visiblePinnedColumns.right.length;
            return targetIndex >= firstRightPinnedColumnIndex ? false : initialValue;
        }
        return initialValue;
    }, [apiRef]);
    var stateExportPreProcessing = React.useCallback(function (prevState, context) {
        var _a, _b, _c;
        var pinnedColumnsToExport = (0, internals_1.gridPinnedColumnsSelector)(apiRef);
        var shouldExportPinnedColumns = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
            // Always export if the model is controlled
            props.pinnedColumns != null ||
            // Always export if the model has been initialized
            ((_a = props.initialState) === null || _a === void 0 ? void 0 : _a.pinnedColumns) != null ||
            // Export if the model is not empty
            ((_b = pinnedColumnsToExport.left) !== null && _b !== void 0 ? _b : []).length > 0 ||
            ((_c = pinnedColumnsToExport.right) !== null && _c !== void 0 ? _c : []).length > 0;
        if (!shouldExportPinnedColumns) {
            return prevState;
        }
        return __assign(__assign({}, prevState), { pinnedColumns: pinnedColumnsToExport });
    }, [apiRef, props.pinnedColumns, (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.pinnedColumns]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var newPinnedColumns = context.stateToRestore.pinnedColumns;
        if (newPinnedColumns != null) {
            setState(apiRef, newPinnedColumns);
        }
        return params;
    }, [apiRef]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'scrollToIndexes', calculateScrollLeft);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'columnMenu', addColumnMenuItems);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'canBeReordered', checkIfCanBeReordered);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
    apiRef.current.registerControlState({
        stateId: 'pinnedColumns',
        propModel: props.pinnedColumns,
        propOnChange: props.onPinnedColumnsChange,
        stateSelector: internals_1.gridPinnedColumnsSelector,
        changeEvent: 'pinnedColumnsChange',
    });
    var pinColumn = React.useCallback(function (field, side) {
        var _a;
        if (apiRef.current.isColumnPinned(field) === side) {
            return;
        }
        var otherSide = side === x_data_grid_1.GridPinnedColumnPosition.RIGHT
            ? x_data_grid_1.GridPinnedColumnPosition.LEFT
            : x_data_grid_1.GridPinnedColumnPosition.RIGHT;
        var newPinnedColumns = (_a = {},
            _a[side] = __spreadArray(__spreadArray([], (pinnedColumns[side] || []), true), [field], false),
            _a[otherSide] = (pinnedColumns[otherSide] || []).filter(function (column) { return column !== field; }),
            _a);
        apiRef.current.setPinnedColumns(newPinnedColumns);
    }, [apiRef, pinnedColumns]);
    var unpinColumn = React.useCallback(function (field) {
        apiRef.current.setPinnedColumns({
            left: (pinnedColumns.left || []).filter(function (column) { return column !== field; }),
            right: (pinnedColumns.right || []).filter(function (column) { return column !== field; }),
        });
    }, [apiRef, pinnedColumns.left, pinnedColumns.right]);
    var getPinnedColumns = React.useCallback(function () {
        return (0, internals_1.gridPinnedColumnsSelector)(apiRef);
    }, [apiRef]);
    var setPinnedColumns = React.useCallback(function (newPinnedColumns) {
        setState(apiRef, newPinnedColumns);
        apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
    }, [apiRef]);
    var isColumnPinned = React.useCallback(function (field) {
        var leftPinnedColumns = pinnedColumns.left || [];
        if (leftPinnedColumns.includes(field)) {
            return x_data_grid_1.GridPinnedColumnPosition.LEFT;
        }
        var rightPinnedColumns = pinnedColumns.right || [];
        if (rightPinnedColumns.includes(field)) {
            return x_data_grid_1.GridPinnedColumnPosition.RIGHT;
        }
        return false;
    }, [pinnedColumns.left, pinnedColumns.right]);
    var columnPinningApi = {
        pinColumn: pinColumn,
        unpinColumn: unpinColumn,
        getPinnedColumns: getPinnedColumns,
        setPinnedColumns: setPinnedColumns,
        isColumnPinned: isColumnPinned,
    };
    (0, x_data_grid_1.useGridApiMethod)(apiRef, columnPinningApi, 'public');
    var handleColumnOrderChange = function (params) {
        if (!apiRef.current.caches.columnPinning.orderedFieldsBeforePinningColumns) {
            return;
        }
        var column = params.column, targetIndex = params.targetIndex, oldIndex = params.oldIndex;
        var delta = targetIndex > oldIndex ? 1 : -1;
        var latestColumnFields = (0, x_data_grid_1.gridColumnFieldsSelector)(apiRef);
        /**
         * When a column X is reordered to somewhere else, the position where this column X is dropped
         * on must be moved to left or right to make room for it. The ^^^ below represents the column
         * which gave space to receive X.
         *
         * | X | B | C | D | -> | B | C | D | X | (for example X moved to after D, so delta=1)
         *              ^^^              ^^^
         *
         * | A | B | C | X | -> | X | A | B | C | (for example X moved before A, so delta=-1)
         *  ^^^                      ^^^
         *
         * If column P is pinned, it will not move to provide space. However, it will jump to the next
         * non-pinned column.
         *
         * | X | B | P | D | -> | B | D | P | X | (for example X moved to after D, with P pinned)
         *              ^^^          ^^^
         */
        var siblingField = latestColumnFields[targetIndex - delta];
        var newOrderedFieldsBeforePinningColumns = __spreadArray([], apiRef.current.caches.columnPinning.orderedFieldsBeforePinningColumns, true);
        // The index to start swapping fields
        var i = newOrderedFieldsBeforePinningColumns.findIndex(function (currentColumn) { return currentColumn === column.field; });
        // The index of the field to swap with
        var j = i + delta;
        // When to stop swapping fields.
        // We stop one field before because the swap is done with i + 1 (if delta=1)
        var stop = newOrderedFieldsBeforePinningColumns.findIndex(function (currentColumn) { return currentColumn === siblingField; });
        while (delta > 0 ? i < stop : i > stop) {
            // If the field to swap with is a pinned column, jump to the next
            while (apiRef.current.isColumnPinned(newOrderedFieldsBeforePinningColumns[j])) {
                j += delta;
            }
            var temp = newOrderedFieldsBeforePinningColumns[i];
            newOrderedFieldsBeforePinningColumns[i] = newOrderedFieldsBeforePinningColumns[j];
            newOrderedFieldsBeforePinningColumns[j] = temp;
            i = j;
            j = i + delta;
        }
        apiRef.current.caches.columnPinning.orderedFieldsBeforePinningColumns =
            newOrderedFieldsBeforePinningColumns;
    };
    (0, x_data_grid_1.useGridEvent)(apiRef, 'columnOrderChange', handleColumnOrderChange);
    React.useEffect(function () {
        if (props.pinnedColumns) {
            apiRef.current.setPinnedColumns(props.pinnedColumns);
        }
    }, [apiRef, props.pinnedColumns]);
};
exports.useGridColumnPinning = useGridColumnPinning;
function setState(apiRef, model) {
    apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { pinnedColumns: model })); });
}
