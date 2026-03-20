"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatmapWebGLRenderer = HeatmapWebGLRenderer;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var internals_2 = require("@mui/x-charts-pro/internals");
var HeatmapWebGLPlot_1 = require("./HeatmapWebGLPlot");
var ChartsWebGLLayer_1 = require("../../ChartsWebGLLayer");
function HeatmapWebGLRenderer(_a) {
    var borderRadius = _a.borderRadius;
    (0, internals_1.useRegisterPointerInteractions)(internals_2.selectorHeatmapItemAtPosition);
    return ((0, jsx_runtime_1.jsx)(ChartsWebGLLayer_1.ChartsWebGLLayer, { children: (0, jsx_runtime_1.jsx)(HeatmapWebGLPlot_1.HeatmapWebGLPlot, { borderRadius: borderRadius }) }));
}
