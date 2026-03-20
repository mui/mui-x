"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineAreaPreviewPlot = LineAreaPreviewPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var AreaPreviewPlot_1 = require("./AreaPreviewPlot");
var LinePreviewPlot_1 = require("./LinePreviewPlot");
function LineAreaPreviewPlot(_a) {
    var axisId = _a.axisId;
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(AreaPreviewPlot_1.AreaPreviewPlot, { axisId: axisId }), (0, jsx_runtime_1.jsx)(LinePreviewPlot_1.LinePreviewPlot, { axisId: axisId })] }));
}
