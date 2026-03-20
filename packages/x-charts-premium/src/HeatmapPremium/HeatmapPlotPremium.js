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
exports.HeatmapPlotPremium = HeatmapPlotPremium;
var jsx_runtime_1 = require("react/jsx-runtime");
var internals_1 = require("@mui/x-charts-pro/internals");
var HeatmapWebGLRenderer_1 = require("./webgl/HeatmapWebGLRenderer");
function HeatmapPlotPremium(_a) {
    var renderer = _a.renderer, borderRadius = _a.borderRadius, props = __rest(_a, ["renderer", "borderRadius"]);
    if (renderer === 'webgl') {
        return (0, jsx_runtime_1.jsx)(HeatmapWebGLRenderer_1.HeatmapWebGLRenderer, { borderRadius: borderRadius });
    }
    return (0, jsx_runtime_1.jsx)(internals_1.HeatmapSVGPlot, __assign({ borderRadius: borderRadius }, props));
}
