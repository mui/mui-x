"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridKeyboardNavigation = void 0;
var React = require("react");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var constants_1 = require("../../../internals/constants");
var gridRowGroupingUtils_1 = require("../../../internals/utils/gridRowGroupingUtils");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var useGridLogger_1 = require("../../utils/useGridLogger");
var useGridEvent_1 = require("../../utils/useGridEvent");
var gridFilterSelector_1 = require("../filter/gridFilterSelector");
var gridCheckboxSelectionColDef_1 = require("../../../colDef/gridCheckboxSelectionColDef");
var gridClasses_1 = require("../../../constants/gridClasses");
var gridEditRowModel_1 = require("../../../models/gridEditRowModel");
var keyboardUtils_1 = require("../../../utils/keyboardUtils");
var focus_1 = require("../focus");
var gridColumnGroupsSelector_1 = require("../columnGrouping/gridColumnGroupsSelector");
var gridHeaderFilteringSelectors_1 = require("../headerFiltering/gridHeaderFilteringSelectors");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var domUtils_1 = require("../../../utils/domUtils");
var utils_1 = require("./utils");
var createSelector_1 = require("../../../utils/createSelector");
var pagination_1 = require("../pagination");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var gridVisibleRowsWithPinnedRowsSelector = (0, createSelector_1.createSelectorMemoized)(pagination_1.gridVisibleRowsSelector, gridRowsSelector_1.gridPinnedRowsSelector, function (visibleRows, pinnedRows) {
    return (pinnedRows.top || []).concat(visibleRows.rows, pinnedRows.bottom || []);
});
/**
 * @requires useGridSorting (method) - can be after
 * @requires useGridFilter (state) - can be after
 * @requires useGridColumns (state, method) - can be after
 * @requires useGridDimensions (method) - can be after
 * @requires useGridFocus (method) - can be after
 * @requires useGridScroll (method) - can be after
 * @requires useGridColumnSpanning (method) - can be after
 */
