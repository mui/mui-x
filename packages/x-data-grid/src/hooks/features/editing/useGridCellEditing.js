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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridCellEditing = void 0;
var React = require("react");
var warning_1 = require("@mui/x-internals/warning");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var useGridEvent_1 = require("../../utils/useGridEvent");
var gridEditRowModel_1 = require("../../../models/gridEditRowModel");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var gridEditingSelectors_1 = require("./gridEditingSelectors");
var keyboardUtils_1 = require("../../../utils/keyboardUtils");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var utils_1 = require("../../../utils/utils");
var gridEditCellParams_1 = require("../../../models/params/gridEditCellParams");
var utils_2 = require("./utils");
var useGridCellEditing = function (apiRef, props) {
    var _a = React.useState({}), cellModesModel = _a[0], setCellModesModel = _a[1];
    var cellModesModelRef = React.useRef(cellModesModel);
    var prevCellModesModel = React.useRef({});
    var processRowUpdate = props.processRowUpdate, onProcessRowUpdateError = props.onProcessRowUpdateError, cellModesModelProp = props.cellModesModel, onCellModesModelChange = props.onCellModesModelChange;
    var runIfEditModeIsCell = function (callback) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (props.editMode === gridEditRowModel_1.GridEditModes.Cell) {
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
    var throwIfNotInMode = React.useCallback(function (id, field, mode) {
        if (apiRef.current.getCellMode(id, field) !== mode) {
            throw new Error("MUI X: The cell with id=".concat(id, " and field=").concat(field, " is not in ").concat(mode, " mode."));
        }
    }, [apiRef]);
    var handleCellDoubleClick = React.useCallback(function (params, event) {
        if (!params.isEditable) {
            return;
        }
        if (params.cellMode === gridEditRowModel_1.GridCellModes.Edit) {
            return;
        }
        var newParams = __assign(__assign({}, params), { reason: gridEditCellParams_1.GridCellEditStartReasons.cellDoubleClick });
        apiRef.current.publishEvent('cellEditStart', newParams, event);
    }, [apiRef]);
    var handleCellFocusOut = React.useCallback(function (params, event) {
        if (params.cellMode === gridEditRowModel_1.GridCellModes.View) {
            return;
        }
        if (apiRef.current.getCellMode(params.id, params.field) === gridEditRowModel_1.GridCellModes.View) {
            return;
        }
        var newParams = __assign(__assign({}, params), { reason: gridEditCellParams_1.GridCellEditStopReasons.cellFocusOut });
        apiRef.current.publishEvent('cellEditStop', newParams, event);
    }, [apiRef]);
    var handleCellKeyDown = React.useCallback(function (params, event) {
        if (params.cellMode === gridEditRowModel_1.GridCellModes.Edit) {
            // Wait until IME is settled for Asian languages like Japanese and Chinese
            // TODO: to replace at one point. See https://github.com/mui/material-ui/pull/39713#discussion_r1381678957.
            if (event.which === 229) {
                return;
            }
            var reason = void 0;
            if (event.key === 'Escape') {
                reason = gridEditCellParams_1.GridCellEditStopReasons.escapeKeyDown;
            }
            else if (event.key === 'Enter') {
                reason = gridEditCellParams_1.GridCellEditStopReasons.enterKeyDown;
            }
            else if (event.key === 'Tab') {
                reason = event.shiftKey
                    ? gridEditCellParams_1.GridCellEditStopReasons.shiftTabKeyDown
                    : gridEditCellParams_1.GridCellEditStopReasons.tabKeyDown;
                event.preventDefault(); // Prevent going to the next element in the tab sequence
            }
            if (reason) {
                var newParams = __assign(__assign({}, params), { reason: reason });
                apiRef.current.publishEvent('cellEditStop', newParams, event);
            }
        }
        else if (params.isEditable) {
            var reason = void 0;
            var canStartEditing = apiRef.current.unstable_applyPipeProcessors('canStartEditing', true, { event: event, cellParams: params, editMode: 'cell' });
            if (!canStartEditing) {
                return;
            }
            if ((0, keyboardUtils_1.isPrintableKey)(event)) {
                reason = gridEditCellParams_1.GridCellEditStartReasons.printableKeyDown;
            }
            else if ((0, keyboardUtils_1.isPasteShortcut)(event)) {
                reason = gridEditCellParams_1.GridCellEditStartReasons.pasteKeyDown;
            }
            else if (event.key === 'Enter') {
                reason = gridEditCellParams_1.GridCellEditStartReasons.enterKeyDown;
            }
            else if (event.key === 'Backspace' || event.key === 'Delete') {
                reason = gridEditCellParams_1.GridCellEditStartReasons.deleteKeyDown;
            }
            if (reason) {
                var newParams = __assign(__assign({}, params), { reason: reason, key: event.key });
                apiRef.current.publishEvent('cellEditStart', newParams, event);
            }
        }
    }, [apiRef]);
    var handleCellEditStart = React.useCallback(function (params) {
        var id = params.id, field = params.field, reason = params.reason;
        var startCellEditModeParams = { id: id, field: field };
        if (reason === gridEditCellParams_1.GridCellEditStartReasons.printableKeyDown ||
            reason === gridEditCellParams_1.GridCellEditStartReasons.deleteKeyDown ||
            reason === gridEditCellParams_1.GridCellEditStartReasons.pasteKeyDown) {
            startCellEditModeParams.deleteValue = true;
        }
        apiRef.current.startCellEditMode(startCellEditModeParams);
    }, [apiRef]);
    var handleCellEditStop = React.useCallback(function (params) {
        var id = params.id, field = params.field, reason = params.reason;
        apiRef.current.runPendingEditCellValueMutation(id, field);
        var cellToFocusAfter;
        if (reason === gridEditCellParams_1.GridCellEditStopReasons.enterKeyDown) {
            cellToFocusAfter = 'below';
        }
        else if (reason === gridEditCellParams_1.GridCellEditStopReasons.tabKeyDown) {
            cellToFocusAfter = 'right';
        }
        else if (reason === gridEditCellParams_1.GridCellEditStopReasons.shiftTabKeyDown) {
            cellToFocusAfter = 'left';
        }
        var ignoreModifications = reason === 'escapeKeyDown';
        apiRef.current.stopCellEditMode({
            id: id,
            field: field,
            ignoreModifications: ignoreModifications,
            cellToFocusAfter: cellToFocusAfter,
        });
    }, [apiRef]);
    var runIfNoFieldErrors = function (callback) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(void 0, void 0, void 0, function () {
                var _a, id, field, editRowsState, hasFieldErrors;
                var _b;
                return __generator(this, function (_c) {
                    if (callback) {
                        _a = args[0], id = _a.id, field = _a.field;
                        editRowsState = apiRef.current.state.editRows;
                        hasFieldErrors = (_b = editRowsState[id][field]) === null || _b === void 0 ? void 0 : _b.error;
                        if (!hasFieldErrors) {
                            callback.apply(void 0, args);
                        }
                    }
                    return [2 /*return*/];
                });
            });
        };
    };
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellDoubleClick', runIfEditModeIsCell(handleCellDoubleClick));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellFocusOut', runIfEditModeIsCell(handleCellFocusOut));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellKeyDown', runIfEditModeIsCell(handleCellKeyDown));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellEditStart', runIfEditModeIsCell(handleCellEditStart));
    (0, useGridEvent_1.useGridEvent)(apiRef, 'cellEditStop', runIfEditModeIsCell(handleCellEditStop));
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'cellEditStart', props.onCellEditStart);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'cellEditStop', runIfNoFieldErrors(props.onCellEditStop));
    var getCellMode = React.useCallback(function (id, field) {
        var editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
        var isEditing = editingState[id] && editingState[id][field];
        return isEditing ? gridEditRowModel_1.GridCellModes.Edit : gridEditRowModel_1.GridCellModes.View;
    }, [apiRef]);
    var updateCellModesModel = (0, useEventCallback_1.default)(function (newModel) {
        var isNewModelDifferentFromProp = newModel !== props.cellModesModel;
        if (onCellModesModelChange && isNewModelDifferentFromProp) {
            onCellModesModelChange(newModel, {
                api: apiRef.current,
            });
        }
        if (props.cellModesModel && isNewModelDifferentFromProp) {
            return; // The prop always win
        }
        setCellModesModel(newModel);
        cellModesModelRef.current = newModel;
        apiRef.current.publishEvent('cellModesModelChange', newModel);
    });
    var updateFieldInCellModesModel = React.useCallback(function (id, field, newProps) {
        var _a;
        // We use the ref because it always contain the up-to-date value, different from the state
        // that needs a rerender to reflect the new value
        var newModel = __assign({}, cellModesModelRef.current);
        if (newProps !== null) {
            newModel[id] = __assign(__assign({}, newModel[id]), (_a = {}, _a[field] = __assign({}, newProps), _a));
        }
        else {
            var _b = newModel[id], _c = field, fieldToRemove = _b[_c], otherFields = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""]); // Ensure that we have a new object, not a reference
            newModel[id] = otherFields;
            if (Object.keys(newModel[id]).length === 0) {
                delete newModel[id];
            }
        }
        updateCellModesModel(newModel);
    }, [updateCellModesModel]);
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
    var startCellEditMode = React.useCallback(function (params) {
        var id = params.id, field = params.field, other = __rest(params, ["id", "field"]);
        throwIfNotEditable(id, field);
        throwIfNotInMode(id, field, gridEditRowModel_1.GridCellModes.View);
        updateFieldInCellModesModel(id, field, __assign({ mode: gridEditRowModel_1.GridCellModes.Edit }, other));
    }, [throwIfNotEditable, throwIfNotInMode, updateFieldInCellModesModel]);
    var updateStateToStartCellEditMode = (0, useEventCallback_1.default)(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var id, field, deleteValue, initialValue, value, newValue, column, shouldProcessEditCellProps, newProps, editingState;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = params.id, field = params.field, deleteValue = params.deleteValue, initialValue = params.initialValue;
                    value = apiRef.current.getCellValue(id, field);
                    newValue = value;
                    if (deleteValue) {
                        newValue = (0, utils_2.getDefaultCellValue)(apiRef.current.getColumn(field));
                    }
                    else if (initialValue) {
                        newValue = initialValue;
                    }
                    column = apiRef.current.getColumn(field);
                    shouldProcessEditCellProps = !!column.preProcessEditCellProps && deleteValue;
                    newProps = {
                        value: newValue,
                        error: false,
                        isProcessingProps: shouldProcessEditCellProps,
                    };
                    updateOrDeleteFieldState(id, field, newProps);
                    apiRef.current.setCellFocus(id, field);
                    if (!shouldProcessEditCellProps) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve(column.preProcessEditCellProps({
                            id: id,
                            row: apiRef.current.getRow(id),
                            props: newProps,
                            hasChanged: newValue !== value,
                        }))];
                case 1:
                    newProps = _a.sent();
                    // Check if still in edit mode before updating
                    if (apiRef.current.getCellMode(id, field) === gridEditRowModel_1.GridCellModes.Edit) {
                        editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
                        updateOrDeleteFieldState(id, field, __assign(__assign({}, newProps), { value: editingState[id][field].value, isProcessingProps: false }));
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    var stopCellEditMode = React.useCallback(function (params) {
        var id = params.id, field = params.field, other = __rest(params, ["id", "field"]);
        throwIfNotInMode(id, field, gridEditRowModel_1.GridCellModes.Edit);
        updateFieldInCellModesModel(id, field, __assign({ mode: gridEditRowModel_1.GridCellModes.View }, other));
    }, [throwIfNotInMode, updateFieldInCellModesModel]);
    var updateStateToStopCellEditMode = (0, useEventCallback_1.default)(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var id, field, ignoreModifications, _a, cellToFocusAfter, finishCellEditMode, editingState, _b, error, isProcessingProps, row, rowUpdate, handleError, updateRowParams, _c, handleError;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    id = params.id, field = params.field, ignoreModifications = params.ignoreModifications, _a = params.cellToFocusAfter, cellToFocusAfter = _a === void 0 ? 'none' : _a;
                    throwIfNotInMode(id, field, gridEditRowModel_1.GridCellModes.Edit);
                    apiRef.current.runPendingEditCellValueMutation(id, field);
                    finishCellEditMode = function () {
                        updateOrDeleteFieldState(id, field, null);
                        updateFieldInCellModesModel(id, field, null);
                        if (cellToFocusAfter !== 'none') {
                            apiRef.current.moveFocusToRelativeCell(id, field, cellToFocusAfter);
                        }
                    };
                    if (ignoreModifications) {
                        finishCellEditMode();
                        return [2 /*return*/];
                    }
                    editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
                    _b = editingState[id][field], error = _b.error, isProcessingProps = _b.isProcessingProps;
                    row = apiRef.current.getRow(id);
                    if (error || isProcessingProps) {
                        // Attempt to change cell mode to "view" was not successful
                        // Update previous mode to allow another attempt
                        prevCellModesModel.current[id][field].mode = gridEditRowModel_1.GridCellModes.Edit;
                        // Revert the mode in the cellModesModel prop back to "edit"
                        updateFieldInCellModesModel(id, field, { mode: gridEditRowModel_1.GridCellModes.Edit });
                        return [2 /*return*/];
                    }
                    rowUpdate = apiRef.current.getRowWithUpdatedValuesFromCellEditing(id, field);
                    if (!((_d = props.dataSource) === null || _d === void 0 ? void 0 : _d.updateRow)) return [3 /*break*/, 5];
                    if ((0, isDeepEqual_1.isDeepEqual)(row, rowUpdate)) {
                        finishCellEditMode();
                        return [2 /*return*/];
                    }
                    handleError = function () {
                        prevCellModesModel.current[id][field].mode = gridEditRowModel_1.GridCellModes.Edit;
                        // Revert the mode in the cellModesModel prop back to "edit"
                        updateFieldInCellModesModel(id, field, { mode: gridEditRowModel_1.GridCellModes.Edit });
                    };
                    updateRowParams = {
                        rowId: id,
                        updatedRow: rowUpdate,
                        previousRow: row,
                    };
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, apiRef.current.dataSource.editRow(updateRowParams)];
                case 2:
                    _e.sent();
                    finishCellEditMode();
                    return [3 /*break*/, 4];
                case 3:
                    _c = _e.sent();
                    handleError();
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    if (processRowUpdate) {
                        handleError = function (errorThrown) {
                            prevCellModesModel.current[id][field].mode = gridEditRowModel_1.GridCellModes.Edit;
                            // Revert the mode in the cellModesModel prop back to "edit"
                            updateFieldInCellModesModel(id, field, { mode: gridEditRowModel_1.GridCellModes.Edit });
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
                                finishCellEditMode();
                            })
                                .catch(handleError);
                        }
                        catch (errorThrown) {
                            handleError(errorThrown);
                        }
                    }
                    else {
                        apiRef.current.updateRows([rowUpdate]);
                        finishCellEditMode();
                    }
                    _e.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); });
    var setCellEditingEditCellValue = React.useCallback(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var id, field, value, debounceMs, skipValueParser, column, row, parsedValue, editingState, newProps, hasChanged;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = params.id, field = params.field, value = params.value, debounceMs = params.debounceMs, skipValueParser = params.unstable_skipValueParser;
                    throwIfNotEditable(id, field);
                    throwIfNotInMode(id, field, gridEditRowModel_1.GridCellModes.Edit);
                    column = apiRef.current.getColumn(field);
                    row = apiRef.current.getRow(id);
                    parsedValue = value;
                    if (column.valueParser && !skipValueParser) {
                        parsedValue = column.valueParser(value, row, column, apiRef);
                    }
                    editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
                    newProps = __assign(__assign({}, editingState[id][field]), { value: parsedValue, changeReason: debounceMs ? 'debouncedSetEditCellValue' : 'setEditCellValue' });
                    if (!column.preProcessEditCellProps) return [3 /*break*/, 2];
                    hasChanged = value !== editingState[id][field].value;
                    newProps = __assign(__assign({}, newProps), { isProcessingProps: true });
                    updateOrDeleteFieldState(id, field, newProps);
                    return [4 /*yield*/, Promise.resolve(column.preProcessEditCellProps({ id: id, row: row, props: newProps, hasChanged: hasChanged }))];
                case 1:
                    newProps = _c.sent();
                    _c.label = 2;
                case 2:
                    // Check again if the cell is in edit mode because the user may have
                    // discarded the changes while the props were being processed.
                    if (apiRef.current.getCellMode(id, field) === gridEditRowModel_1.GridCellModes.View) {
                        return [2 /*return*/, false];
                    }
                    editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
                    newProps = __assign(__assign({}, newProps), { isProcessingProps: false });
                    // We don't update the value with the one coming from the props pre-processing
                    // because when the promise resolves it may be already outdated. The only
                    // exception to this rule is when there's no pre-processing.
                    newProps.value = column.preProcessEditCellProps ? editingState[id][field].value : parsedValue;
                    updateOrDeleteFieldState(id, field, newProps);
                    editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
                    return [2 /*return*/, !((_b = (_a = editingState[id]) === null || _a === void 0 ? void 0 : _a[field]) === null || _b === void 0 ? void 0 : _b.error)];
            }
        });
    }); }, [apiRef, throwIfNotEditable, throwIfNotInMode, updateOrDeleteFieldState]);
    var getRowWithUpdatedValuesFromCellEditing = React.useCallback(function (id, field) {
        var _a;
        var column = apiRef.current.getColumn(field);
        var editingState = (0, gridEditingSelectors_1.gridEditRowsStateSelector)(apiRef);
        var row = apiRef.current.getRow(id);
        if (!editingState[id] || !editingState[id][field]) {
            return apiRef.current.getRow(id);
        }
        var value = editingState[id][field].value;
        return column.valueSetter
            ? column.valueSetter(value, row, column, apiRef)
            : __assign(__assign({}, row), (_a = {}, _a[field] = value, _a));
    }, [apiRef]);
    var editingApi = {
        getCellMode: getCellMode,
        startCellEditMode: startCellEditMode,
        stopCellEditMode: stopCellEditMode,
    };
    var editingPrivateApi = {
        setCellEditingEditCellValue: setCellEditingEditCellValue,
        getRowWithUpdatedValuesFromCellEditing: getRowWithUpdatedValuesFromCellEditing,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, editingApi, 'public');
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, editingPrivateApi, 'private');
    React.useEffect(function () {
        if (cellModesModelProp) {
            updateCellModesModel(cellModesModelProp);
        }
    }, [cellModesModelProp, updateCellModesModel]);
    // Run this effect synchronously so that the keyboard event can impact the yet-to-be-rendered input.
    (0, useEnhancedEffect_1.default)(function () {
        var rowsLookup = (0, gridRowsSelector_1.gridRowsLookupSelector)(apiRef);
        // Update the ref here because updateStateToStopCellEditMode may change it later
        var copyOfPrevCellModes = prevCellModesModel.current;
        prevCellModesModel.current = (0, utils_1.deepClone)(cellModesModel); // Do a deep-clone because the attributes might be changed later
        Object.entries(cellModesModel).forEach(function (_a) {
            var id = _a[0], fields = _a[1];
            Object.entries(fields).forEach(function (_a) {
                var _b, _c;
                var field = _a[0], params = _a[1];
                var prevMode = ((_c = (_b = copyOfPrevCellModes[id]) === null || _b === void 0 ? void 0 : _b[field]) === null || _c === void 0 ? void 0 : _c.mode) || gridEditRowModel_1.GridCellModes.View;
                var originalId = rowsLookup[id] ? apiRef.current.getRowId(rowsLookup[id]) : id;
                if (params.mode === gridEditRowModel_1.GridCellModes.Edit && prevMode === gridEditRowModel_1.GridCellModes.View) {
                    updateStateToStartCellEditMode(__assign({ id: originalId, field: field }, params));
                }
                else if (params.mode === gridEditRowModel_1.GridCellModes.View && prevMode === gridEditRowModel_1.GridCellModes.Edit) {
                    updateStateToStopCellEditMode(__assign({ id: originalId, field: field }, params));
                }
            });
        });
    }, [apiRef, cellModesModel, updateStateToStartCellEditMode, updateStateToStopCellEditMode]);
};
exports.useGridCellEditing = useGridCellEditing;
