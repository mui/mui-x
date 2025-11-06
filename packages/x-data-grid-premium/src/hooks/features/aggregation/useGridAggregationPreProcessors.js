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
exports.useGridAggregationPreProcessors = void 0;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridAggregationUtils_1 = require("./gridAggregationUtils");
var wrapColumnWithAggregation_1 = require("./wrapColumnWithAggregation");
var gridAggregationSelectors_1 = require("./gridAggregationSelectors");
var useGridAggregationPreProcessors = function (apiRef, props) {
    // apiRef.current.caches.aggregation.rulesOnLastColumnHydration is not used because by the time
    // that the pre-processor is called it will already have been updated with the current rules.
    var rulesOnLastColumnHydration = React.useRef({});
    var updateAggregatedColumns = React.useCallback(function (columnsState) {
        var aggregationRules = props.disableAggregation
            ? {}
            : (0, gridAggregationUtils_1.getAggregationRules)(columnsState.lookup, (0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef), props.aggregationFunctions, !!props.dataSource);
        columnsState.orderedFields.forEach(function (field) {
            var shouldHaveAggregationValue = !!aggregationRules[field];
            var haveAggregationColumnValue = !!rulesOnLastColumnHydration.current[field];
            var column = columnsState.lookup[field];
            if (haveAggregationColumnValue) {
                column = (0, wrapColumnWithAggregation_1.unwrapColumnFromAggregation)(column);
            }
            if (shouldHaveAggregationValue) {
                column = (0, wrapColumnWithAggregation_1.wrapColumnWithAggregationValue)(column, aggregationRules[field], apiRef);
            }
            columnsState.lookup[field] = column;
        });
        rulesOnLastColumnHydration.current = aggregationRules;
        apiRef.current.caches.aggregation.rulesOnLastColumnHydration = aggregationRules;
        return columnsState;
    }, [apiRef, props.aggregationFunctions, props.disableAggregation, props.dataSource]);
    var addGroupFooterRows = React.useCallback(function (value) {
        var aggregationRules = props.disableAggregation
            ? {}
            : (0, gridAggregationUtils_1.getAggregationRules)((0, x_data_grid_pro_1.gridColumnLookupSelector)(apiRef), (0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef), props.aggregationFunctions, !!props.dataSource);
        var hasAggregationRule = Object.keys(aggregationRules).length > 0;
        // If we did not have any aggregation footer before, and we still don't have any,
        // Then we can skip this step
        if (Object.keys(apiRef.current.caches.aggregation.rulesOnLastRowHydration).length === 0 &&
            !hasAggregationRule) {
            return value;
        }
        apiRef.current.caches.aggregation.rulesOnLastRowHydration = aggregationRules;
        return (0, gridAggregationUtils_1.addFooterRows)({
            apiRef: apiRef,
            groupingParams: value,
            getAggregationPosition: props.getAggregationPosition,
            hasAggregationRule: hasAggregationRule,
        });
    }, [
        apiRef,
        props.disableAggregation,
        props.getAggregationPosition,
        props.aggregationFunctions,
        props.dataSource,
    ]);
    var addColumnMenuButtons = React.useCallback(function (columnMenuItems, colDef) {
        if (props.disableAggregation || !colDef.aggregable) {
            return columnMenuItems;
        }
        var availableAggregationFunctions = (0, gridAggregationUtils_1.getAvailableAggregationFunctions)({
            aggregationFunctions: props.aggregationFunctions,
            colDef: colDef,
            isDataSource: !!props.dataSource,
        });
        if (availableAggregationFunctions.length === 0) {
            return columnMenuItems;
        }
        return __spreadArray(__spreadArray([], columnMenuItems, true), ['columnMenuAggregationItem'], false);
    }, [props.aggregationFunctions, props.disableAggregation, props.dataSource]);
    var stateExportPreProcessing = React.useCallback(function (prevState) {
        if (props.disableAggregation) {
            return prevState;
        }
        var aggregationModelToExport = (0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef);
        if (Object.values(aggregationModelToExport).length === 0) {
            return prevState;
        }
        return __assign(__assign({}, prevState), { aggregation: {
                model: aggregationModelToExport,
            } });
    }, [apiRef, props.disableAggregation]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var _a;
        if (props.disableAggregation) {
            return params;
        }
        var aggregationModel = (_a = context.stateToRestore.aggregation) === null || _a === void 0 ? void 0 : _a.model;
        if (aggregationModel != null) {
            apiRef.current.setState((0, gridAggregationUtils_1.mergeStateWithAggregationModel)(aggregationModel));
        }
        return params;
    }, [apiRef, props.disableAggregation]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'hydrateColumns', updateAggregatedColumns);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'hydrateRows', addGroupFooterRows);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'columnMenu', addColumnMenuButtons);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
};
exports.useGridAggregationPreProcessors = useGridAggregationPreProcessors;