var useGridKeyboardNavigation = function (apiRef, props) {
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useGridKeyboardNavigation');
    var isRtl = (0, RtlProvider_1.useRtl)();
    var getCurrentPageRows = React.useCallback(function () {
        return gridVisibleRowsWithPinnedRowsSelector(apiRef);
    }, [apiRef]);
    var headerFilteringEnabled = props.signature !== 'DataGrid' && props.headerFilters;
    /**
     * @param {number} colIndex Index of the column to focus
     * @param {GridRowId} rowId index of the row to focus
     * @param {string} closestColumnToUse Which closest column cell to use when the cell is spanned by `colSpan`.
     * @param {string} rowSpanScanDirection Which direction to search to find the next cell not hidden by `rowSpan`.
     * TODO replace with apiRef.current.moveFocusToRelativeCell()
     */
    var goToCell = React.useCallback(function (colIndex, rowId, closestColumnToUse, rowSpanScanDirection) {
        if (closestColumnToUse === void 0) { closestColumnToUse = 'left'; }
        if (rowSpanScanDirection === void 0) { rowSpanScanDirection = 'up'; }
        var visibleSortedRows = (0, gridFilterSelector_1.gridExpandedSortedRowEntriesSelector)(apiRef);
        var nextCellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, colIndex);
        if (nextCellColSpanInfo && nextCellColSpanInfo.spannedByColSpan) {
            if (closestColumnToUse === 'left') {
                colIndex = nextCellColSpanInfo.leftVisibleCellIndex;
            }
            else if (closestColumnToUse === 'right') {
                colIndex = nextCellColSpanInfo.rightVisibleCellIndex;
            }
        }
        var field = (0, gridColumnsSelector_1.gridVisibleColumnFieldsSelector)(apiRef)[colIndex];
        var nonRowSpannedRowId = (0, utils_1.findNonRowSpannedCell)(apiRef, rowId, colIndex, rowSpanScanDirection);
        // `scrollToIndexes` requires a rowIndex relative to all visible rows.
        // Those rows do not include pinned rows, but pinned rows do not need scroll anyway.
        var rowIndexRelativeToAllRows = visibleSortedRows.findIndex(function (row) { return row.id === nonRowSpannedRowId; });
        logger.debug("Navigating to cell row ".concat(rowIndexRelativeToAllRows, ", col ").concat(colIndex));
        apiRef.current.scrollToIndexes({
            colIndex: colIndex,
            rowIndex: rowIndexRelativeToAllRows,
        });
        apiRef.current.setCellFocus(nonRowSpannedRowId, field);
    }, [apiRef, logger]);
    var goToHeader = React.useCallback(function (colIndex, event) {
        logger.debug("Navigating to header col ".concat(colIndex));
        apiRef.current.scrollToIndexes({ colIndex: colIndex });
        var field = apiRef.current.getVisibleColumns()[colIndex].field;
        apiRef.current.setColumnHeaderFocus(field, event);
    }, [apiRef, logger]);
    var goToHeaderFilter = React.useCallback(function (colIndex, event) {
        logger.debug("Navigating to header filter col ".concat(colIndex));
        apiRef.current.scrollToIndexes({ colIndex: colIndex });
        var field = apiRef.current.getVisibleColumns()[colIndex].field;
        apiRef.current.setColumnHeaderFilterFocus(field, event);
    }, [apiRef, logger]);
    var goToGroupHeader = React.useCallback(function (colIndex, depth, event) {
        logger.debug("Navigating to header col ".concat(colIndex));
        apiRef.current.scrollToIndexes({ colIndex: colIndex });
        var field = apiRef.current.getVisibleColumns()[colIndex].field;
        apiRef.current.setColumnGroupHeaderFocus(field, depth, event);
    }, [apiRef, logger]);
    var getRowIdFromIndex = React.useCallback(function (rowIndex) {
        var _a;
        return (_a = getCurrentPageRows()[rowIndex]) === null || _a === void 0 ? void 0 : _a.id;
    }, [getCurrentPageRows]);
    var handleColumnHeaderKeyDown = React.useCallback(function (params, event) {
        var headerTitleNode = event.currentTarget.querySelector(".".concat(gridClasses_1.gridClasses.columnHeaderTitleContainerContent));
        var isFromInsideContent = !!headerTitleNode && headerTitleNode.contains(event.target);
        if (isFromInsideContent && params.field !== gridCheckboxSelectionColDef_1.GRID_CHECKBOX_SELECTION_COL_DEF.field) {
            // When focus is on a nested input, keyboard events have no effect to avoid conflicts with native events.
            // There is one exception for the checkBoxHeader
            return;
        }
        var currentPageRows = getCurrentPageRows();
        var viewportPageSize = apiRef.current.getViewportPageSize();
        var colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
        var firstRowIndexInPage = currentPageRows.length > 0 ? 0 : null;
        var lastRowIndexInPage = currentPageRows.length - 1;
        var firstColIndex = 0;
        var lastColIndex = (0, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector)(apiRef).length - 1;
        var columnGroupMaxDepth = (0, gridColumnGroupsSelector_1.gridColumnGroupsHeaderMaxDepthSelector)(apiRef);
        var shouldPreventDefault = true;
        switch (event.key) {
            case 'ArrowDown': {
                if (headerFilteringEnabled) {
                    goToHeaderFilter(colIndexBefore, event);
                }
                else if (firstRowIndexInPage !== null) {
                    goToCell(colIndexBefore, getRowIdFromIndex(firstRowIndexInPage));
                }
                break;
            }
            case 'ArrowRight': {
                var rightColIndex = (0, utils_1.getRightColumnIndex)({
                    currentColIndex: colIndexBefore,
                    firstColIndex: firstColIndex,
                    lastColIndex: lastColIndex,
                    isRtl: isRtl,
                });
                if (rightColIndex !== null) {
                    goToHeader(rightColIndex, event);
                }
                break;
            }
            case 'ArrowLeft': {
                var leftColIndex = (0, utils_1.getLeftColumnIndex)({
                    currentColIndex: colIndexBefore,
                    firstColIndex: firstColIndex,
                    lastColIndex: lastColIndex,
                    isRtl: isRtl,
                });
                if (leftColIndex !== null) {
                    goToHeader(leftColIndex, event);
                }
                break;
            }
            case 'ArrowUp': {
                if (columnGroupMaxDepth > 0) {
                    goToGroupHeader(colIndexBefore, columnGroupMaxDepth - 1, event);
                }
                break;
            }
            case 'PageDown': {
                if (firstRowIndexInPage !== null && lastRowIndexInPage !== null) {
                    goToCell(colIndexBefore, getRowIdFromIndex(Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage)));
                }
                break;
            }
            case 'Home': {
                goToHeader(firstColIndex, event);
                break;
            }
            case 'End': {
                goToHeader(lastColIndex, event);
                break;
            }
            case 'Enter': {
                if (event.ctrlKey || event.metaKey) {
                    apiRef.current.toggleColumnMenu(params.field);
                }
                break;
            }
            case ' ': {
                // prevent Space event from scrolling
                break;
            }
            default: {
                shouldPreventDefault = false;
            }
        }
        if (shouldPreventDefault) {
            event.preventDefault();
        }
    }, [
        apiRef,
        getCurrentPageRows,
        headerFilteringEnabled,
        goToHeaderFilter,
        goToCell,
        getRowIdFromIndex,
        isRtl,
        goToHeader,
        goToGroupHeader,
    ]);
    var handleHeaderFilterKeyDown = React.useCallback(function (params, event) {
        var isEditing = (0, gridHeaderFilteringSelectors_1.gridHeaderFilteringEditFieldSelector)(apiRef) === params.field;
        var isHeaderMenuOpen = (0, gridHeaderFilteringSelectors_1.gridHeaderFilteringMenuSelector)(apiRef) === params.field;
        if (isEditing || isHeaderMenuOpen || !(0, keyboardUtils_1.isNavigationKey)(event.key)) {
            return;
        }
        var currentPageRows = getCurrentPageRows();
        var viewportPageSize = apiRef.current.getViewportPageSize();
        var colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
        var firstRowIndexInPage = 0;
        var lastRowIndexInPage = currentPageRows.length - 1;
        var firstColIndex = 0;
        var lastColIndex = (0, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector)(apiRef).length - 1;
        var shouldPreventDefault = true;
        switch (event.key) {
            case 'ArrowDown': {
                var rowId = getRowIdFromIndex(firstRowIndexInPage);
                if (firstRowIndexInPage !== null && rowId != null) {
                    goToCell(colIndexBefore, rowId);
                }
                break;
            }
            case 'ArrowRight': {
                var rightColIndex = (0, utils_1.getRightColumnIndex)({
                    currentColIndex: colIndexBefore,
                    firstColIndex: firstColIndex,
                    lastColIndex: lastColIndex,
                    isRtl: isRtl,
                });
                if (rightColIndex !== null) {
                    goToHeaderFilter(rightColIndex, event);
                }
                break;
            }
            case 'ArrowLeft': {
                var leftColIndex = (0, utils_1.getLeftColumnIndex)({
                    currentColIndex: colIndexBefore,
                    firstColIndex: firstColIndex,
                    lastColIndex: lastColIndex,
                    isRtl: isRtl,
                });
                if (leftColIndex !== null) {
                    goToHeaderFilter(leftColIndex, event);
                }
                else {
                    apiRef.current.setColumnHeaderFilterFocus(params.field, event);
                }
                break;
            }
            case 'ArrowUp': {
                goToHeader(colIndexBefore, event);
                break;
            }
            case 'PageDown': {
                if (firstRowIndexInPage !== null && lastRowIndexInPage !== null) {
                    goToCell(colIndexBefore, getRowIdFromIndex(Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage)));
                }
                break;
            }
            case 'Home': {
                goToHeaderFilter(firstColIndex, event);
                break;
            }
            case 'End': {
                goToHeaderFilter(lastColIndex, event);
                break;
            }
            case ' ': {
                // prevent Space event from scrolling
                break;
            }
            default: {
                shouldPreventDefault = false;
            }
        }
        if (shouldPreventDefault) {
            event.preventDefault();
        }
    }, [apiRef, getCurrentPageRows, goToHeaderFilter, isRtl, goToHeader, goToCell, getRowIdFromIndex]);
    var handleColumnGroupHeaderKeyDown = React.useCallback(function (params, event) {
        var focusedColumnGroup = (0, focus_1.gridFocusColumnGroupHeaderSelector)(apiRef);
        if (focusedColumnGroup === null) {
            return;
        }
        var currentField = focusedColumnGroup.field, currentDepth = focusedColumnGroup.depth;
        var fields = params.fields, depth = params.depth, maxDepth = params.maxDepth;
        var currentPageRows = getCurrentPageRows();
        var viewportPageSize = apiRef.current.getViewportPageSize();
        var currentColIndex = apiRef.current.getColumnIndex(currentField);
        var colIndexBefore = currentField ? apiRef.current.getColumnIndex(currentField) : 0;
        var firstRowIndexInPage = 0;
        var lastRowIndexInPage = currentPageRows.length - 1;
        var firstColIndex = 0;
        var lastColIndex = (0, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector)(apiRef).length - 1;
        var shouldPreventDefault = true;
        switch (event.key) {
            case 'ArrowDown': {
                if (depth === maxDepth - 1) {
                    goToHeader(currentColIndex, event);
                }
                else {
                    goToGroupHeader(currentColIndex, currentDepth + 1, event);
                }
                break;
            }
            case 'ArrowUp': {
                if (depth > 0) {
                    goToGroupHeader(currentColIndex, currentDepth - 1, event);
                }
                break;
            }
            case 'ArrowRight': {
                var remainingRightColumns = fields.length - fields.indexOf(currentField) - 1;
                if (currentColIndex + remainingRightColumns + 1 <= lastColIndex) {
                    goToGroupHeader(currentColIndex + remainingRightColumns + 1, currentDepth, event);
                }
                break;
            }
            case 'ArrowLeft': {
                var remainingLeftColumns = fields.indexOf(currentField);
                if (currentColIndex - remainingLeftColumns - 1 >= firstColIndex) {
                    goToGroupHeader(currentColIndex - remainingLeftColumns - 1, currentDepth, event);
                }
                break;
            }
            case 'PageDown': {
                if (firstRowIndexInPage !== null && lastRowIndexInPage !== null) {
                    goToCell(colIndexBefore, getRowIdFromIndex(Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage)));
                }
                break;
            }
            case 'Home': {
                goToGroupHeader(firstColIndex, currentDepth, event);
                break;
            }
            case 'End': {
                goToGroupHeader(lastColIndex, currentDepth, event);
                break;
            }
            case ' ': {
                // prevent Space event from scrolling
                break;
            }
            default: {
                shouldPreventDefault = false;
            }
        }
        if (shouldPreventDefault) {
            event.preventDefault();
        }
    }, [apiRef, getCurrentPageRows, goToHeader, goToGroupHeader, goToCell, getRowIdFromIndex]);
    var handleCellKeyDown = React.useCallback(function (params, event) {
        // Ignore portal
        if ((0, domUtils_1.isEventTargetInPortal)(event)) {
            return;
        }
        // Get the most recent params because the cell mode may have changed by another listener
        var cellParams = apiRef.current.getCellParams(params.id, params.field);
        if (cellParams.cellMode === gridEditRowModel_1.GridCellModes.Edit || !(0, keyboardUtils_1.isNavigationKey)(event.key)) {
            return;
        }
        var canUpdateFocus = apiRef.current.unstable_applyPipeProcessors('canUpdateFocus', true, {
            event: event,
            cell: cellParams,
        });
        if (!canUpdateFocus) {
            return;
        }
        var currentPageRows = getCurrentPageRows();
        if (currentPageRows.length === 0) {
            return;
        }
        var viewportPageSize = apiRef.current.getViewportPageSize();
        var colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
        var rowIndexBefore = currentPageRows.findIndex(function (row) { return row.id === params.id; });
        var firstRowIndexInPage = 0;
        var lastRowIndexInPage = currentPageRows.length - 1;
        var firstColIndex = 0;
        var lastColIndex = (0, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector)(apiRef).length - 1;
        var shouldPreventDefault = true;
        switch (event.key) {
            case 'ArrowDown': {
                // "Enter" is only triggered by the row / cell editing feature
                if (rowIndexBefore < lastRowIndexInPage) {
                    goToCell(colIndexBefore, getRowIdFromIndex(rowIndexBefore + 1), isRtl ? 'right' : 'left', 'down');
                }
                break;
            }
            case 'ArrowUp': {
                if (rowIndexBefore > firstRowIndexInPage) {
                    goToCell(colIndexBefore, getRowIdFromIndex(rowIndexBefore - 1));
                }
                else if (headerFilteringEnabled) {
                    goToHeaderFilter(colIndexBefore, event);
                }
                else {
                    goToHeader(colIndexBefore, event);
                }
                break;
            }
            case 'ArrowRight': {
                var rightColIndex = (0, utils_1.getRightColumnIndex)({
                    currentColIndex: colIndexBefore,
                    firstColIndex: firstColIndex,
                    lastColIndex: lastColIndex,
                    isRtl: isRtl,
                });
                if (rightColIndex !== null) {
                    goToCell(rightColIndex, getRowIdFromIndex(rowIndexBefore), isRtl ? 'left' : 'right');
                }
                break;
            }
            case 'ArrowLeft': {
                var leftColIndex = (0, utils_1.getLeftColumnIndex)({
                    currentColIndex: colIndexBefore,
                    firstColIndex: firstColIndex,
                    lastColIndex: lastColIndex,
                    isRtl: isRtl,
                });
                if (leftColIndex !== null) {
                    goToCell(leftColIndex, getRowIdFromIndex(rowIndexBefore), isRtl ? 'right' : 'left');
                }
                break;
            }
            case 'Tab': {
                // "Tab" is only triggered by the row / cell editing feature
                if (event.shiftKey && colIndexBefore > firstColIndex) {
                    goToCell(colIndexBefore - 1, getRowIdFromIndex(rowIndexBefore), 'left');
                }
                else if (!event.shiftKey && colIndexBefore < lastColIndex) {
                    goToCell(colIndexBefore + 1, getRowIdFromIndex(rowIndexBefore), 'right');
                }
                break;
            }
            case ' ': {
                var field = params.field;
                if (field === constants_1.GRID_DETAIL_PANEL_TOGGLE_FIELD) {
                    break;
                }
                var colDef = params.colDef;
                if (colDef &&
                    (colDef.field === constants_1.GRID_TREE_DATA_GROUPING_FIELD || (0, gridRowGroupingUtils_1.isGroupingColumn)(colDef.field))) {
                    break;
                }
                if (!event.shiftKey && rowIndexBefore < lastRowIndexInPage) {
                    goToCell(colIndexBefore, getRowIdFromIndex(Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage)));
                }
                break;
            }
            case 'PageDown': {
                if (rowIndexBefore < lastRowIndexInPage) {
                    goToCell(colIndexBefore, getRowIdFromIndex(Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage)));
                }
                break;
            }
            case 'PageUp': {
                // Go to the first row before going to header
                var nextRowIndex = Math.max(rowIndexBefore - viewportPageSize, firstRowIndexInPage);
                if (nextRowIndex !== rowIndexBefore && nextRowIndex >= firstRowIndexInPage) {
                    goToCell(colIndexBefore, getRowIdFromIndex(nextRowIndex));
                }
                else {
                    goToHeader(colIndexBefore, event);
                }
                break;
            }
            case 'Home': {
                if (event.ctrlKey || event.metaKey || event.shiftKey) {
                    goToCell(firstColIndex, getRowIdFromIndex(firstRowIndexInPage));
                }
                else {
                    goToCell(firstColIndex, getRowIdFromIndex(rowIndexBefore));
                }
                break;
            }
            case 'End': {
                if (event.ctrlKey || event.metaKey || event.shiftKey) {
                    goToCell(lastColIndex, getRowIdFromIndex(lastRowIndexInPage));
                }
                else {
                    goToCell(lastColIndex, getRowIdFromIndex(rowIndexBefore));
                }
                break;
            }
            default: {
                shouldPreventDefault = false;
            }
        }
        if (shouldPreventDefault) {
            event.preventDefault();
        }
    }, [
        apiRef,
        getCurrentPageRows,
        isRtl,
        goToCell,
        getRowIdFromIndex,
        headerFilteringEnabled,
        goToHeaderFilter,
        goToHeader,
    ]);
    var checkIfCanStartEditing = React.useCallback(function (initialValue, _a) {
        var event = _a.event;
        if (event.key === ' ') {
            // Space scrolls to the last row
            return false;
        }
        return initialValue;
    }, []);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'canStartEditing', checkIfCanStartEditing);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnHeaderKeyDown', handleColumnHeaderKeyDown);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'headerFilterKeyDown', handleHeaderFilterKeyDown);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnGroupHeaderKeyDown', handleColumnGroupHeaderKeyDown);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellKeyDown', handleCellKeyDown);
};
exports.useGridKeyboardNavigation = useGridKeyboardNavigation;
