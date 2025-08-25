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
exports.useGridRowSpanning = exports.rowSpanningStateInitializer = void 0;
var React = require("react");
var features_1 = require("@mui/x-virtualizer/features");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var useGridVisibleRows_1 = require("../../utils/useGridVisibleRows");
var gridVirtualizationSelectors_1 = require("../virtualization/gridVirtualizationSelectors");
var gridRowSpanningUtils_1 = require("./gridRowSpanningUtils");
var useGridEvent_1 = require("../../utils/useGridEvent");
var utils_1 = require("../../../utils/utils");
var pagination_1 = require("../pagination");
var gridRowsSelector_1 = require("./gridRowsSelector");
var EMPTY_CACHES = {
    spannedCells: {},
    hiddenCells: {},
    hiddenCellOriginMap: {},
};
var EMPTY_RANGE = { firstRowIndex: 0, lastRowIndex: 0 };
var EMPTY_STATE = { caches: EMPTY_CACHES, processedRange: EMPTY_RANGE };
/**
 * Default number of rows to process during state initialization to avoid flickering.
 * Number `20` is arbitrarily chosen to be large enough to cover most of the cases without
 * compromising performance.
 */
var DEFAULT_ROWS_TO_PROCESS = 20;
var computeRowSpanningState = function (apiRef, colDefs, visibleRows, range, rangeToProcess, resetState) {
    var virtualizer = apiRef.current.virtualizer;
    var previousState = resetState ? EMPTY_STATE : features_1.Rowspan.selectors.state(virtualizer.store.state);
    var spannedCells = __assign({}, previousState.caches.spannedCells);
    var hiddenCells = __assign({}, previousState.caches.hiddenCells);
    var hiddenCellOriginMap = __assign({}, previousState.caches.hiddenCellOriginMap);
    var processedRange = {
        firstRowIndex: Math.min(previousState.processedRange.firstRowIndex, rangeToProcess.firstRowIndex),
        lastRowIndex: Math.max(previousState.processedRange.lastRowIndex, rangeToProcess.lastRowIndex),
    };
    colDefs.forEach(function (colDef, columnIndex) {
        var _a;
        var _loop_1 = function (index) {
            var _b, _c, _d, _e;
            var row = visibleRows[index];
            if ((_a = hiddenCells[row.id]) === null || _a === void 0 ? void 0 : _a[columnIndex]) {
                return "continue";
            }
            var cellValue = (0, gridRowSpanningUtils_1.getCellValue)(row.model, colDef, apiRef);
            if (cellValue == null) {
                return "continue";
            }
            var spannedRowId = row.id;
            var spannedRowIndex = index;
            var rowSpan = 0;
            // For first index, also scan in the previous rows to handle the reset state case e.g by sorting
            var backwardsHiddenCells = [];
            if (index === rangeToProcess.firstRowIndex) {
                var prevIndex = index - 1;
                var prevRowEntry = visibleRows[prevIndex];
                while (prevIndex >= range.firstRowIndex &&
                    prevRowEntry &&
                    (0, gridRowSpanningUtils_1.getCellValue)(prevRowEntry.model, colDef, apiRef) === cellValue) {
                    var currentRow = visibleRows[prevIndex + 1];
                    if (hiddenCells[currentRow.id]) {
                        hiddenCells[currentRow.id][columnIndex] = true;
                    }
                    else {
                        hiddenCells[currentRow.id] = (_b = {}, _b[columnIndex] = true, _b);
                    }
                    backwardsHiddenCells.push(index);
                    rowSpan += 1;
                    spannedRowId = prevRowEntry.id;
                    spannedRowIndex = prevIndex;
                    prevIndex -= 1;
                    prevRowEntry = visibleRows[prevIndex];
                }
            }
            backwardsHiddenCells.forEach(function (hiddenCellIndex) {
                var _a;
                if (hiddenCellOriginMap[hiddenCellIndex]) {
                    hiddenCellOriginMap[hiddenCellIndex][columnIndex] = spannedRowIndex;
                }
                else {
                    hiddenCellOriginMap[hiddenCellIndex] = (_a = {}, _a[columnIndex] = spannedRowIndex, _a);
                }
            });
            // Scan the next rows
            var relativeIndex = index + 1;
            while (relativeIndex <= range.lastRowIndex &&
                visibleRows[relativeIndex] &&
                (0, gridRowSpanningUtils_1.getCellValue)(visibleRows[relativeIndex].model, colDef, apiRef) === cellValue) {
                var currentRow = visibleRows[relativeIndex];
                if (hiddenCells[currentRow.id]) {
                    hiddenCells[currentRow.id][columnIndex] = true;
                }
                else {
                    hiddenCells[currentRow.id] = (_c = {}, _c[columnIndex] = true, _c);
                }
                if (hiddenCellOriginMap[relativeIndex]) {
                    hiddenCellOriginMap[relativeIndex][columnIndex] = spannedRowIndex;
                }
                else {
                    hiddenCellOriginMap[relativeIndex] = (_d = {}, _d[columnIndex] = spannedRowIndex, _d);
                }
                relativeIndex += 1;
                rowSpan += 1;
            }
            if (rowSpan > 0) {
                if (spannedCells[spannedRowId]) {
                    spannedCells[spannedRowId][columnIndex] = rowSpan + 1;
                }
                else {
                    spannedCells[spannedRowId] = (_e = {}, _e[columnIndex] = rowSpan + 1, _e);
                }
            }
        };
        for (var index = rangeToProcess.firstRowIndex; index < rangeToProcess.lastRowIndex; index += 1) {
            _loop_1(index);
        }
    });
    return { caches: { spannedCells: spannedCells, hiddenCells: hiddenCells, hiddenCellOriginMap: hiddenCellOriginMap }, processedRange: processedRange };
};
var getInitialRangeToProcess = function (props, apiRef) {
    var rowCount = (0, gridRowsSelector_1.gridDataRowIdsSelector)(apiRef).length;
    if (props.pagination) {
        var pageSize = (0, pagination_1.gridPageSizeSelector)(apiRef);
        var paginationLastRowIndex = DEFAULT_ROWS_TO_PROCESS;
        if (pageSize > 0) {
            paginationLastRowIndex = pageSize - 1;
        }
        return {
            firstRowIndex: 0,
            lastRowIndex: Math.min(paginationLastRowIndex, rowCount),
        };
    }
    return {
        firstRowIndex: 0,
        lastRowIndex: Math.min(DEFAULT_ROWS_TO_PROCESS, rowCount),
    };
};
/**
 * @requires columnsStateInitializer (method) - should be initialized before
 * @requires rowsStateInitializer (method) - should be initialized before
 * @requires filterStateInitializer (method) - should be initialized before
 */
