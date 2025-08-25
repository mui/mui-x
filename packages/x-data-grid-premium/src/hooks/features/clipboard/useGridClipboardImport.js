"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridClipboardImport = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var warning_1 = require("@mui/x-internals/warning");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var debounce_1 = require("@mui/utils/debounce");
var columnFieldsToExcludeFromPaste = [
    x_data_grid_1.GRID_CHECKBOX_SELECTION_FIELD,
    x_data_grid_pro_1.GRID_REORDER_COL_DEF.field,
    x_data_grid_pro_1.GRID_DETAIL_PANEL_TOGGLE_FIELD,
];
// Batches rows that are updated during clipboard paste to reduce `updateRows` calls
function batchRowUpdates(func, wait) {
    var rows = [];
    var debounced = (0, debounce_1.default)(function () {
        func(rows);
        rows = [];
    }, wait);
    return function (row) {
        rows.push(row);
        debounced();
    };
}
function getTextFromClipboard(rootEl) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var focusedCell = (0, internals_1.getActiveElement)(document);
                    var el = document.createElement('input');
                    el.style.width = '0px';
                    el.style.height = '0px';
                    el.style.border = 'none';
                    el.style.margin = '0';
                    el.style.padding = '0';
                    el.style.outline = 'none';
                    el.style.position = 'absolute';
                    el.style.top = '0';
                    el.style.left = '0';
                    var handlePasteEvent = function (event) {
                        var _a;
                        el.removeEventListener('paste', handlePasteEvent);
                        var text = (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
                        if (focusedCell instanceof HTMLElement) {
                            focusedCell.focus({ preventScroll: true });
                        }
                        el.remove();
                        resolve(text || '');
                    };
                    el.addEventListener('paste', handlePasteEvent);
                    rootEl.appendChild(el);
                    el.focus({ preventScroll: true });
                })];
        });
    });
}
// Keeps track of updated rows during clipboard paste
var CellValueUpdater = /** @class */ (function () {
    function CellValueUpdater(options) {
        this.rowsToUpdate = {};
        this.options = options;
        this.updateRow = batchRowUpdates(options.apiRef.current.updateRows, 50);
    }
    CellValueUpdater.prototype.updateCell = function (_a) {
        var rowId = _a.rowId, field = _a.field, pastedCellValue = _a.pastedCellValue;
        if (pastedCellValue === undefined) {
            return;
        }
        var _b = this.options, apiRef = _b.apiRef, getRowId = _b.getRowId;
        var colDef = apiRef.current.getColumn(field);
        if (!colDef || !colDef.editable) {
            return;
        }
        var row = this.rowsToUpdate[rowId] || __assign({}, apiRef.current.getRow(rowId));
        if (!row) {
            return;
        }
        var parsedValue = pastedCellValue;
        if (colDef.pastedValueParser) {
            parsedValue = colDef.pastedValueParser(pastedCellValue, row, colDef, apiRef);
        }
        else if (colDef.valueParser) {
            parsedValue = colDef.valueParser(parsedValue, row, colDef, apiRef);
        }
        if (parsedValue === undefined) {
            return;
        }
        var rowCopy = __assign({}, row);
        if (typeof colDef.valueSetter === 'function') {
            rowCopy = colDef.valueSetter(parsedValue, rowCopy, colDef, apiRef);
        }
        else {
            rowCopy[field] = parsedValue;
        }
        var newRowId = (0, internals_1.getRowIdFromRowModel)(rowCopy, getRowId);
        if (String(newRowId) !== String(rowId)) {
            // We cannot update row id, so this cell value update should be ignored
            return;
        }
        this.rowsToUpdate[rowId] = rowCopy;
    };
    CellValueUpdater.prototype.applyUpdates = function () {
        var _this = this;
        var _a = this.options, apiRef = _a.apiRef, processRowUpdate = _a.processRowUpdate, onProcessRowUpdateError = _a.onProcessRowUpdateError;
        var rowsToUpdate = this.rowsToUpdate;
        var rowIdsToUpdate = Object.keys(rowsToUpdate);
        if (rowIdsToUpdate.length === 0) {
            apiRef.current.publishEvent('clipboardPasteEnd');
            return;
        }
        var handleRowUpdate = function (rowId) { return __awaiter(_this, void 0, void 0, function () {
            var newRow, handleError, oldRow, finalRowUpdate, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newRow = rowsToUpdate[rowId];
                        if (!(typeof processRowUpdate === 'function')) return [3 /*break*/, 5];
                        handleError = function (errorThrown) {
                            if (onProcessRowUpdateError) {
                                onProcessRowUpdateError(errorThrown);
                            }
                            else if (process.env.NODE_ENV !== 'production') {
                                (0, warning_1.warnOnce)([
                                    'MUI X: A call to `processRowUpdate` threw an error which was not handled because `onProcessRowUpdateError` is missing.',
                                    'To handle the error pass a callback to the `onProcessRowUpdateError` prop, for example `<DataGrid onProcessRowUpdateError={(error) => ...} />`.',
                                    'For more detail, see https://mui.com/x/react-data-grid/editing/persistence/.',
                                ], 'error');
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        oldRow = apiRef.current.getRow(rowId);
                        return [4 /*yield*/, processRowUpdate(newRow, oldRow, { rowId: rowId })];
                    case 2:
                        finalRowUpdate = _a.sent();
                        this.updateRow(finalRowUpdate);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        handleError(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.updateRow(newRow);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        var promises = rowIdsToUpdate.map(function (rowId) {
            // Wrap in promise that always resolves to avoid Promise.all from stopping on first error.
            // This is to avoid using `Promise.allSettled` that has worse browser support.
            return new Promise(function (resolve) {
                handleRowUpdate(rowId).then(resolve).catch(resolve);
            });
        });
        Promise.all(promises).then(function () {
            _this.rowsToUpdate = {};
            apiRef.current.publishEvent('clipboardPasteEnd');
        });
    };
    return CellValueUpdater;
}());
function defaultPasteResolver(_a) {
    var pastedData = _a.pastedData, apiRef = _a.apiRef, updateCell = _a.updateCell, pagination = _a.pagination, paginationMode = _a.paginationMode;
    var isSingleValuePasted = pastedData.length === 1 && pastedData[0].length === 1;
    var cellSelectionModel = apiRef.current.getCellSelectionModel();
    var selectedCellsArray = apiRef.current.getSelectedCellsAsArray();
    if (cellSelectionModel && selectedCellsArray.length > 1) {
        var lastRowId_1 = selectedCellsArray[0].id;
        var rowIndex_1 = 0;
        var colIndex_1 = 0;
        selectedCellsArray.forEach(function (_a) {
            var rowId = _a.id, field = _a.field;
            if (rowId !== lastRowId_1) {
                lastRowId_1 = rowId;
                rowIndex_1 += 1;
                colIndex_1 = 0;
            }
            var rowDataArr = pastedData[isSingleValuePasted ? 0 : rowIndex_1];
            var hasRowData = isSingleValuePasted ? true : rowDataArr !== undefined;
            if (hasRowData) {
                var cellValue = isSingleValuePasted ? rowDataArr[0] : rowDataArr[colIndex_1];
                updateCell({ rowId: rowId, field: field, pastedCellValue: cellValue });
            }
            colIndex_1 += 1;
        });
        return;
    }
    var visibleColumnFields = (0, x_data_grid_1.gridVisibleColumnFieldsSelector)(apiRef).filter(function (field) {
        if (columnFieldsToExcludeFromPaste.includes(field)) {
            return false;
        }
        return true;
    });
    if ((0, x_data_grid_1.gridRowSelectionCountSelector)(apiRef) > 0 && !isSingleValuePasted) {
        // Multiple values are pasted starting from the first and top-most cell
        var pastedRowsDataCount_1 = pastedData.length;
        var selectedRows = (0, x_data_grid_1.gridRowSelectionIdsSelector)(apiRef);
        // There's no guarantee that the selected rows are in the same order as the pasted rows
        selectedRows.forEach(function (row, rowId) {
            var rowData;
            if (pastedRowsDataCount_1 === 1) {
                // If only one row is pasted - paste it to all selected rows
                rowData = pastedData[0];
            }
            else {
                rowData = pastedData.shift();
            }
            if (rowData === undefined) {
                return;
            }
            rowData.forEach(function (newCellValue, cellIndex) {
                updateCell({
                    rowId: rowId,
                    field: visibleColumnFields[cellIndex],
                    pastedCellValue: newCellValue,
                });
            });
        });
        return;
    }
    var selectedCell = (0, x_data_grid_1.gridFocusCellSelector)(apiRef);
    if (!selectedCell && selectedCellsArray.length === 1) {
        selectedCell = selectedCellsArray[0];
    }
    if (!selectedCell) {
        return;
    }
    if (columnFieldsToExcludeFromPaste.includes(selectedCell.field)) {
        return;
    }
    var selectedRowId = selectedCell.id;
    var selectedRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(selectedRowId);
    var visibleRowIds = pagination && paginationMode === 'client'
        ? (0, x_data_grid_1.gridPaginatedVisibleSortedGridRowIdsSelector)(apiRef)
        : (0, x_data_grid_1.gridExpandedSortedRowIdsSelector)(apiRef);
    var selectedFieldIndex = visibleColumnFields.indexOf(selectedCell.field);
    pastedData.forEach(function (rowData, index) {
        var rowId = visibleRowIds[selectedRowIndex + index];
        if (typeof rowId === 'undefined') {
            return;
        }
        for (var i = selectedFieldIndex; i < visibleColumnFields.length; i += 1) {
            var field = visibleColumnFields[i];
            var stringValue = rowData[i - selectedFieldIndex];
            updateCell({ rowId: rowId, field: field, pastedCellValue: stringValue });
        }
    });
}
var useGridClipboardImport = function (apiRef, props) {
    var processRowUpdate = props.processRowUpdate;
    var onProcessRowUpdateError = props.onProcessRowUpdateError;
    var getRowId = props.getRowId;
    var enableClipboardPaste = !props.disableClipboardPaste;
    var logger = (0, internals_1.useGridLogger)(apiRef, 'useGridClipboardImport');
    var clipboardCopyCellDelimiter = props.clipboardCopyCellDelimiter, splitClipboardPastedText = props.splitClipboardPastedText, pagination = props.pagination, paginationMode = props.paginationMode, onBeforeClipboardPasteStart = props.onBeforeClipboardPasteStart;
    var handlePaste = React.useCallback(function (params, event) { return __awaiter(void 0, void 0, void 0, function () {
        var focusedCell, cellMode, rootEl, text, pastedData, error_2, cellUpdater;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!enableClipboardPaste) {
                        return [2 /*return*/];
                    }
                    if (!(0, internals_1.isPasteShortcut)(event)) {
                        return [2 /*return*/];
                    }
                    focusedCell = (0, x_data_grid_1.gridFocusCellSelector)(apiRef);
                    if (focusedCell !== null) {
                        cellMode = apiRef.current.getCellMode(focusedCell.id, focusedCell.field);
                        if (cellMode === 'edit') {
                            // Do not paste data when the cell is in edit mode
                            return [2 /*return*/];
                        }
                    }
                    rootEl = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current;
                    if (!rootEl) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getTextFromClipboard(rootEl)];
                case 1:
                    text = _b.sent();
                    if (!text) {
                        return [2 /*return*/];
                    }
                    pastedData = splitClipboardPastedText(text, clipboardCopyCellDelimiter);
                    if (!pastedData) {
                        return [2 /*return*/];
                    }
                    if (!onBeforeClipboardPasteStart) return [3 /*break*/, 5];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, onBeforeClipboardPasteStart({ data: pastedData })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    logger.debug('Clipboard paste operation cancelled');
                    return [2 /*return*/];
                case 5:
                    cellUpdater = new CellValueUpdater({
                        apiRef: apiRef,
                        processRowUpdate: processRowUpdate,
                        onProcessRowUpdateError: onProcessRowUpdateError,
                        getRowId: getRowId,
                    });
                    apiRef.current.publishEvent('clipboardPasteStart', {
                        data: pastedData,
                    });
                    defaultPasteResolver({
                        pastedData: pastedData,
                        apiRef: (0, internals_1.getPublicApiRef)(apiRef),
                        updateCell: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            cellUpdater.updateCell.apply(cellUpdater, args);
                        },
                        pagination: pagination,
                        paginationMode: paginationMode,
                    });
                    cellUpdater.applyUpdates();
                    return [2 /*return*/];
            }
        });
    }); }, [
        apiRef,
        processRowUpdate,
        onProcessRowUpdateError,
        getRowId,
        enableClipboardPaste,
        splitClipboardPastedText,
        clipboardCopyCellDelimiter,
        pagination,
        paginationMode,
        onBeforeClipboardPasteStart,
        logger,
    ]);
    var checkIfCanStartEditing = React.useCallback(function (initialValue, _a) {
        var event = _a.event;
        if ((0, internals_1.isPasteShortcut)(event) && enableClipboardPaste) {
            // Do not enter cell edit mode on paste
            return false;
        }
        return initialValue;
    }, [enableClipboardPaste]);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'cellKeyDown', handlePaste);
    (0, x_data_grid_1.useGridEventPriority)(apiRef, 'clipboardPasteStart', props.onClipboardPasteStart);
    (0, x_data_grid_1.useGridEventPriority)(apiRef, 'clipboardPasteEnd', props.onClipboardPasteEnd);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'canStartEditing', checkIfCanStartEditing);
};
exports.useGridClipboardImport = useGridClipboardImport;
