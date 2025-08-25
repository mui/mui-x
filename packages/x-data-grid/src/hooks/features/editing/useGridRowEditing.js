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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.useGridRowEditing = void 0;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var warning_1 = require("@mui/x-internals/warning");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var useGridEvent_1 = require("../../utils/useGridEvent");
var gridEditRowModel_1 = require("../../../models/gridEditRowModel");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var gridEditingSelectors_1 = require("./gridEditingSelectors");
var keyboardUtils_1 = require("../../../utils/keyboardUtils");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var utils_1 = require("../../../utils/utils");
var gridRowParams_1 = require("../../../models/params/gridRowParams");
var colDef_1 = require("../../../colDef");
var utils_2 = require("./utils");
var useGridRowEditing = function (apiRef, props) {
    var _a = React.useState({}), rowModesModel = _a[0], setRowModesModel = _a[1];
    var rowModesModelRef = React.useRef(rowModesModel);
    var prevRowModesModel = React.useRef({});
    var prevRowValuesLookup = React.useRef({});
    var focusTimeout = React.useRef(undefined);
    var nextFocusedCell = React.useRef(null);
    var processRowUpdate = props.processRowUpdate, onProcessRowUpdateError = props.onProcessRowUpdateError, rowModesModelProp = props.rowModesModel, onRowModesModelChange = props.onRowModesModelChange;
    var runIfEditModeIsRow = function (callback) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (props.editMode === gridEditRowModel_1.GridEditModes.Row) {
                callback.apply(void 0, args);
            }
        };
    };
    var throwIfNotEditable = React.useCallback(function (id, field) {
        var params = apiRef.current.getCellParams(id, field);
        if (!apiRef.current.isCellEditable(params)) {
            throw new Error("MUI X: The cell with id=".concat(id, " and field=").concat(field, " is not editable."));
        }
    }, [apiRef]);
    var throwIfNotInMode = React.useCallback(function (id, mode) {
        if (apiRef.current.getRowMode(id) !== mode) {
            throw new Error("MUI X: The row with id=".concat(id, " is not in ").concat(mode, " mode."));
        }
    }, [apiRef]);
    var hasFieldsWithErrors = React.useCallback(function (rowId) {
        var editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
        return Object.values(editingState[rowId]).some(function (fieldProps) { return fieldProps.error; });
    }, [apiRef]);
    var handleCellDoubleClick = React.useCallback(function (params, event) {
        if (!params.isEditable) {
            return;
        }
        if (apiRef.current.getRowMode(params.id) === gridEditRowModel_1.GridRowModes.Edit) {
            return;
        }
        var rowParams = apiRef.current.getRowParams(params.id);
        var newParams = __assign(__assign({}, rowParams), { field: params.field, reason: gridRowParams_1.GridRowEditStartReasons.cellDoubleClick });
        apiRef.current.publishEvent('rowEditStart', newParams, event);
    }, [apiRef]);
    var handleCellFocusIn = React.useCallback(function (params) {
        nextFocusedCell.current = params;
    }, []);
    var handleCellFocusOut = React.useCallback(function (params, event) {
        if (!params.isEditable) {
            return;
        }
        if (apiRef.current.getRowMode(params.id) === gridEditRowModel_1.GridRowModes.View) {
            return;
        }
        // The mechanism to detect if we can stop editing a row is different from
        // the cell editing. Instead of triggering it when clicking outside a cell,
        // we must check if another cell in the same row was not clicked. To achieve
        // that, first we keep track of all cells that gained focus. When a cell loses
        // focus we check if the next cell that received focus is from a different row.
        nextFocusedCell.current = null;
        focusTimeout.current = setTimeout(function () {
            var _a;
            if (((_a = nextFocusedCell.current) === null || _a === void 0 ? void 0 : _a.id) !== params.id) {
                // The row might have been deleted during the click
                if (!apiRef.current.getRow(params.id)) {
                    return;
                }
                // The row may already changed its mode
                if (apiRef.current.getRowMode(params.id) === gridEditRowModel_1.GridRowModes.View) {
                    return;
                }
                if (hasFieldsWithErrors(params.id)) {
                    return;
                }
                var rowParams = apiRef.current.getRowParams(params.id);
                var newParams = __assign(__assign({}, rowParams), { field: params.field, reason: gridRowParams_1.GridRowEditStopReasons.rowFocusOut });
                apiRef.current.publishEvent('rowEditStop', newParams, event);
            }
        });
    }, [apiRef, hasFieldsWithErrors]);
    React.useEffect(function () {
        return function () {
            clearTimeout(focusTimeout.current);
        };
    }, []);
    var handleCellKeyDown = React.useCallback(function (params, event) {
        if (params.cellMode === gridEditRowModel_1.GridRowModes.Edit) {
            // Wait until IME is settled for Asian languages like Japanese and Chinese
            // TODO: to replace at one point. See https://github.com/mui/material-ui/pull/39713#discussion_r1381678957.
            if (event.which === 229) {
                return;
            }
            var reason = void 0;
            if (event.key === 'Escape') {
                reason = gridRowParams_1.GridRowEditStopReasons.escapeKeyDown;
            }
            else if (event.key === 'Enter') {
                reason = gridRowParams_1.GridRowEditStopReasons.enterKeyDown;
            }
            else if (event.key === 'Tab') {
                var columnFields = (0, gridColumnsSelector_1.gridVisibleColumnFieldsSelector)(apiRef).filter(function (field) {
                    var column = apiRef.current.getColumn(field);
                    if (column.type === colDef_1.GRID_ACTIONS_COLUMN_TYPE) {
                        return true;
                    }
                    return apiRef.current.isCellEditable(apiRef.current.getCellParams(params.id, field));
                });
                if (event.shiftKey) {
                    if (params.field === columnFields[0]) {
                        // Exit if user pressed Shift+Tab on the first field
                        reason = gridRowParams_1.GridRowEditStopReasons.shiftTabKeyDown;
                    }
                }
                else if (params.field === columnFields[columnFields.length - 1]) {
                    // Exit if user pressed Tab on the last field
                    reason = gridRowParams_1.GridRowEditStopReasons.tabKeyDown;
                }
                // Always prevent going to the next element in the tab sequence because the focus is
                // handled manually to support edit components rendered inside Portals
                event.preventDefault();
                if (!reason) {
                    var index = columnFields.findIndex(function (field) { return field === params.field; });
                    var nextFieldToFocus = columnFields[event.shiftKey ? index - 1 : index + 1];
                    apiRef.current.setCellFocus(params.id, nextFieldToFocus);
                }
            }
            if (reason) {
                if (reason !== gridRowParams_1.GridRowEditStopReasons.escapeKeyDown && hasFieldsWithErrors(params.id)) {
                    return;
                }
                var newParams = __assign(__assign({}, apiRef.current.getRowParams(params.id)), { reason: reason, field: params.field });
                apiRef.current.publishEvent('rowEditStop', newParams, event);
            }
        }
        else if (params.isEditable) {
            var reason = void 0;
            var canStartEditing = apiRef.current.unstable_applyPipeProcessors('canStartEditing', true, { event: event, cellParams: params, editMode: 'row' });
            if (!canStartEditing) {
                return;
            }
            if ((0, keyboardUtils_1.isPrintableKey)(event)) {
                reason = gridRowParams_1.GridRowEditStartReasons.printableKeyDown;
            }
            else if ((0, keyboardUtils_1.isPasteShortcut)(event)) {
                reason = gridRowParams_1.GridRowEditStartReasons.printableKeyDown;
            }
            else if (event.key === 'Enter') {
                reason = gridRowParams_1.GridRowEditStartReasons.enterKeyDown;
            }
            else if (event.key === 'Backspace' || event.key === 'Delete') {
                reason = gridRowParams_1.GridRowEditStartReasons.deleteKeyDown;
            }
            if (reason) {
                var rowParams = apiRef.current.getRowParams(params.id);
                var newParams = __assign(__assign({}, rowParams), { field: params.field, reason: reason });
                apiRef.current.publishEvent('rowEditStart', newParams, event);
            }
        }
    }, [apiRef, hasFieldsWithErrors]);
    var handleRowEditStart = React.useCallback(function (params) {
        var id = params.id, field = params.field, reason = params.reason;
        var startRowEditModeParams = { id: id, fieldToFocus: field };
        if (reason === gridRowParams_1.GridRowEditStartReasons.printableKeyDown ||
            reason === gridRowParams_1.GridRowEditStartReasons.deleteKeyDown) {
            startRowEditModeParams.deleteValue = !!field;
        }
        apiRef.current.startRowEditMode(startRowEditModeParams);
    }, [apiRef]);
    var handleRowEditStop = React.useCallback(function (params) {
        var id = params.id, reason = params.reason, field = params.field;
        apiRef.current.runPendingEditCellValueMutation(id);
        var cellToFocusAfter;
        if (reason === gridRowParams_1.GridRowEditStopReasons.enterKeyDown) {
            cellToFocusAfter = 'below';
        }
        else if (reason === gridRowParams_1.GridRowEditStopReasons.tabKeyDown) {
            cellToFocusAfter = 'right';
        }
        else if (reason === gridRowParams_1.GridRowEditStopReasons.shiftTabKeyDown) {
            cellToFocusAfter = 'left';
        }
        var ignoreModifications = reason === 'escapeKeyDown';
        apiRef.current.stopRowEditMode({ id: id, ignoreModifications: ignoreModifications, field: field, cellToFocusAfter: cellToFocusAfter });
    }, [apiRef]);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellDoubleClick', runIfEditModeIsRow(handleCellDoubleClick));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellFocusIn', runIfEditModeIsRow(handleCellFocusIn));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellFocusOut', runIfEditModeIsRow(handleCellFocusOut));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellKeyDown', runIfEditModeIsRow(handleCellKeyDown));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'rowEditStart', runIfEditModeIsRow(handleRowEditStart));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'rowEditStop', runIfEditModeIsRow(handleRowEditStop));
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'rowEditStart', props.onRowEditStart);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'rowEditStop', props.onRowEditStop);
    var getRowMode = React.useCallback(function (id) {
        var isEditing = (0, gridEditingSelectors_1.gridRowIsEditingSelector)(apiRef, {
            rowId: id,
            editMode: props.editMode,
        });
        return isEditing ? gridEditRowModel_1.GridRowModes.Edit : gridEditRowModel_1.GridRowModes.View;
    }, [apiRef, props.editMode]);
    var updateRowModesModel = (0, useEventCallback_1.default)(function (newModel) {
        var isNewModelDifferentFromProp = newModel !== props.rowModesModel;
        if (onRowModesModelChange && isNewModelDifferentFromProp) {
            onRowModesModelChange(newModel, {
                api: apiRef.current,
            });
        }
        if (props.rowModesModel && isNewModelDifferentFromProp) {
            return; // The prop always win
        }
        setRowModesModel(newModel);
        rowModesModelRef.current = newModel;
        apiRef.current.publishEvent('rowModesModelChange', newModel);
    });
    var updateRowInRowModesModel = React.useCallback(function (id, newProps) {
        var newModel = __assign({}, rowModesModelRef.current);
        if (newProps !== null) {
            newModel[id] = __assign({}, newProps);
        }
        else {
            delete newModel[id];
        }
        updateRowModesModel(newModel);
    }, [updateRowModesModel]);
    var updateOrDeleteRowState = React.useCallback(function (id, newProps) {
        apiRef.current.setState(function (state) {
            var newEditingState = __assign({}, state.editRows);
            if (newProps !== null) {
                newEditingState[id] = newProps;
            }
            else {
                delete newEditingState[id];
            }
            return __assign(__assign({}, state), { editRows: newEditingState });
        });
    }, [apiRef]);
    var updateOrDeleteFieldState = React.useCallback(function (id, field, newProps) {
        apiRef.current.setState(function (state) {
            var _a;
            var newEditingState = __assign({}, state.editRows);
            if (newProps !== null) {
                newEditingState[id] = __assign(__assign({}, newEditingState[id]), (_a = {}, _a[field] = __assign({}, newProps), _a));
            }
            else {
                delete newEditingState[id][field];
                if (Object.keys(newEditingState[id]).length === 0) {
                    delete newEditingState[id];
                }
            }
            return __assign(__assign({}, state), { editRows: newEditingState });
        });
    }, [apiRef]);
    var startRowEditMode = React.useCallback(function (params) {
        var id = params.id, other = __rest(params, ["id"]);
        throwIfNotInMode(id, gridEditRowModel_1.GridRowModes.View);
        updateRowInRowModesModel(id, __assign({ mode: gridEditRowModel_1.GridRowModes.Edit }, other));
    }, [throwIfNotInMode, updateRowInRowModesModel]);
    var updateStateToStartRowEditMode = (0, useEventCallback_1.default)(function (params) {
        var id = params.id, fieldToFocus = params.fieldToFocus, deleteValue = params.deleteValue, initialValue = params.initialValue;
        var row = apiRef.current.getRow(id);
        var columns = (0, gridColumnsSelector_1.gridColumnDefinitionsSelector)(apiRef);
        var newProps = columns.reduce(function (acc, col) {
            var field = col.field;
            var cellParams = apiRef.current.getCellParams(id, field);
            if (!cellParams.isEditable) {
                return acc;
            }
            var column = apiRef.current.getColumn(field);
            var newValue = apiRef.current.getCellValue(id, field);
            if (fieldToFocus === field && (deleteValue || initialValue)) {
                if (deleteValue) {
                    newValue = (0, utils_2.getDefaultCellValue)(column);
                }
                else if (initialValue) {
                    newValue = initialValue;
                }
            }
            acc[field] = {
                value: newValue,
                error: false,
                isProcessingProps: column.editable && !!column.preProcessEditCellProps && deleteValue,
            };
            return acc;
        }, {});
        prevRowValuesLookup.current[id] = row;
        updateOrDeleteRowState(id, newProps);
        if (fieldToFocus) {
            apiRef.current.setCellFocus(id, fieldToFocus);
        }
        columns
            .filter(function (column) {
            var isCellEditable = apiRef.current.getCellParams(id, column.field).isEditable;
            return (isCellEditable && column.editable && !!column.preProcessEditCellProps && deleteValue);
        })
            .forEach(function (column) {
            var field = column.field;
            var value = apiRef.current.getCellValue(id, field);
            var newValue = deleteValue ? (0, utils_2.getDefaultCellValue)(column) : (initialValue !== null && initialValue !== void 0 ? initialValue : value);
            Promise.resolve(column.preProcessEditCellProps({
                id: id,
                row: row,
                props: newProps[field],
                hasChanged: newValue !== value,
            })).then(function (processedProps) {
                // Check if still in edit mode before updating
                if (apiRef.current.getRowMode(id) === gridEditRowModel_1.GridRowModes.Edit) {
                    var editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
                    updateOrDeleteFieldState(id, field, __assign(__assign({}, processedProps), { value: editingState[id][field].value, isProcessingProps: false }));
                }
            });
        });
    });
    var stopRowEditMode = React.useCallback(function (params) {
        var id = params.id, other = __rest(params, ["id"]);
        throwIfNotInMode(id, gridEditRowModel_1.GridRowModes.Edit);
        updateRowInRowModesModel(id, __assign({ mode: gridEditRowModel_1.GridRowModes.View }, other));
    }, [throwIfNotInMode, updateRowInRowModesModel]);
    var updateStateToStopRowEditMode = (0, useEventCallback_1.default)(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var id, ignoreModifications, focusedField, _a, cellToFocusAfter, finishRowEditMode, editingState, row, isSomeFieldProcessingProps, rowUpdate, handleError, updateRowParams, _b, handleError;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    id = params.id, ignoreModifications = params.ignoreModifications, focusedField = params.field, _a = params.cellToFocusAfter, cellToFocusAfter = _a === void 0 ? 'none' : _a;
                    apiRef.current.runPendingEditCellValueMutation(id);
                    finishRowEditMode = function () {
                        if (cellToFocusAfter !== 'none' && focusedField) {
                            apiRef.current.moveFocusToRelativeCell(id, focusedField, cellToFocusAfter);
                        }
                        updateOrDeleteRowState(id, null);
                        updateRowInRowModesModel(id, null);
                        delete prevRowValuesLookup.current[id];
                    };
                    if (ignoreModifications) {
                        finishRowEditMode();
                        return [2 /*return*/];
                    }
                    editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
                    row = prevRowValuesLookup.current[id];
                    isSomeFieldProcessingProps = Object.values(editingState[id]).some(function (fieldProps) { return fieldProps.isProcessingProps; });
                    if (isSomeFieldProcessingProps) {
                        prevRowModesModel.current[id].mode = gridEditRowModel_1.GridRowModes.Edit;
                        return [2 /*return*/];
                    }
                    if (hasFieldsWithErrors(id)) {
                        prevRowModesModel.current[id].mode = gridEditRowModel_1.GridRowModes.Edit;
                        // Revert the mode in the rowModesModel prop back to "edit"
                        updateRowInRowModesModel(id, { mode: gridEditRowModel_1.GridRowModes.Edit });
                        return [2 /*return*/];
                    }
                    rowUpdate = apiRef.current.getRowWithUpdatedValuesFromRowEditing(id);
                    if (!((_c = props.dataSource) === null || _c === void 0 ? void 0 : _c.updateRow)) return [3 /*break*/, 5];
                    if ((0, isDeepEqual_1.isDeepEqual)(row, rowUpdate)) {
                        finishRowEditMode();
                        return [2 /*return*/];
                    }
                    handleError = function () {
                        prevRowModesModel.current[id].mode = gridEditRowModel_1.GridRowModes.Edit;
                        // Revert the mode in the rowModesModel prop back to "edit"
                        updateRowInRowModesModel(id, { mode: gridEditRowModel_1.GridRowModes.Edit });
                    };
                    updateRowParams = {
                        rowId: id,
                        updatedRow: rowUpdate,
                        previousRow: row,
                    };
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, apiRef.current.dataSource.editRow(updateRowParams)];
                case 2:
                    _d.sent();
                    finishRowEditMode();
                    return [3 /*break*/, 4];
                case 3:
                    _b = _d.sent();
                    handleError();
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    if (processRowUpdate) {
                        handleError = function (errorThrown) {
                            // The row might have been deleted
                            if (prevRowModesModel.current[id]) {
                                prevRowModesModel.current[id].mode = gridEditRowModel_1.GridRowModes.Edit;
                                // Revert the mode in the rowModesModel prop back to "edit"
                                updateRowInRowModesModel(id, { mode: gridEditRowModel_1.GridRowModes.Edit });
                            }
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
                        try {
                            Promise.resolve(processRowUpdate(rowUpdate, row, { rowId: id }))
                                .then(function (finalRowUpdate) {
                                apiRef.current.updateRows([finalRowUpdate]);
                                finishRowEditMode();
                            })
                                .catch(handleError);
                        }
                        catch (errorThrown) {
                            handleError(errorThrown);
                        }
                    }
                    else {
                        apiRef.current.updateRows([rowUpdate]);
                        finishRowEditMode();
                    }
                    _d.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); });
    var setRowEditingEditCellValue = React.useCallback(function (params) {
        var id = params.id, field = params.field, value = params.value, debounceMs = params.debounceMs, skipValueParser = params.unstable_skipValueParser;
        throwIfNotEditable(id, field);
        var column = apiRef.current.getColumn(field);
        var row = apiRef.current.getRow(id);
        var parsedValue = value;
        if (column.valueParser && !skipValueParser) {
            parsedValue = column.valueParser(value, row, column, apiRef);
        }
        var editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
        var newProps = __assign(__assign({}, editingState[id][field]), { value: parsedValue, changeReason: debounceMs ? 'debouncedSetEditCellValue' : 'setEditCellValue' });
        if (!column.preProcessEditCellProps) {
            updateOrDeleteFieldState(id, field, newProps);
        }
        return new Promise(function (resolve) {
            var promises = [];
            if (column.preProcessEditCellProps) {
                var hasChanged = newProps.value !== editingState[id][field].value;
                newProps = __assign(__assign({}, newProps), { isProcessingProps: true });
                updateOrDeleteFieldState(id, field, newProps);
                var _a = editingState[id], _b = field, ignoredField = _a[_b], otherFieldsProps = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                var promise = Promise.resolve(column.preProcessEditCellProps({
                    id: id,
                    row: row,
                    props: newProps,
                    hasChanged: hasChanged,
                    otherFieldsProps: otherFieldsProps,
                })).then(function (processedProps) {
                    // Check again if the row is in edit mode because the user may have
                    // discarded the changes while the props were being processed.
                    if (apiRef.current.getRowMode(id) === gridEditRowModel_1.GridRowModes.View) {
                        resolve(false);
                        return;
                    }
                    editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
                    processedProps = __assign(__assign({}, processedProps), { isProcessingProps: false });
                    // We don't reuse the value from the props pre-processing because when the
                    // promise resolves it may be already outdated. The only exception to this rule
                    // is when there's no pre-processing.
                    processedProps.value = column.preProcessEditCellProps
                        ? editingState[id][field].value
                        : parsedValue;
                    updateOrDeleteFieldState(id, field, processedProps);
                });
                promises.push(promise);
            }
            Object.entries(editingState[id]).forEach(function (_a) {
                var thisField = _a[0], fieldProps = _a[1];
                if (thisField === field) {
                    return;
                }
                var fieldColumn = apiRef.current.getColumn(thisField);
                if (!fieldColumn.preProcessEditCellProps) {
                    return;
                }
                fieldProps = __assign(__assign({}, fieldProps), { isProcessingProps: true });
                updateOrDeleteFieldState(id, thisField, fieldProps);
                editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
                var _b = editingState[id], _c = thisField, ignoredField = _b[_c], otherFieldsProps = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""]);
                var promise = Promise.resolve(fieldColumn.preProcessEditCellProps({
                    id: id,
                    row: row,
                    props: fieldProps,
                    hasChanged: false,
                    otherFieldsProps: otherFieldsProps,
                })).then(function (processedProps) {
                    // Check again if the row is in edit mode because the user may have
                    // discarded the changes while the props were being processed.
                    if (apiRef.current.getRowMode(id) === gridEditRowModel_1.GridRowModes.View) {
                        resolve(false);
                        return;
                    }
                    processedProps = __assign(__assign({}, processedProps), { isProcessingProps: false });
                    updateOrDeleteFieldState(id, thisField, processedProps);
                });
                promises.push(promise);
            });
            Promise.all(promises).then(function () {
                if (apiRef.current.getRowMode(id) === gridEditRowModel_1.GridRowModes.Edit) {
                    editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
                    resolve(!editingState[id][field].error);
                }
                else {
                    resolve(false);
                }
            });
        });
    }, [apiRef, throwIfNotEditable, updateOrDeleteFieldState]);
    var getRowWithUpdatedValuesFromRowEditing = React.useCallback(function (id) {
        var editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
        var row = apiRef.current.getRow(id);
        if (!editingState[id]) {
            return apiRef.current.getRow(id);
        }
        var rowUpdate = __assign(__assign({}, prevRowValuesLookup.current[id]), row);
        Object.entries(editingState[id]).forEach(function (_a) {
            var field = _a[0], fieldProps = _a[1];
            var column = apiRef.current.getColumn(field);
            // Column might have been removed
            // see https://github.com/mui/mui-x/pull/16888
            if (column === null || column === void 0 ? void 0 : column.valueSetter) {
                rowUpdate = column.valueSetter(fieldProps.value, rowUpdate, column, apiRef);
            }
            else {
                rowUpdate[field] = fieldProps.value;
            }
        });
        return rowUpdate;
    }, [apiRef]);
    var editingApi = {
        getRowMode: getRowMode,
        startRowEditMode: startRowEditMode,
        stopRowEditMode: stopRowEditMode,
    };
    var editingPrivateApi = {
        setRowEditingEditCellValue: setRowEditingEditCellValue,
        getRowWithUpdatedValuesFromRowEditing: getRowWithUpdatedValuesFromRowEditing,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, editingApi, 'public');
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, editingPrivateApi, 'private');
    React.useEffect(function () {
        if (rowModesModelProp) {
            updateRowModesModel(rowModesModelProp);
        }
    }, [rowModesModelProp, updateRowModesModel]);
    // Run this effect synchronously so that the keyboard event can impact the yet-to-be-rendered input.
    (0, useEnhancedEffect_1.default)(function () {
        var rowsLookup = (0, gridRowsSelector_1.gridRowsLookupSelector)(apiRef);
        // Update the ref here because updateStateToStopRowEditMode may change it later
        var copyOfPrevRowModesModel = prevRowModesModel.current;
        prevRowModesModel.current = (0, utils_1.deepClone)(rowModesModel); // Do a deep-clone because the attributes might be changed later
        var ids = new Set(__spreadArray(__spreadArray([], Object.keys(rowModesModel), true), Object.keys(copyOfPrevRowModesModel), true));
        Array.from(ids).forEach(function (id) {
            var _a, _b;
            var params = (_a = rowModesModel[id]) !== null && _a !== void 0 ? _a : { mode: gridEditRowModel_1.GridRowModes.View };
            var prevMode = ((_b = copyOfPrevRowModesModel[id]) === null || _b === void 0 ? void 0 : _b.mode) || gridEditRowModel_1.GridRowModes.View;
            var originalId = rowsLookup[id] ? apiRef.current.getRowId(rowsLookup[id]) : id;
            if (params.mode === gridEditRowModel_1.GridRowModes.Edit && prevMode === gridEditRowModel_1.GridRowModes.View) {
                updateStateToStartRowEditMode(__assign({ id: originalId }, params));
            }
            else if (params.mode === gridEditRowModel_1.GridRowModes.View && prevMode === gridEditRowModel_1.GridRowModes.Edit) {
                updateStateToStopRowEditMode(__assign({ id: originalId }, params));
            }
        });
    }, [apiRef, rowModesModel, updateStateToStartRowEditMode, updateStateToStopRowEditMode]);
};
exports.useGridRowEditing = useGridRowEditing;
