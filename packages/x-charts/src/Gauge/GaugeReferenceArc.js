"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaugeReferenceArc = GaugeReferenceArc;
var React = require("react");
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var styles_1 = require("@mui/material/styles");
var GaugeProvider_1 = require("./GaugeProvider");
var StyledPath = (0, styles_1.styled)('path', {
    name: 'MuiGauge',
    slot: 'ReferenceArc',
})(function (_a) {
    var theme = _a.theme;
    return ({
        fill: (theme.vars || theme).palette.divider,
    });
});
function GaugeReferenceArc(props) {
    var _a = (0, GaugeProvider_1.useGaugeState)(), startAngle = _a.startAngle, endAngle = _a.endAngle, outerRadius = _a.outerRadius, innerRadius = _a.innerRadius, cornerRadius = _a.cornerRadius, cx = _a.cx, cy = _a.cy;
    return (<StyledPath transform={"translate(".concat(cx, ", ").concat(cy, ")")} d={(0, d3_shape_1.arc)().cornerRadius(cornerRadius)({
            startAngle: startAngle,
            endAngle: endAngle,
            innerRadius: innerRadius,
            outerRadius: outerRadius,
        })} {...props}/>);
}
