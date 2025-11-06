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
exports.GridChartsIntegrationContextProvider = GridChartsIntegrationContextProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var GridChartsIntegrationContext_1 = require("../components/chartsIntegration/GridChartsIntegrationContext");
var useGridChartsIntegration_1 = require("../hooks/features/chartsIntegration/useGridChartsIntegration");
function GridChartsIntegrationContextProvider(_a) {
    var children = _a.children;
    var _b = React.useState({}), chartStateLookup = _b[0], setChartStateLookup = _b[1];
    var setChartState = React.useCallback(function (id, state) {
        if (id === '') {
            return;
        }
        setChartStateLookup(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[id] = __assign(__assign({}, (prev[id] || useGridChartsIntegration_1.EMPTY_CHART_INTEGRATION_CONTEXT_STATE)), state), _a)));
        });
    }, []);
    var value = React.useMemo(function () { return ({
        chartStateLookup: chartStateLookup,
        setChartState: setChartState,
    }); }, [chartStateLookup, setChartState]);
    return ((0, jsx_runtime_1.jsx)(GridChartsIntegrationContext_1.GridChartsIntegrationContext.Provider, { value: value, children: children }));
}
