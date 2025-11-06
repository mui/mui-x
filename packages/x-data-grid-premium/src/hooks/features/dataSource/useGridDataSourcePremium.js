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
exports.useGridDataSourcePremium = void 0;
var React = require("react");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridPivotingSelectors_1 = require("../pivoting/gridPivotingSelectors");
var utils_1 = require("./utils");
var gridRowGroupingSelector_1 = require("../rowGrouping/gridRowGroupingSelector");
var gridAggregationSelectors_1 = require("../aggregation/gridAggregationSelectors");
function getKeyPremium(params) {
    return JSON.stringify([
        params.filterModel,
        params.sortModel,
        params.groupKeys,
        params.groupFields,
        params.start,
        params.end,
        params.pivotModel ? {} : params.aggregationModel,
        params.pivotModel,
    ]);
}
var options = {
    cacheOptions: {
        getKey: getKeyPremium,
    },
};
var useGridDataSourcePremium = function (apiRef, props) {
    var aggregationModel = (0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef);
    var groupingModelSize = (0, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector)(apiRef).length;
    var setStrategyAvailability = React.useCallback(function () {
        var targetStrategy = props.treeData || (!props.disableRowGrouping && groupingModelSize > 0)
            ? internals_1.DataSourceRowsUpdateStrategy.GroupedData
            : internals_1.DataSourceRowsUpdateStrategy.Default;
        apiRef.current.setStrategyAvailability(internals_1.GridStrategyGroup.DataSource, targetStrategy, props.dataSource && !props.lazyLoading ? function () { return true; } : function () { return false; });
    }, [
        apiRef,
        props.dataSource,
        props.lazyLoading,
        props.treeData,
        props.disableRowGrouping,
        groupingModelSize,
    ]);
    var handleEditRowWithAggregation = React.useCallback(function (params, updatedRow) {
        var rowTree = (0, x_data_grid_pro_1.gridRowTreeSelector)(apiRef);
        if (updatedRow && !(0, isDeepEqual_1.isDeepEqual)(updatedRow, params.previousRow)) {
            // Reset the outdated cache, only if the row is _actually_ updated
            apiRef.current.dataSource.cache.clear();
        }
        var groupKeys = (0, internals_1.getGroupKeys)(rowTree, params.rowId);
        apiRef.current.updateNestedRows([updatedRow], groupKeys);
        // To refresh the aggregation values of all parent rows and the footer row, recursively re-fetch all parent levels
        (0, utils_1.fetchParents)(rowTree, params.rowId, apiRef.current.dataSource.fetchRows);
    }, [apiRef]);
    var _a = (0, internals_1.useGridDataSourceBasePro)(apiRef, props, __assign(__assign({}, (!props.disableAggregation && Object.keys(aggregationModel).length > 0
        ? { handleEditRow: handleEditRowWithAggregation }
        : {})), options)), api = _a.api, debouncedFetchRows = _a.debouncedFetchRows, flatTreeStrategyProcessor = _a.flatTreeStrategyProcessor, groupedDataStrategyProcessor = _a.groupedDataStrategyProcessor, events = _a.events;
    var aggregateRowRef = React.useRef({});
    var initialColumns = (0, internals_1.gridPivotInitialColumnsSelector)(apiRef);
    var pivotActive = (0, internals_1.gridPivotActiveSelector)(apiRef);
    var pivotModel = (0, gridPivotingSelectors_1.gridPivotModelSelector)(apiRef);
    var processDataSourceRows = React.useCallback(function (_a, applyRowHydration) {
        var params = _a.params, response = _a.response;
        if (response.aggregateRow) {
            aggregateRowRef.current = response.aggregateRow;
        }
        if (Object.keys(params.aggregationModel || {}).length > 0) {
            if (applyRowHydration) {
                apiRef.current.requestPipeProcessorsApplication('hydrateRows');
            }
            apiRef.current.applyAggregation();
        }
        if (response.pivotColumns) {
            var pivotingColDef = props.pivotingColDef;
            if (!pivotingColDef || typeof pivotingColDef !== 'function') {
                throw new Error('MUI X: No `pivotingColDef()` prop provided with to the Data Grid, but response contains `pivotColumns`.\n\n\
            You need a callback to return at least a field column prop for each generated pivot column.\n\n\
            See [server-side pivoting](https://mui.com/x/react-data-grid/server-side-data/pivoting/) documentation for more details.');
            }
            // Update the grid state with new columns and column grouping model
            var partialPropsOverrides_1 = (0, utils_1.getPropsOverrides)(response.pivotColumns, pivotingColDef, pivotModel, initialColumns, apiRef);
            apiRef.current.setState(function (state) {
                return __assign(__assign({}, state), { pivoting: __assign(__assign({}, state.pivoting), { propsOverrides: __assign(__assign({}, state.pivoting.propsOverrides), partialPropsOverrides_1) }) });
            });
        }
        return {
            params: params,
            response: response,
        };
    }, [apiRef, props.pivotingColDef, initialColumns, pivotModel]);
    var resolveGroupAggregation = React.useCallback(function (groupId, field) {
        var _a, _b, _c, _d;
        if (groupId === x_data_grid_pro_1.GRID_ROOT_GROUP_ID) {
            return (_b = (_a = props.dataSource) === null || _a === void 0 ? void 0 : _a.getAggregatedValue) === null || _b === void 0 ? void 0 : _b.call(_a, aggregateRowRef.current, field);
        }
        var row = apiRef.current.getRow(groupId);
        return (_d = (_c = props.dataSource) === null || _c === void 0 ? void 0 : _c.getAggregatedValue) === null || _d === void 0 ? void 0 : _d.call(_c, row, field);
    }, [apiRef, props.dataSource]);
    var privateApi = __assign(__assign({}, api.private), { resolveGroupAggregation: resolveGroupAggregation });
    (0, x_data_grid_pro_1.useGridApiMethod)(apiRef, api.public, 'public');
    (0, x_data_grid_pro_1.useGridApiMethod)(apiRef, privateApi, 'private');
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, flatTreeStrategyProcessor.strategyName, flatTreeStrategyProcessor.group, flatTreeStrategyProcessor.processor);
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, groupedDataStrategyProcessor.strategyName, groupedDataStrategyProcessor.group, groupedDataStrategyProcessor.processor);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'processDataSourceRows', processDataSourceRows);
    Object.entries(events).forEach(function (_a) {
        var event = _a[0], handler = _a[1];
        (0, x_data_grid_pro_1.useGridEvent)(apiRef, event, handler);
    });
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'rowGroupingModelChange', (0, internals_1.runIf)(!pivotActive, function () { return debouncedFetchRows(); }));
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'aggregationModelChange', (0, internals_1.runIf)(!pivotActive, function () { return debouncedFetchRows(); }));
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'pivotModeChange', (0, internals_1.runIf)(!pivotActive, function () { return debouncedFetchRows(); }));
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'pivotModelChange', (0, internals_1.runIf)(pivotActive, function () { return debouncedFetchRows(); }));
    React.useEffect(function () {
        setStrategyAvailability();
    }, [setStrategyAvailability]);
};
exports.useGridDataSourcePremium = useGridDataSourcePremium;
