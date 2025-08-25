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
exports.useGridCellSelection = exports.cellSelectionStateInitializer = void 0;
var React = require("react");
var ownerDocument_1 = require("@mui/utils/ownerDocument");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var gridCellSelectionSelector_1 = require("./gridCellSelectionSelector");
var cellSelectionStateInitializer = function (state, props) {
    var _a, _b;
    return (__assign(__assign({}, state), { cellSelection: __assign({}, ((_a = props.cellSelectionModel) !== null && _a !== void 0 ? _a : (_b = props.initialState) === null || _b === void 0 ? void 0 : _b.cellSelection)) }));
};
exports.cellSelectionStateInitializer = cellSelectionStateInitializer;
function isKeyboardEvent(event) {
    return !!event.key;
}
var AUTO_SCROLL_SENSITIVITY = 50; // The distance from the edge to start scrolling
var AUTO_SCROLL_SPEED = 20; // The speed to scroll once the mouse enters the sensitivity area
var useGridCellSelection = function (apiRef, props) {
    var hasRootReference = apiRef.current.rootElementRef.current !== null;
    var cellWithVirtualFocus = React.useRef(null);
    var lastMouseDownCell = React.useRef(null);
    var mousePosition = React.useRef(null);
    var autoScrollRAF = React.useRef(null);
    var totalHeaderHeight = (0, internals_1.getTotalHeaderHeight)(apiRef, props);
    var ignoreValueFormatterProp = props.ignoreValueFormatterDuringExport;
    var ignoreValueFormatter = (typeof ignoreValueFormatterProp === 'object'
        ? ignoreValueFormatterProp === null || ignoreValueFormatterProp === void 0 ? void 0 : ignoreValueFormatterProp.clipboardExport
        : ignoreValueFormatterProp) || false;
    var clipboardCopyCellDelimiter = props.clipboardCopyCellDelimiter;
    apiRef.current.registerControlState({
        stateId: 'cellSelection',
        propModel: props.cellSelectionModel,
        propOnChange: props.onCellSelectionModelChange,
        stateSelector: gridCellSelectionSelector_1.gridCellSelectionStateSelector,
        changeEvent: 'cellSelectionChange',
    });
    var runIfCellSelectionIsEnabled = function (callback) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (props.cellSelection) {
                callback.apply(void 0, args);
            }
        };
    };
    var isCellSelected = React.useCallback(function (id, field) {
        if (!props.cellSelection) {
            return false;
        }
        var cellSelectionModel = (0, gridCellSelectionSelector_1.gridCellSelectionStateSelector)(apiRef);
        return cellSelectionModel[id] ? !!cellSelectionModel[id][field] : false;
    }, [apiRef, props.cellSelection]);
    var getCellSelectionModel = React.useCallback(function () {
        return (0, gridCellSelectionSelector_1.gridCellSelectionStateSelector)(apiRef);
    }, [apiRef]);
    var setCellSelectionModel = React.useCallback(function (newModel) {
        if (!props.cellSelection) {
            return;
        }
        apiRef.current.setState(function (prevState) { return (__assign(__assign({}, prevState), { cellSelection: newModel })); });
    }, [apiRef, props.cellSelection]);
    var selectCellRange = React.useCallback(function (start, end, keepOtherSelected) {
        if (keepOtherSelected === void 0) { keepOtherSelected = false; }
        var startRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(start.id);
        var startColumnIndex = apiRef.current.getColumnIndex(start.field);
        var endRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(end.id);
        var endColumnIndex = apiRef.current.getColumnIndex(end.field);
        var finalStartRowIndex = startRowIndex;
        var finalStartColumnIndex = startColumnIndex;
        var finalEndRowIndex = endRowIndex;
        var finalEndColumnIndex = endColumnIndex;
        if (finalStartRowIndex > finalEndRowIndex) {
            finalStartRowIndex = endRowIndex;
            finalEndRowIndex = startRowIndex;
        }
        if (finalStartColumnIndex > finalEndColumnIndex) {
            finalStartColumnIndex = endColumnIndex;
            finalEndColumnIndex = startColumnIndex;
        }
        var visibleColumns = apiRef.current.getVisibleColumns();
        var visibleRows = (0, internals_1.getVisibleRows)(apiRef);
        var rowsInRange = visibleRows.rows.slice(finalStartRowIndex, finalEndRowIndex + 1);
        var columnsInRange = visibleColumns.slice(finalStartColumnIndex, finalEndColumnIndex + 1);
        var newModel = keepOtherSelected ? __assign({}, apiRef.current.getCellSelectionModel()) : {};
        rowsInRange.forEach(function (row) {
            if (!newModel[row.id]) {
                newModel[row.id] = {};
            }
            columnsInRange.forEach(function (column) {
                newModel[row.id][column.field] = true;
            }, {});
        });
        apiRef.current.setCellSelectionModel(newModel);
    }, [apiRef]);
    var getSelectedCellsAsArray = React.useCallback(function () {
        var selectionModel = apiRef.current.getCellSelectionModel();
        var currentVisibleRows = (0, internals_1.getVisibleRows)(apiRef, props);
        var sortedEntries = currentVisibleRows.rows.reduce(function (result, row) {
            if (row.id in selectionModel) {
                result.push([row.id, selectionModel[row.id]]);
            }
            return result;
        }, []);
        return sortedEntries.reduce(function (selectedCells, _a) {
            var id = _a[0], fields = _a[1];
            selectedCells.push.apply(selectedCells, Object.entries(fields).reduce(function (selectedFields, _a) {
                var field = _a[0], isSelected = _a[1];
                if (isSelected) {
                    selectedFields.push({ id: id, field: field });
                }
                return selectedFields;
            }, []));
            return selectedCells;
        }, []);
    }, [apiRef, props]);
    var cellSelectionApi = {
        isCellSelected: isCellSelected,
        getCellSelectionModel: getCellSelectionModel,
        setCellSelectionModel: setCellSelectionModel,
        selectCellRange: selectCellRange,
        getSelectedCellsAsArray: getSelectedCellsAsArray,
    };
    (0, x_data_grid_pro_1.useGridApiMethod)(apiRef, cellSelectionApi, 'public');
    var hasClickedValidCellForRangeSelection = React.useCallback(function (params) {
        if (params.field === x_data_grid_pro_1.GRID_CHECKBOX_SELECTION_COL_DEF.field) {
            return false;
        }
        if (params.field === x_data_grid_pro_1.GRID_DETAIL_PANEL_TOGGLE_FIELD) {
            return false;
        }
        var column = apiRef.current.getColumn(params.field);
        if (column.type === x_data_grid_pro_1.GRID_ACTIONS_COLUMN_TYPE) {
            return false;
        }
        return params.rowNode.type !== 'pinnedRow';
    }, [apiRef]);
    var handleMouseUp = (0, useEventCallback_1.default)(function () {
        var _a, _b;
        lastMouseDownCell.current = null;
        (_b = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.classList.remove(x_data_grid_pro_1.gridClasses['root--disableUserSelection']);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        stopAutoScroll();
    });
    var handleCellMouseDown = React.useCallback(function (params, event) {
        var _a, _b, _c;
        // Skip if the click comes from the right-button or, only on macOS, Ctrl is pressed
        // Fix for https://github.com/mui/mui-x/pull/6567#issuecomment-1329155578
        var isMacOs = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        if (event.button !== 0 || (event.ctrlKey && isMacOs)) {
            return;
        }
        if (params.field === x_data_grid_pro_1.GRID_REORDER_COL_DEF.field) {
            return;
        }
        var focusedCell = (0, x_data_grid_pro_1.gridFocusCellSelector)(apiRef);
        if (hasClickedValidCellForRangeSelection(params) && event.shiftKey && focusedCell) {
            event.preventDefault();
        }
        lastMouseDownCell.current = { id: params.id, field: params.field };
        (_b = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.classList.add(x_data_grid_pro_1.gridClasses['root--disableUserSelection']);
        var document = (0, ownerDocument_1.default)((_c = apiRef.current.rootElementRef) === null || _c === void 0 ? void 0 : _c.current);
        document.addEventListener('mouseup', handleMouseUp, { once: true });
    }, [apiRef, handleMouseUp, hasClickedValidCellForRangeSelection]);
    var stopAutoScroll = React.useCallback(function () {
        if (autoScrollRAF.current) {
            cancelAnimationFrame(autoScrollRAF.current);
            autoScrollRAF.current = null;
        }
    }, []);
    var handleCellFocusIn = React.useCallback(function (params) {
        cellWithVirtualFocus.current = { id: params.id, field: params.field };
    }, []);
    var startAutoScroll = React.useCallback(function () {
        var _a;
        if (autoScrollRAF.current) {
            return;
        }
        if (!((_a = apiRef.current.virtualScrollerRef) === null || _a === void 0 ? void 0 : _a.current)) {
            return;
        }
        function autoScroll() {
            var _a;
            if (!mousePosition.current || !((_a = apiRef.current.virtualScrollerRef) === null || _a === void 0 ? void 0 : _a.current)) {
                return;
            }
            var dimensions = (0, x_data_grid_pro_1.gridDimensionsSelector)(apiRef);
            var _b = mousePosition.current, mouseX = _b.x, mouseY = _b.y;
            var _c = dimensions.viewportOuterSize, width = _c.width, viewportOuterHeight = _c.height;
            var height = viewportOuterHeight - totalHeaderHeight;
            var deltaX = 0;
            var deltaY = 0;
            var factor = 0;
            if (mouseY <= AUTO_SCROLL_SENSITIVITY && dimensions.hasScrollY) {
                // When scrolling up, the multiplier increases going closer to the top edge
                factor = (AUTO_SCROLL_SENSITIVITY - mouseY) / -AUTO_SCROLL_SENSITIVITY;
                deltaY = AUTO_SCROLL_SPEED;
            }
            else if (mouseY >= height - AUTO_SCROLL_SENSITIVITY && dimensions.hasScrollY) {
                // When scrolling down, the multiplier increases going closer to the bottom edge
                factor = (mouseY - (height - AUTO_SCROLL_SENSITIVITY)) / AUTO_SCROLL_SENSITIVITY;
                deltaY = AUTO_SCROLL_SPEED;
            }
            else if (mouseX <= AUTO_SCROLL_SENSITIVITY && dimensions.hasScrollX) {
                // When scrolling left, the multiplier increases going closer to the left edge
                factor = (AUTO_SCROLL_SENSITIVITY - mouseX) / -AUTO_SCROLL_SENSITIVITY;
                deltaX = AUTO_SCROLL_SPEED;
            }
            else if (mouseX >= width - AUTO_SCROLL_SENSITIVITY && dimensions.hasScrollX) {
                // When scrolling right, the multiplier increases going closer to the right edge
                factor = (mouseX - (width - AUTO_SCROLL_SENSITIVITY)) / AUTO_SCROLL_SENSITIVITY;
                deltaX = AUTO_SCROLL_SPEED;
            }
            if (deltaX !== 0 || deltaY !== 0) {
                var _d = apiRef.current.virtualScrollerRef.current, scrollLeft = _d.scrollLeft, scrollTop = _d.scrollTop;
                apiRef.current.scroll({
                    top: scrollTop + deltaY * factor,
                    left: scrollLeft + deltaX * factor,
                });
            }
            autoScrollRAF.current = requestAnimationFrame(autoScroll);
        }
        autoScroll();
    }, [apiRef, totalHeaderHeight]);
    var handleCellMouseOver = React.useCallback(function (params, event) {
        var _a, _b;
        if (!lastMouseDownCell.current) {
            return;
        }
        var id = params.id, field = params.field;
        apiRef.current.selectCellRange(lastMouseDownCell.current, { id: id, field: field }, event.ctrlKey || event.metaKey);
        var virtualScrollerRect = (_b = (_a = apiRef.current.virtualScrollerRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
        if (!virtualScrollerRect) {
            return;
        }
        var dimensions = (0, x_data_grid_pro_1.gridDimensionsSelector)(apiRef);
        var x = virtualScrollerRect.x, y = virtualScrollerRect.y;
        var _c = dimensions.viewportOuterSize, width = _c.width, viewportOuterHeight = _c.height;
        var height = viewportOuterHeight - totalHeaderHeight;
        var mouseX = event.clientX - x;
        var mouseY = event.clientY - y - totalHeaderHeight;
        mousePosition.current = { x: mouseX, y: mouseY };
        var hasEnteredVerticalSensitivityArea = mouseY <= AUTO_SCROLL_SENSITIVITY || mouseY >= height - AUTO_SCROLL_SENSITIVITY;
        var hasEnteredHorizontalSensitivityArea = mouseX <= AUTO_SCROLL_SENSITIVITY || mouseX >= width - AUTO_SCROLL_SENSITIVITY;
        var hasEnteredSensitivityArea = hasEnteredVerticalSensitivityArea || hasEnteredHorizontalSensitivityArea;
        if (hasEnteredSensitivityArea) {
            // Mouse has entered the sensitity area for the first time
            startAutoScroll();
        }
        else {
            // Mouse has left the sensitivity area while auto scroll is on
            stopAutoScroll();
        }
    }, [apiRef, startAutoScroll, stopAutoScroll, totalHeaderHeight]);
    var handleCellClick = (0, useEventCallback_1.default)(function (params, event) {
        var _a, _b, _c, _d;
        var id = params.id, field = params.field;
        if (!hasClickedValidCellForRangeSelection(params)) {
            return;
        }
        var focusedCell = (0, x_data_grid_pro_1.gridFocusCellSelector)(apiRef);
        if (event.shiftKey && focusedCell) {
            apiRef.current.selectCellRange(focusedCell, { id: id, field: field });
            cellWithVirtualFocus.current = { id: id, field: field };
            return;
        }
        if (event.ctrlKey || event.metaKey) {
            // Add the clicked cell to the selection
            var prevModel = apiRef.current.getCellSelectionModel();
            apiRef.current.setCellSelectionModel(__assign(__assign({}, prevModel), (_a = {}, _a[id] = __assign(__assign({}, prevModel[id]), (_b = {}, _b[field] = !apiRef.current.isCellSelected(id, field), _b)), _a)));
        }
        else {
            // Clear the selection and keep only the clicked cell selected
            apiRef.current.setCellSelectionModel((_c = {}, _c[id] = (_d = {}, _d[field] = true, _d), _c));
        }
    });
    var handleCellKeyDown = (0, useEventCallback_1.default)(function (params, event) {
        if (!(0, internals_1.isNavigationKey)(event.key) || !cellWithVirtualFocus.current) {
            return;
        }
        if (!event.shiftKey) {
            apiRef.current.setCellSelectionModel({});
            return;
        }
        var otherCell = cellWithVirtualFocus.current;
        var endRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(otherCell.id);
        var endColumnIndex = apiRef.current.getColumnIndex(otherCell.field);
        if (event.key === 'ArrowDown') {
            endRowIndex += 1;
        }
        else if (event.key === 'ArrowUp') {
            endRowIndex -= 1;
        }
        else if (event.key === 'ArrowRight') {
            endColumnIndex += 1;
        }
        else if (event.key === 'ArrowLeft') {
            endColumnIndex -= 1;
        }
        var visibleRows = (0, internals_1.getVisibleRows)(apiRef);
        if (endRowIndex < 0 || endRowIndex >= visibleRows.rows.length) {
            return;
        }
        var visibleColumns = apiRef.current.getVisibleColumns();
        if (endColumnIndex < 0 || endColumnIndex >= visibleColumns.length) {
            return;
        }
        cellWithVirtualFocus.current = {
            id: visibleRows.rows[endRowIndex].id,
            field: visibleColumns[endColumnIndex].field,
        };
        apiRef.current.scrollToIndexes({ rowIndex: endRowIndex, colIndex: endColumnIndex });
        var id = params.id, field = params.field;
        apiRef.current.selectCellRange({ id: id, field: field }, cellWithVirtualFocus.current);
    });
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellClick', runIfCellSelectionIsEnabled(handleCellClick));
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellFocusIn', runIfCellSelectionIsEnabled(handleCellFocusIn));
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellKeyDown', runIfCellSelectionIsEnabled(handleCellKeyDown));
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellMouseDown', runIfCellSelectionIsEnabled(handleCellMouseDown));
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellMouseOver', runIfCellSelectionIsEnabled(handleCellMouseOver));
    React.useEffect(function () {
        if (props.cellSelectionModel) {
            apiRef.current.setCellSelectionModel(props.cellSelectionModel);
        }
    }, [apiRef, props.cellSelectionModel]);
    React.useEffect(function () {
        var _a;
        var rootRef = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current;
        return function () {
            stopAutoScroll();
            var document = (0, ownerDocument_1.default)(rootRef);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [apiRef, hasRootReference, handleMouseUp, stopAutoScroll]);
    var checkIfCellIsSelected = React.useCallback(function (isSelected, _a) {
        var id = _a.id, field = _a.field;
        return apiRef.current.isCellSelected(id, field);
    }, [apiRef]);
    var addClassesToCells = React.useCallback(function (classes, _a) {
        var id = _a.id, field = _a.field;
        var visibleRows = (0, internals_1.getVisibleRows)(apiRef);
        if (!visibleRows.range || !apiRef.current.isCellSelected(id, field)) {
            return classes;
        }
        var newClasses = __spreadArray([], classes, true);
        var rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
        var columnIndex = apiRef.current.getColumnIndex(field);
        var visibleColumns = apiRef.current.getVisibleColumns();
        if (rowIndex > 0) {
            var previousRowId = visibleRows.rows[rowIndex - 1].id;
            if (!apiRef.current.isCellSelected(previousRowId, field)) {
                newClasses.push(x_data_grid_pro_1.gridClasses['cell--rangeTop']);
            }
        }
        else {
            newClasses.push(x_data_grid_pro_1.gridClasses['cell--rangeTop']);
        }
        if (rowIndex + visibleRows.range.firstRowIndex < visibleRows.range.lastRowIndex) {
            var nextRowId = visibleRows.rows[rowIndex + 1].id;
            if (!apiRef.current.isCellSelected(nextRowId, field)) {
                newClasses.push(x_data_grid_pro_1.gridClasses['cell--rangeBottom']);
            }
        }
        else {
            newClasses.push(x_data_grid_pro_1.gridClasses['cell--rangeBottom']);
        }
        if (columnIndex > 0) {
            var previousColumnField = visibleColumns[columnIndex - 1].field;
            if (!apiRef.current.isCellSelected(id, previousColumnField)) {
                newClasses.push(x_data_grid_pro_1.gridClasses['cell--rangeLeft']);
            }
        }
        else {
            newClasses.push(x_data_grid_pro_1.gridClasses['cell--rangeLeft']);
        }
        if (columnIndex < visibleColumns.length - 1) {
            var nextColumnField = visibleColumns[columnIndex + 1].field;
            if (!apiRef.current.isCellSelected(id, nextColumnField)) {
                newClasses.push(x_data_grid_pro_1.gridClasses['cell--rangeRight']);
            }
        }
        else {
            newClasses.push(x_data_grid_pro_1.gridClasses['cell--rangeRight']);
        }
        return newClasses;
    }, [apiRef]);
    var canUpdateFocus = React.useCallback(function (initialValue, _a) {
        var event = _a.event, cell = _a.cell;
        if (!cell || !props.cellSelection || !event.shiftKey) {
            return initialValue;
        }
        if (isKeyboardEvent(event)) {
            return (0, internals_1.isNavigationKey)(event.key) ? false : initialValue;
        }
        var focusedCell = (0, x_data_grid_pro_1.gridFocusCellSelector)(apiRef);
        if (hasClickedValidCellForRangeSelection(cell) && focusedCell) {
            return false;
        }
        return initialValue;
    }, [apiRef, props.cellSelection, hasClickedValidCellForRangeSelection]);
    var handleClipboardCopy = React.useCallback(function (value) {
        if (apiRef.current.getSelectedCellsAsArray().length <= 1) {
            return value;
        }
        var sortedRowIds = (0, x_data_grid_pro_1.gridSortedRowIdsSelector)(apiRef);
        var cellSelectionModel = apiRef.current.getCellSelectionModel();
        var unsortedSelectedRowIds = Object.keys(cellSelectionModel);
        var sortedSelectedRowIds = sortedRowIds.filter(function (id) {
            return unsortedSelectedRowIds.includes("".concat(id));
        });
        var copyData = sortedSelectedRowIds.reduce(function (acc, rowId) {
            var fieldsMap = cellSelectionModel[rowId];
            var rowValues = Object.keys(fieldsMap).map(function (field) {
                var cellData;
                if (fieldsMap[field]) {
                    var cellParams = apiRef.current.getCellParams(rowId, field);
                    cellData = (0, internals_1.serializeCellValue)(cellParams, {
                        csvOptions: {
                            delimiter: clipboardCopyCellDelimiter,
                            shouldAppendQuotes: false,
                            escapeFormulas: false,
                        },
                        ignoreValueFormatter: ignoreValueFormatter,
                    });
                }
                else {
                    cellData = '';
                }
                return cellData;
            }, '');
            var rowString = rowValues.join(clipboardCopyCellDelimiter);
            return acc === '' ? rowString : [acc, rowString].join('\r\n');
        }, '');
        return copyData;
    }, [apiRef, ignoreValueFormatter, clipboardCopyCellDelimiter]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'isCellSelected', checkIfCellIsSelected);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'cellClassName', addClassesToCells);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'canUpdateFocus', canUpdateFocus);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'clipboardCopy', handleClipboardCopy);
};
exports.useGridCellSelection = useGridCellSelection;
