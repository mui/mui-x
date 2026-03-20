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
exports.ChartsContainerPremium = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var ChartsDataProviderPremium_1 = require("../ChartsDataProviderPremium");
var useChartsContainerPremiumProps_1 = require("./useChartsContainerPremiumProps");
/**
 * It sets up the data providers as well as the `<svg>` for the chart.
 *
 * This is a combination of both the `ChartsDataProviderPremium` and `ChartsSurface` components.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartsContainerPremium API](https://mui.com/x/api/charts/charts-container-premium/)
 *
 * @example
 * ```jsx
 * <ChartsContainerPremium
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *    <BarPlot />
 *    <ChartsXAxis axisId="x-axis" />
 * </ChartsContainerPremium>
 * ```
 */
var ChartsContainerPremium = React.forwardRef(function ChartsContainerPremium(props, ref) {
    var _a = (0, useChartsContainerPremiumProps_1.useChartsContainerPremiumProps)(props), chartsDataProviderPremiumProps = _a.chartsDataProviderPremiumProps, children = _a.children, chartsSurfaceProps = _a.chartsSurfaceProps;
    return ((0, jsx_runtime_1.jsx)(ChartsDataProviderPremium_1.ChartsDataProviderPremium, __assign({}, chartsDataProviderPremiumProps, { children: (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, __assign({}, chartsSurfaceProps, { ref: ref, children: children })) })));
});
exports.ChartsContainerPremium = ChartsContainerPremium;
