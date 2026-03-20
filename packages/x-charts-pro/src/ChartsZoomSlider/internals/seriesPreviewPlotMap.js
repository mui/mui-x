"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seriesPreviewPlotMap = void 0;
var BarPreviewPlot_1 = require("./previews/BarPreviewPlot");
var ScatterPreviewPlot_1 = require("./previews/ScatterPreviewPlot");
var LineAreaPreviewPlot_1 = require("./previews/LineAreaPreviewPlot");
exports.seriesPreviewPlotMap = new Map([
    ['bar', BarPreviewPlot_1.BarPreviewPlot],
    ['line', LineAreaPreviewPlot_1.LineAreaPreviewPlot],
    ['scatter', ScatterPreviewPlot_1.ScatterPreviewPlot],
]);
