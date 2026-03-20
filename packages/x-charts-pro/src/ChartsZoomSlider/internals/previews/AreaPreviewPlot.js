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
exports.AreaPreviewPlot = AreaPreviewPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-charts/internals");
var AreaPlotRoot = (0, styles_1.styled)('g', {
    name: 'MuiAreaPlot',
    slot: 'Root',
})({});
function AreaPreviewPlot(_a) {
    var axisId = _a.axisId;
    var completedData = useAreaPreviewData(axisId);
    return ((0, jsx_runtime_1.jsx)(AreaPlotRoot, { children: completedData.map(function (_a) {
            var d = _a.d, seriesId = _a.seriesId, color = _a.color, area = _a.area, gradientId = _a.gradientId;
            return !!area && ((0, jsx_runtime_1.jsx)(PreviewAreaElement, { seriesId: seriesId, d: d, color: color, gradientId: gradientId }, seriesId));
        }) }));
}
/**
 * Preview of the area element for the zoom preview.
 * Based on AreaElement and AnimatedArea.
 */
function PreviewAreaElement(_a) {
    var seriesId = _a.seriesId, color = _a.color, gradientId = _a.gradientId, onClick = _a.onClick, other = __rest(_a, ["seriesId", "color", "gradientId", "onClick"]);
    return ((0, jsx_runtime_1.jsx)("path", __assign({ fill: gradientId ? "url(#".concat(gradientId, ")") : color, stroke: "none", "data-series": seriesId }, other)));
}
function useAreaPreviewData(axisId) {
    var store = (0, internals_1.useStore)();
    var xAxes = store.use(internals_1.selectorChartPreviewComputedXAxis, axisId);
    var yAxes = store.use(internals_1.selectorChartPreviewComputedYAxis, axisId);
    return (0, internals_1.useAreaPlotData)(xAxes, yAxes);
}
