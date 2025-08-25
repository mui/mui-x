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
exports.useGridFocus = exports.focusStateInitializer = void 0;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var ownerDocument_1 = require("@mui/utils/ownerDocument");
var gridClasses_1 = require("../../../constants/gridClasses");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var useGridLogger_1 = require("../../utils/useGridLogger");
var useGridEvent_1 = require("../../utils/useGridEvent");
var keyboardUtils_1 = require("../../../utils/keyboardUtils");
var gridFocusStateSelector_1 = require("./gridFocusStateSelector");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var useGridVisibleRows_1 = require("../../utils/useGridVisibleRows");
var utils_1 = require("../../../utils/utils");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var focusStateInitializer = function (state) { return (__assign(__assign({}, state), { focus: { cell: null, columnHeader: null, columnHeaderFilter: null, columnGroupHeader: null }, tabIndex: { cell: null, columnHeader: null, columnHeaderFilter: null, columnGroupHeader: null } })); };
exports.focusStateInitializer = focusStateInitializer;
/**
 * @requires useGridParamsApi (method)
 * @requires useGridRows (method)
 * @requires useGridEditing (event)
 */
var useGridFocus = function (apiRef, props) {
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useGridFocus');
    var lastClickedCell = React.useRef(null);
    var hasRootReference = apiRef.current.rootElementRef.current !== null;
    var publishCellFocusOut = React.useCallback(function (cell, event) {
        if (cell) {
            // The row might have been deleted
            if (apiRef.current.getRow(cell.id)) {
                apiRef.current.publishEvent('cellFocusOut', apiRef.current.getCellParams(cell.id, cell.field), event);
            }
        }
    }, [apiRef]);
    var setCellFocus = React.useCallback(function (id, field) {
        var focusedCell = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
        if ((focusedCell === null || focusedCell === void 0 ? void 0 : focusedCell.id) === id && (focusedCell === null || focusedCell === void 0 ? void 0 : focusedCell.field) === field) {
            return;
        }
        apiRef.current.setState(function (state) {
            logger.debug("Focusing on cell with id=".concat(id, " and field=").concat(field));
            return __assign(__assign({}, state), { tabIndex: {
                    cell: { id: id, field: field },
                    columnHeader: null,
                    columnHeaderFilter: null,
                    columnGroupHeader: null,
                }, focus: {
                    cell: { id: id, field: field },
                    columnHeader: null,
                    columnHeaderFilter: null,
                    columnGroupHeader: null,
                } });
        });
        // The row might have been deleted
        if (!apiRef.current.getRow(id)) {
            return;
        }
        if (focusedCell) {
            // There's a focused cell but another cell was clicked
            // Publishes an event to notify that the focus was lost
            publishCellFocusOut(focusedCell, {});
        }
        apiRef.current.publishEvent('cellFocusIn', apiRef.current.getCellParams(id, field));
    }, [apiRef, logger, publishCellFocusOut]);
    var setColumnHeaderFocus = React.useCallback(function (field, event) {
        if (event === void 0) { event = {}; }
        var cell = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
        publishCellFocusOut(cell, event);
        apiRef.current.setState(function (state) {
            logger.debug("Focusing on column header with colIndex=".concat(field));
            return __assign(__assign({}, state), { tabIndex: {
                    columnHeader: { field: field },
                    columnHeaderFilter: null,
                    cell: null,
                    columnGroupHeader: null,
                }, focus: {
                    columnHeader: { field: field },
                    columnHeaderFilter: null,
                    cell: null,
                    columnGroupHeader: null,
                } });
        });
    }, [apiRef, logger, publishCellFocusOut]);
    var setColumnHeaderFilterFocus = React.useCallback(function (field, event) {
        if (event === void 0) { event = {}; }
        var cell = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
        publishCellFocusOut(cell, event);
        apiRef.current.setState(function (state) {
            logger.debug("Focusing on column header filter with colIndex=".concat(field));
            return __assign(__assign({}, state), { tabIndex: {
                    columnHeader: null,
                    columnHeaderFilter: { field: field },
                    cell: null,
                    columnGroupHeader: null,
                }, focus: {
                    columnHeader: null,
                    columnHeaderFilter: { field: field },
                    cell: null,
                    columnGroupHeader: null,
                } });
        });
    }, [apiRef, logger, publishCellFocusOut]);
    var setColumnGroupHeaderFocus = React.useCallback(function (field, depth, event) {
        if (event === void 0) { event = {}; }
        var cell = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
        if (cell) {
            apiRef.current.publishEvent('cellFocusOut', apiRef.current.getCellParams(cell.id, cell.field), event);
        }
        apiRef.current.setState(function (state) {
            return __assign(__assign({}, state), { tabIndex: {
                    columnGroupHeader: { field: field, depth: depth },
                    columnHeader: null,
                    columnHeaderFilter: null,
                    cell: null,
                }, focus: {
                    columnGroupHeader: { field: field, depth: depth },
                    columnHeader: null,
                    columnHeaderFilter: null,
                    cell: null,
                } });
        });
    }, [apiRef]);
    var getColumnGroupHeaderFocus = React.useCallback(function () { return (0, gridFocusStateSelector_1.gridFocusColumnGroupHeaderSelector)(apiRef); }, [apiRef]);
    var moveFocusToRelativeCell = React.useCallback(function (id, field, direction) {
        var columnIndexToFocus = apiRef.current.getColumnIndex(field);
        var visibleColumns = (0, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector)(apiRef);
        var currentPage = (0, useGridVisibleRows_1.getVisibleRows)(apiRef, {
            pagination: props.pagination,
            paginationMode: props.paginationMode,
        });
        var pinnedRows = (0, gridRowsSelector_1.gridPinnedRowsSelector)(apiRef);
        // Include pinned rows as well
        var currentPageRows = [].concat(pinnedRows.top || [], currentPage.rows, pinnedRows.bottom || []);
        var rowIndexToFocus = currentPageRows.findIndex(function (row) { return row.id === id; });
        if (direction === 'right') {
            columnIndexToFocus += 1;
        }
        else if (direction === 'left') {
            columnIndexToFocus -= 1;
        }
        else {
            rowIndexToFocus += 1;
        }
        if (columnIndexToFocus >= visibleColumns.length) {
            // Go to next row if we are after the last column
            rowIndexToFocus += 1;
            if (rowIndexToFocus < currentPageRows.length) {
                // Go to first column of the next row if there's one more row
                columnIndexToFocus = 0;
            }
        }
        else if (columnIndexToFocus < 0) {
            // Go to previous row if we are before the first column
            rowIndexToFocus -= 1;
            if (rowIndexToFocus >= 0) {
                // Go to last column of the previous if there's one more row
                columnIndexToFocus = visibleColumns.length - 1;
            }
        }
        rowIndexToFocus = (0, utils_1.clamp)(rowIndexToFocus, 0, currentPageRows.length - 1);
        var rowToFocus = currentPageRows[rowIndexToFocus];
        if (!rowToFocus) {
            return;
        }
        var colSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowToFocus.id, columnIndexToFocus);
        if (colSpanInfo && colSpanInfo.spannedByColSpan) {
            if (direction === 'left' || direction === 'below') {
                columnIndexToFocus = colSpanInfo.leftVisibleCellIndex;
            }
            else if (direction === 'right') {
                columnIndexToFocus = colSpanInfo.rightVisibleCellIndex;
            }
        }
        columnIndexToFocus = (0, utils_1.clamp)(columnIndexToFocus, 0, visibleColumns.length - 1);
        var columnToFocus = visibleColumns[columnIndexToFocus];
        apiRef.current.setCellFocus(rowToFocus.id, columnToFocus.field);
    }, [apiRef, props.pagination, props.paginationMode]);
    var handleCellDoubleClick = React.useCallback(function (_a) {
        var id = _a.id, field = _a.field;
        apiRef.current.setCellFocus(id, field);
    }, [apiRef]);
    var handleCellKeyDown = React.useCallback(function (params, event) {
        // GRID_CELL_NAVIGATION_KEY_DOWN handles the focus on Enter, Tab and navigation keys
        if (event.key === 'Enter' ||
            event.key === 'Tab' ||
            event.key === 'Shift' ||
            (0, keyboardUtils_1.isNavigationKey)(event.key)) {
            return;
        }
        apiRef.current.setCellFocus(params.id, params.field);
    }, [apiRef]);
    var handleColumnHeaderFocus = React.useCallback(function (_a, event) {
        var field = _a.field;
        if (event.target !== event.currentTarget) {
            return;
        }
        apiRef.current.setColumnHeaderFocus(field, event);
    }, [apiRef]);
    var handleColumnGroupHeaderFocus = React.useCallback(function (_a, event) {
        var fields = _a.fields, depth = _a.depth;
        if (event.target !== event.currentTarget) {
            return;
        }
        var focusedColumnGroup = (0, gridFocusStateSelector_1.gridFocusColumnGroupHeaderSelector)(apiRef);
        if (focusedColumnGroup !== null &&
            focusedColumnGroup.depth === depth &&
            fields.includes(focusedColumnGroup.field)) {
            // This group cell has already been focused
            return;
        }
        apiRef.current.setColumnGroupHeaderFocus(fields[0], depth, event);
    }, [apiRef]);
    var handleBlur = React.useCallback(function (_, event) {
        var _a, _b;
        if ((_b = (_a = event.relatedTarget) === null || _a === void 0 ? void 0 : _a.getAttribute('class')) === null || _b === void 0 ? void 0 : _b.includes(gridClasses_1.gridClasses.columnHeader)) {
            return;
        }
        logger.debug("Clearing focus");
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { focus: {
                cell: null,
                columnHeader: null,
                columnHeaderFilter: null,
                columnGroupHeader: null,
            } })); });
    }, [logger, apiRef]);
    var handleCellMouseDown = React.useCallback(function (params) {
        lastClickedCell.current = params;
    }, []);
    var handleDocumentClick = React.useCallback(function (event) {
        var cellParams = lastClickedCell.current;
        lastClickedCell.current = null;
        var focusedCell = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
        var canUpdateFocus = apiRef.current.unstable_applyPipeProcessors('canUpdateFocus', true, {
            event: event,
            cell: cellParams,
        });
        if (!canUpdateFocus) {
            return;
        }
        if (!focusedCell) {
            if (cellParams) {
                apiRef.current.setCellFocus(cellParams.id, cellParams.field);
            }
            return;
        }
        if ((cellParams === null || cellParams === void 0 ? void 0 : cellParams.id) === focusedCell.id && (cellParams === null || cellParams === void 0 ? void 0 : cellParams.field) === focusedCell.field) {
            return;
        }
        var cellElement = apiRef.current.getCellElement(focusedCell.id, focusedCell.field);
        if (cellElement === null || cellElement === void 0 ? void 0 : cellElement.contains(event.target)) {
            return;
        }
        if (cellParams) {
            apiRef.current.setCellFocus(cellParams.id, cellParams.field);
        }
        else {
            apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { focus: {
                    cell: null,
                    columnHeader: null,
                    columnHeaderFilter: null,
                    columnGroupHeader: null,
                } })); });
            // There's a focused cell but another element (not a cell) was clicked
            // Publishes an event to notify that the focus was lost
            publishCellFocusOut(focusedCell, event);
        }
    }, [apiRef, publishCellFocusOut]);
    var handleCellModeChange = React.useCallback(function (params) {
        if (params.cellMode === 'view') {
            return;
        }
        var cell = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
        if ((cell === null || cell === void 0 ? void 0 : cell.id) !== params.id || (cell === null || cell === void 0 ? void 0 : cell.field) !== params.field) {
            apiRef.current.setCellFocus(params.id, params.field);
        }
    }, [apiRef]);
    var handleRowSet = React.useCallback(function () {
        var _a;
        var cell = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
        // If the focused cell is in a row which does not exist anymore,
        // focus previous row or remove the focus
        if (cell && !apiRef.current.getRow(cell.id)) {
            var lastFocusedRowId = cell.id;
            var nextRowId_1 = null;
            if (typeof lastFocusedRowId !== 'undefined') {
                var rowEl = apiRef.current.getRowElement(lastFocusedRowId);
                var lastFocusedRowIndex = (rowEl === null || rowEl === void 0 ? void 0 : rowEl.dataset.rowindex) ? Number(rowEl === null || rowEl === void 0 ? void 0 : rowEl.dataset.rowindex) : 0;
                var currentPage = (0, useGridVisibleRows_1.getVisibleRows)(apiRef, {
                    pagination: props.pagination,
                    paginationMode: props.paginationMode,
                });
                var nextRow = currentPage.rows[(0, utils_1.clamp)(lastFocusedRowIndex, 0, currentPage.rows.length - 1)];
                nextRowId_1 = (_a = nextRow === null || nextRow === void 0 ? void 0 : nextRow.id) !== null && _a !== void 0 ? _a : null;
            }
            apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { focus: {
                    cell: nextRowId_1 === null ? null : { id: nextRowId_1, field: cell.field },
                    columnHeader: null,
                    columnHeaderFilter: null,
                    columnGroupHeader: null,
                } })); });
        }
    }, [apiRef, props.pagination, props.paginationMode]);
    var handlePaginationModelChange = (0, useEventCallback_1.default)(function () {
        var currentFocusedCell = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
        if (!currentFocusedCell) {
            return;
        }
        var currentPage = (0, useGridVisibleRows_1.getVisibleRows)(apiRef, {
            pagination: props.pagination,
            paginationMode: props.paginationMode,
        });
        var rowIsInCurrentPage = currentPage.rows.find(function (row) { return row.id === currentFocusedCell.id; });
        if (rowIsInCurrentPage || currentPage.rows.length === 0) {
            return;
        }
        var visibleColumns = (0, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector)(apiRef);
        apiRef.current.setState(function (state) {
            return __assign(__assign({}, state), { tabIndex: {
                    cell: { id: currentPage.rows[0].id, field: visibleColumns[0].field },
                    columnGroupHeader: null,
                    columnHeader: null,
                    columnHeaderFilter: null,
                } });
        });
    });
    var focusApi = {
        setCellFocus: setCellFocus,
        setColumnHeaderFocus: setColumnHeaderFocus,
        setColumnHeaderFilterFocus: setColumnHeaderFilterFocus,
    };
    var focusPrivateApi = {
        moveFocusToRelativeCell: moveFocusToRelativeCell,
        setColumnGroupHeaderFocus: setColumnGroupHeaderFocus,
        getColumnGroupHeaderFocus: getColumnGroupHeaderFocus,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, focusApi, 'public');
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, focusPrivateApi, 'private');
    React.useEffect(function () {
        var doc = (0, ownerDocument_1.default)(apiRef.current.rootElementRef.current);
        doc.addEventListener('mouseup', handleDocumentClick);
        return function () {
            doc.removeEventListener('mouseup', handleDocumentClick);
        };
    }, [apiRef, hasRootReference, handleDocumentClick]);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnHeaderBlur', handleBlur);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellDoubleClick', handleCellDoubleClick);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellMouseDown', handleCellMouseDown);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellKeyDown', handleCellKeyDown);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellModeChange', handleCellModeChange);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnHeaderFocus', handleColumnHeaderFocus);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnGroupHeaderFocus', handleColumnGroupHeaderFocus);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'rowsSet', handleRowSet);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'paginationModelChange', handlePaginationModelChange);
};
exports.useGridFocus = useGridFocus;
