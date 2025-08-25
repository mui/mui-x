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
exports.useGridDataSourcePro = exports.dataSourceStateInitializer = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var useGridDataSourceBasePro_1 = require("./useGridDataSourceBasePro");
function getKeyPro(params) {
    return JSON.stringify([
        params.filterModel,
        params.sortModel,
        params.groupKeys,
        params.start,
        params.end,
    ]);
}
var dataSourceStateInitializer = function (state) {
    return __assign(__assign({}, state), { dataSource: useGridDataSourceBasePro_1.INITIAL_STATE });
};
exports.dataSourceStateInitializer = dataSourceStateInitializer;
var options = {
    cacheOptions: {
        getKey: getKeyPro,
    },
};
var useGridDataSourcePro = function (apiRef, props) {
    var _a = (0, useGridDataSourceBasePro_1.useGridDataSourceBasePro)(apiRef, props, options), api = _a.api, strategyProcessor = _a.strategyProcessor, events = _a.events, setStrategyAvailability = _a.setStrategyAvailability;
    (0, x_data_grid_1.useGridApiMethod)(apiRef, api.public, 'public');
    (0, x_data_grid_1.useGridApiMethod)(apiRef, api.private, 'private');
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, strategyProcessor.strategyName, strategyProcessor.group, strategyProcessor.processor);
    Object.entries(events).forEach(function (_a) {
        var event = _a[0], handler = _a[1];
        (0, x_data_grid_1.useGridEvent)(apiRef, event, handler);
    });
    React.useEffect(function () {
        setStrategyAvailability();
    }, [setStrategyAvailability]);
};
exports.useGridDataSourcePro = useGridDataSourcePro;
