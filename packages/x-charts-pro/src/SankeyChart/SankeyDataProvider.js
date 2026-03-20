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
exports.SankeyDataProvider = SankeyDataProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var SankeyChart_plugins_1 = require("./SankeyChart.plugins");
var ChartsDataProviderPro_1 = require("../ChartsDataProviderPro");
var seriesConfig_1 = require("./seriesConfig");
var seriesConfig = { sankey: seriesConfig_1.sankeySeriesConfig };
/**
 * Orchestrates the data providers for the sankey chart components and hooks.
 *
 * Use this component if you have custom HTML components that need to access the chart data.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 */
function SankeyDataProvider(props) {
    return ((0, jsx_runtime_1.jsx)(ChartsDataProviderPro_1.ChartsDataProviderPro, __assign({}, props, { seriesConfig: seriesConfig, plugins: SankeyChart_plugins_1.SANKEY_CHART_PLUGINS })));
}
