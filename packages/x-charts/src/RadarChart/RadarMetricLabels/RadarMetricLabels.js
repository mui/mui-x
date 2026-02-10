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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarMetricLabels = RadarMetricLabels;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var useRadarMetricData_1 = require("./useRadarMetricData");
var defaultTextPlacement_1 = require("../../ChartsText/defaultTextPlacement");
var ChartsText_1 = require("../../ChartsText");
function RadarMetricLabels() {
    var corners = (0, useRadarMetricData_1.useRadarMetricData)().corners;
    var theme = (0, styles_1.useTheme)();
    return ((0, jsx_runtime_1.jsx)(React.Fragment, { children: corners.map(function (_a, i) {
            var x = _a.x, y = _a.y, angle = _a.angle, label = _a.label;
            return ((0, jsx_runtime_1.jsx)(ChartsText_1.ChartsText, { x: x, y: y, fontSize: 14, fill: (theme.vars || theme).palette.text.primary, stroke: "none", text: label, style: __assign(__assign({}, theme.typography.caption), { fontSize: 12, lineHeight: 1.25, textAnchor: (0, defaultTextPlacement_1.getDefaultTextAnchor)(180 + angle), dominantBaseline: (0, defaultTextPlacement_1.getDefaultBaseline)(180 + angle) }) }, i));
        }) }));
}