var rowSpanningStateInitializer = function (state, props, apiRef) {
    var _a;
    if (!props.rowSpanning) {
        return __assign(__assign({}, state), { rowSpanning: EMPTY_STATE });
    }
    var rowIds = state.rows.dataRowIds || [];
    var orderedFields = state.columns.orderedFields || [];
    var dataRowIdToModelLookup = state.rows.dataRowIdToModelLookup;
    var columnsLookup = state.columns.lookup;
    var isFilteringPending = Boolean(state.filter.filterModel.items.length) ||
        Boolean((_a = state.filter.filterModel.quickFilterValues) === null || _a === void 0 ? void 0 : _a.length);
    if (!rowIds.length ||
        !orderedFields.length ||
        !dataRowIdToModelLookup ||
        !columnsLookup ||
        isFilteringPending) {
        return __assign(__assign({}, state), { rowSpanning: EMPTY_STATE });
    }
    var rangeToProcess = getInitialRangeToProcess(props, apiRef);
    var rows = rowIds.map(function (id) { return ({
        id: id,
        model: dataRowIdToModelLookup[id],
    }); });
    var colDefs = orderedFields.map(function (field) { return columnsLookup[field]; });
    var rowSpanning = computeRowSpanningState(apiRef, colDefs, rows, rangeToProcess, rangeToProcess, true);
    return __assign(__assign({}, state), { rowSpanning: rowSpanning });
};
exports.rowSpanningStateInitializer = rowSpanningStateInitializer;
var useGridRowSpanning = function (apiRef, props) {
    var store = apiRef.current.virtualizer.store;
    var updateRowSpanningState = React.useCallback(function (renderContext, resetState) {
        if (resetState === void 0) { resetState = false; }
        var _a = (0, useGridVisibleRows_1.getVisibleRows)(apiRef), range = _a.range, visibleRows = _a.rows;
        if (range === null || !(0, gridRowSpanningUtils_1.isRowContextInitialized)(renderContext)) {
            return;
        }
        var previousState = resetState ? EMPTY_STATE : features_1.Rowspan.selectors.state(store.state);
        var rangeToProcess = (0, gridRowSpanningUtils_1.getUnprocessedRange)({
            firstRowIndex: renderContext.firstRowIndex,
            lastRowIndex: Math.min(renderContext.lastRowIndex, range.lastRowIndex - range.firstRowIndex + 1),
        }, previousState.processedRange);
        if (rangeToProcess === null) {
            return;
        }
        var colDefs = (0, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector)(apiRef);
        var newState = computeRowSpanningState(apiRef, colDefs, visibleRows, range, rangeToProcess, resetState);
        var newSpannedCellsCount = Object.keys(newState.caches.spannedCells).length;
        var newHiddenCellsCount = Object.keys(newState.caches.hiddenCells).length;
        var previousSpannedCellsCount = Object.keys(previousState.caches.spannedCells).length;
        var previousHiddenCellsCount = Object.keys(previousState.caches.hiddenCells).length;
        var shouldUpdateState = resetState ||
            newSpannedCellsCount !== previousSpannedCellsCount ||
            newHiddenCellsCount !== previousHiddenCellsCount;
        var hasNoSpannedCells = newSpannedCellsCount === 0 && previousSpannedCellsCount === 0;
        if (!shouldUpdateState || hasNoSpannedCells) {
            return;
        }
        store.set('rowSpanning', newState);
    }, [apiRef, store]);
    // Reset events trigger a full re-computation of the row spanning state:
    // - The `unstable_rowSpanning` prop is updated (feature flag)
    // - The filtering is applied
    // - The sorting is applied
    // - The `paginationModel` is updated
    // - The rows are updated
    var resetRowSpanningState = React.useCallback(function () {
        var renderContext = (0, gridVirtualizationSelectors_1.gridRenderContextSelector)(apiRef);
        if (!(0, gridRowSpanningUtils_1.isRowContextInitialized)(renderContext)) {
            return;
        }
        updateRowSpanningState(renderContext, true);
    }, [apiRef, updateRowSpanningState]);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'renderedRowsIntervalChange', (0, utils_1.runIf)(props.rowSpanning, updateRowSpanningState));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'sortedRowsSet', (0, utils_1.runIf)(props.rowSpanning, resetRowSpanningState));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'paginationModelChange', (0, utils_1.runIf)(props.rowSpanning, resetRowSpanningState));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'filteredRowsSet', (0, utils_1.runIf)(props.rowSpanning, resetRowSpanningState));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnsChange', (0, utils_1.runIf)(props.rowSpanning, resetRowSpanningState));
    React.useEffect(function () {
        if (!props.rowSpanning) {
            if (store.state.rowSpanning !== EMPTY_STATE) {
                store.set('rowSpanning', EMPTY_STATE);
            }
        }
        else if (store.state.rowSpanning.caches === EMPTY_CACHES) {
            resetRowSpanningState();
        }
    }, [apiRef, store, resetRowSpanningState, props.rowSpanning]);
};
exports.useGridRowSpanning = useGridRowSpanning;
