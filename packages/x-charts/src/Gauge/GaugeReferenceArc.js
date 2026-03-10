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
exports.GaugeReferenceArc = GaugeReferenceArc;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var styles_1 = require("@mui/material/styles");
var clsx_1 = require("clsx");
var GaugeProvider_1 = require("./GaugeProvider");
var gaugeClasses_1 = require("./gaugeClasses");
var StyledPath = (0, styles_1.styled)('path', {
    name: 'MuiGauge',
    slot: 'ReferenceArc',
})(function (_a) {
    var theme = _a.theme;
    return ({
        fill: (theme.vars || theme).palette.divider,
    });
});
function GaugeReferenceArc(_a) {
    var className = _a.className, other = __rest(_a, ["className"]);
    var _b = (0, GaugeProvider_1.useGaugeState)(), startAngle = _b.startAngle, endAngle = _b.endAngle, outerRadius = _b.outerRadius, innerRadius = _b.innerRadius, cornerRadius = _b.cornerRadius, cx = _b.cx, cy = _b.cy;
    return ((0, jsx_runtime_1.jsx)(StyledPath, __assign({ className: (0, clsx_1.default)(gaugeClasses_1.gaugeClasses.referenceArc, className), transform: "translate(".concat(cx, ", ").concat(cy, ")"), d: (0, d3_shape_1.arc)().cornerRadius(cornerRadius)({
            startAngle: startAngle,
            endAngle: endAngle,
            innerRadius: innerRadius,
            outerRadius: outerRadius,
        }) }, other)));
}
