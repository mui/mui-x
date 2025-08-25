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
exports.columnsStateInitializer = void 0;
exports.useGridColumns = useGridColumns;
var React = require("react");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var useGridLogger_1 = require("../../utils/useGridLogger");
var gridColumnsSelector_1 = require("./gridColumnsSelector");
var signature_1 = require("../../../constants/signature");
var useGridEvent_1 = require("../../utils/useGridEvent");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var gridColumnsInterfaces_1 = require("./gridColumnsInterfaces");
var gridColumnsUtils_1 = require("./gridColumnsUtils");
var preferencesPanel_1 = require("../preferencesPanel");
var pivoting_1 = require("../pivoting");
var columnsStateInitializer = function (state, props, apiRef) {
    var _a, _b, _c, _d, _e, _f;
    apiRef.current.caches.columns = {
        lastColumnsProp: props.columns,
    };
    var columnsState = (0, gridColumnsUtils_1.createColumnsState)({
        apiRef: apiRef,
        columnsToUpsert: props.columns,
        initialState: (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.columns,
        columnVisibilityModel: (_e = (_b = props.columnVisibilityModel) !== null && _b !== void 0 ? _b : (_d = (_c = props.initialState) === null || _c === void 0 ? void 0 : _c.columns) === null || _d === void 0 ? void 0 : _d.columnVisibilityModel) !== null && _e !== void 0 ? _e : {},
        keepOnlyColumnsToUpsert: true,
    });
    return __assign(__assign({}, state), { columns: columnsState, 
        // In pro/premium, this part of the state is defined. We give it an empty but defined value
        // for the community version.
        pinnedColumns: (_f = state.pinnedColumns) !== null && _f !== void 0 ? _f : gridColumnsInterfaces_1.EMPTY_PINNED_COLUMN_FIELDS });
};
exports.columnsStateInitializer = columnsStateInitializer;
/**
 * @requires useGridParamsApi (method)
 * @requires useGridDimensions (method, event) - can be after
 * TODO: Impossible priority - useGridParamsApi also needs to be after useGridColumns
 */
function useGridColumns(apiRef, props) {
    var _a, _b;
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useGridColumns');
    apiRef.current.registerControlState({
        stateId: 'visibleColumns',
        propModel: props.columnVisibilityModel,
        propOnChange: props.onColumnVisibilityModelChange,
        stateSelector: gridColumnsSelector_1.gridColumnVisibilityModelSelector,
        changeEvent: 'columnVisibilityModelChange',
    });
    var setGridColumnsState = React.useCallback(function (columnsState) {
        logger.debug('Updating columns state.');
        apiRef.current.setState(mergeColumnsState(columnsState));
        apiRef.current.publishEvent('columnsChange', columnsState.orderedFields);
    }, [logger, apiRef]);
    /**
     * API METHODS
     */
    var getColumn = React.useCallback(function (field) { return (0, gridColumnsSelector_1.gridColumnLookupSelector)(apiRef)[field]; }, [apiRef]);
    var getAllColumns = React.useCallback(function () { return (0, gridColumnsSelector_1.gridColumnDefinitionsSelector)(apiRef); }, [apiRef]);
    var getVisibleColumns = React.useCallback(function () { return (0, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector)(apiRef); }, [apiRef]);
    var getColumnIndex = React.useCallback(function (field, useVisibleColumns) {
        if (useVisibleColumns === void 0) { useVisibleColumns = true; }
        var columns = useVisibleColumns
            ? (0, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector)(apiRef)
            : (0, gridColumnsSelector_1.gridColumnDefinitionsSelector)(apiRef);
        return columns.findIndex(function (col) { return col.field === field; });
    }, [apiRef]);
    var getColumnPosition = React.useCallback(function (field) {
        var index = getColumnIndex(field);
        return (0, gridColumnsSelector_1.gridColumnPositionsSelector)(apiRef)[index];
    }, [apiRef, getColumnIndex]);
    var setColumnVisibilityModel = React.useCallback(function (model) {
        var _a, _b;
        var currentModel = (0, gridColumnsSelector_1.gridColumnVisibilityModelSelector)(apiRef);
        if (currentModel !== model) {
            apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { columns: (0, gridColumnsUtils_1.createColumnsState)({
                    apiRef: apiRef,
                    columnsToUpsert: [],
                    initialState: undefined,
                    columnVisibilityModel: model,
                    keepOnlyColumnsToUpsert: false,
                }) })); });
            (_b = (_a = apiRef.current).updateRenderContext) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
    }, [apiRef]);
    var updateColumns = React.useCallback(function (columns) {
        if ((0, pivoting_1.gridPivotActiveSelector)(apiRef)) {
            apiRef.current.updateNonPivotColumns(columns);
            return;
        }
        var columnsState = (0, gridColumnsUtils_1.createColumnsState)({
            apiRef: apiRef,
            columnsToUpsert: columns,
            initialState: undefined,
            keepOnlyColumnsToUpsert: false,
            updateInitialVisibilityModel: true,
        });
        setGridColumnsState(columnsState);
    }, [apiRef, setGridColumnsState]);
    var setColumnVisibility = React.useCallback(function (field, isVisible) {
        var _a;
        var _b;
        var columnVisibilityModel = (0, gridColumnsSelector_1.gridColumnVisibilityModelSelector)(apiRef);
        var isCurrentlyVisible = (_b = columnVisibilityModel[field]) !== null && _b !== void 0 ? _b : true;
        if (isVisible !== isCurrentlyVisible) {
            var newModel = __assign(__assign({}, columnVisibilityModel), (_a = {}, _a[field] = isVisible, _a));
            apiRef.current.setColumnVisibilityModel(newModel);
        }
    }, [apiRef]);
    var getColumnIndexRelativeToVisibleColumns = React.useCallback(function (field) {
        var allColumns = (0, gridColumnsSelector_1.gridColumnFieldsSelector)(apiRef);
        return allColumns.findIndex(function (col) { return col === field; });
    }, [apiRef]);
    var setColumnIndex = React.useCallback(function (field, targetIndexPosition) {
        var allColumns = (0, gridColumnsSelector_1.gridColumnFieldsSelector)(apiRef);
        var oldIndexPosition = getColumnIndexRelativeToVisibleColumns(field);
        if (oldIndexPosition === targetIndexPosition) {
            return;
        }
        logger.debug("Moving column ".concat(field, " to index ").concat(targetIndexPosition));
        var updatedColumns = __spreadArray([], allColumns, true);
        var fieldRemoved = updatedColumns.splice(oldIndexPosition, 1)[0];
        updatedColumns.splice(targetIndexPosition, 0, fieldRemoved);
        setGridColumnsState(__assign(__assign({}, (0, gridColumnsSelector_1.gridColumnsStateSelector)(apiRef)), { orderedFields: updatedColumns }));
        var params = {
            column: apiRef.current.getColumn(field),
            targetIndex: apiRef.current.getColumnIndexRelativeToVisibleColumns(field),
            oldIndex: oldIndexPosition,
        };
        apiRef.current.publishEvent('columnIndexChange', params);
    }, [apiRef, logger, setGridColumnsState, getColumnIndexRelativeToVisibleColumns]);
    var setColumnWidth = React.useCallback(function (field, width) {
        var _a;
        logger.debug("Updating column ".concat(field, " width to ").concat(width));
        var columnsState = (0, gridColumnsSelector_1.gridColumnsStateSelector)(apiRef);
        var column = columnsState.lookup[field];
        var newColumn = __assign(__assign({}, column), { width: width, hasBeenResized: true });
        setGridColumnsState((0, gridColumnsUtils_1.hydrateColumnsWidth)(__assign(__assign({}, columnsState), { lookup: __assign(__assign({}, columnsState.lookup), (_a = {}, _a[field] = newColumn, _a)) }), apiRef.current.getRootDimensions()));
        apiRef.current.publishEvent('columnWidthChange', {
            element: apiRef.current.getColumnHeaderElement(field),
            colDef: newColumn,
            width: width,
        });
    }, [apiRef, logger, setGridColumnsState]);
    var columnApi = {
        getColumn: getColumn,
        getAllColumns: getAllColumns,
        getColumnIndex: getColumnIndex,
        getColumnPosition: getColumnPosition,
        getVisibleColumns: getVisibleColumns,
        getColumnIndexRelativeToVisibleColumns: getColumnIndexRelativeToVisibleColumns,
        updateColumns: updateColumns,
        setColumnVisibilityModel: setColumnVisibilityModel,
        setColumnVisibility: setColumnVisibility,
        setColumnWidth: setColumnWidth,
    };
    var columnReorderApi = { setColumnIndex: setColumnIndex };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, columnApi, 'public');
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, columnReorderApi, props.signature === signature_1.GridSignature.DataGrid ? 'private' : 'public');
    /**
     * PRE-PROCESSING
     */
    var stateExportPreProcessing = React.useCallback(function (prevState, context) {
        var _a, _b, _c;
        var columnsStateToExport = {};
        var columnVisibilityModelToExport = (0, gridColumnsSelector_1.gridColumnVisibilityModelSelector)(apiRef);
        var shouldExportColumnVisibilityModel = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
            // Always export if the model is controlled
            props.columnVisibilityModel != null ||
            // Always export if the model has been initialized
            // TODO v6 Do a nullish check instead to export even if the initial model equals "{}"
            Object.keys((_c = (_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.columns) === null || _b === void 0 ? void 0 : _b.columnVisibilityModel) !== null && _c !== void 0 ? _c : {}).length > 0 ||
            // Always export if the model is not empty
            Object.keys(columnVisibilityModelToExport).length > 0;
        if (shouldExportColumnVisibilityModel) {
            columnsStateToExport.columnVisibilityModel = columnVisibilityModelToExport;
        }
        columnsStateToExport.orderedFields = (0, gridColumnsSelector_1.gridColumnFieldsSelector)(apiRef);
        var columns = (0, gridColumnsSelector_1.gridColumnDefinitionsSelector)(apiRef);
        var dimensions = {};
        columns.forEach(function (colDef) {
            if (colDef.hasBeenResized) {
                var colDefDimensions_1 = {};
                gridColumnsUtils_1.COLUMNS_DIMENSION_PROPERTIES.forEach(function (propertyName) {
                    var propertyValue = colDef[propertyName];
                    if (propertyValue === Infinity) {
                        propertyValue = -1;
                    }
                    colDefDimensions_1[propertyName] = propertyValue;
                });
                dimensions[colDef.field] = colDefDimensions_1;
            }
        });
        if (Object.keys(dimensions).length > 0) {
            columnsStateToExport.dimensions = dimensions;
        }
        return __assign(__assign({}, prevState), { columns: columnsStateToExport });
    }, [apiRef, props.columnVisibilityModel, (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.columns]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var initialState = context.stateToRestore.columns;
        var columnVisibilityModelToImport = initialState === null || initialState === void 0 ? void 0 : initialState.columnVisibilityModel;
        if (initialState == null) {
            return params;
        }
        var columnsState = (0, gridColumnsUtils_1.createColumnsState)({
            apiRef: apiRef,
            columnsToUpsert: [],
            initialState: initialState,
            columnVisibilityModel: columnVisibilityModelToImport,
            keepOnlyColumnsToUpsert: false,
        });
        if (initialState != null) {
            apiRef.current.setState(function (prevState) { return (__assign(__assign({}, prevState), { columns: __assign(__assign({}, prevState.columns), { lookup: columnsState.lookup, orderedFields: columnsState.orderedFields, initialColumnVisibilityModel: columnsState.initialColumnVisibilityModel }) })); });
        }
        // separate column visibility model state update as it can be controlled
        // https://github.com/mui/mui-x/issues/17681#issuecomment-3012528602
        if (columnVisibilityModelToImport != null) {
            apiRef.current.setState(function (prevState) { return (__assign(__assign({}, prevState), { columns: __assign(__assign({}, prevState.columns), { columnVisibilityModel: columnVisibilityModelToImport }) })); });
        }
        if (initialState != null) {
            apiRef.current.publishEvent('columnsChange', columnsState.orderedFields);
        }
        return params;
    }, [apiRef]);
    var preferencePanelPreProcessing = React.useCallback(function (initialValue, value) {
        var _a;
        if (value === preferencesPanel_1.GridPreferencePanelsValue.columns) {
            var ColumnsPanel = props.slots.columnsPanel;
            return <ColumnsPanel {...(_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.columnsPanel}/>;
        }
        return initialValue;
    }, [props.slots.columnsPanel, (_b = props.slotProps) === null || _b === void 0 ? void 0 : _b.columnsPanel]);
    var addColumnMenuItems = React.useCallback(function (columnMenuItems) {
        var isPivotActive = (0, pivoting_1.gridPivotActiveSelector)(apiRef);
        if (props.disableColumnSelector || isPivotActive) {
            return columnMenuItems;
        }
        return __spreadArray(__spreadArray([], columnMenuItems, true), ['columnMenuColumnsItem'], false);
    }, [props.disableColumnSelector, apiRef]);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'columnMenu', addColumnMenuItems);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'preferencePanel', preferencePanelPreProcessing);
    /*
     * EVENTS
     */
    var prevInnerWidth = React.useRef(null);
    var handleGridSizeChange = function (size) {
        if (prevInnerWidth.current !== size.width) {
            prevInnerWidth.current = size.width;
            var hasFlexColumns = (0, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector)(apiRef).some(function (col) { return col.flex && col.flex > 0; });
            if (!hasFlexColumns) {
                return;
            }
            setGridColumnsState((0, gridColumnsUtils_1.hydrateColumnsWidth)((0, gridColumnsSelector_1.gridColumnsStateSelector)(apiRef), apiRef.current.getRootDimensions()));
        }
    };
    (0, useGridEvent_1.useGridEvent)(apiRef, 'viewportInnerSizeChange', handleGridSizeChange);
    /**
     * APPLIERS
     */
    var hydrateColumns = React.useCallback(function () {
        logger.info("Columns pipe processing have changed, regenerating the columns");
        var columnsState = (0, gridColumnsUtils_1.createColumnsState)({
            apiRef: apiRef,
            columnsToUpsert: [],
            initialState: undefined,
            keepOnlyColumnsToUpsert: false,
        });
        setGridColumnsState(columnsState);
    }, [apiRef, logger, setGridColumnsState]);
    (0, pipeProcessing_1.useGridRegisterPipeApplier)(apiRef, 'hydrateColumns', hydrateColumns);
    /*
     * EFFECTS
     */
    // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridColumns`
    // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one
    React.useEffect(function () {
        if (apiRef.current.caches.columns.lastColumnsProp === props.columns) {
            return;
        }
        apiRef.current.caches.columns.lastColumnsProp = props.columns;
        logger.info("GridColumns have changed, new length ".concat(props.columns.length));
        var columnsState = (0, gridColumnsUtils_1.createColumnsState)({
            apiRef: apiRef,
            initialState: undefined,
            // If the user provides a model, we don't want to set it in the state here because it has it's dedicated `useEffect` which calls `setColumnVisibilityModel`
            columnsToUpsert: props.columns,
            keepOnlyColumnsToUpsert: true,
            updateInitialVisibilityModel: true,
            columnVisibilityModel: props.columnVisibilityModel,
        });
        setGridColumnsState(columnsState);
    }, [logger, apiRef, setGridColumnsState, props.columns, props.columnVisibilityModel]);
    React.useEffect(function () {
        if (props.columnVisibilityModel !== undefined) {
            apiRef.current.setColumnVisibilityModel(props.columnVisibilityModel);
        }
    }, [apiRef, logger, props.columnVisibilityModel]);
}
function mergeColumnsState(columnsState) {
    return function (state) { return (__assign(__assign({}, state), { columns: columnsState })); };
}
