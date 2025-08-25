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
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
function getKeyPremium(params) {
    return JSON.stringify([
        params.filterModel,
        params.sortModel,
        params.groupKeys,
        params.groupFields,
        params.start,
        params.end,
        params.aggregationModel,
    ]);
}
var options = {
    cacheOptions: {
        getKey: getKeyPremium,
    },
};
var useGridDataSourcePremium = function (apiRef, props) {
    var _a = (0, internals_1.useGridDataSourceBasePro)(apiRef, props, options), api = _a.api, debouncedFetchRows = _a.debouncedFetchRows, strategyProcessor = _a.strategyProcessor, events = _a.events, setStrategyAvailability = _a.setStrategyAvailability;
    var aggregateRowRef = React.useRef({});
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
        return {
            params: params,
            response: response,
        };
    }, [apiRef]);
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
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, strategyProcessor.strategyName, strategyProcessor.group, strategyProcessor.processor);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'processDataSourceRows', processDataSourceRows);
    Object.entries(events).forEach(function (_a) {
        var event = _a[0], handler = _a[1];
        (0, x_data_grid_pro_1.useGridEvent)(apiRef, event, handler);
    });
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'rowGroupingModelChange', function () { return debouncedFetchRows(); });
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'aggregationModelChange', function () { return debouncedFetchRows(); });
    React.useEffect(function () {
        setStrategyAvailability();
    }, [setStrategyAvailability]);
};
exports.useGridDataSourcePremium = useGridDataSourcePremium;
