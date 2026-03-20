"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var legendGetter = function (series) { return (0, internals_1.getSeriesLegendItems)('rangeBar', series); };
exports.default = legendGetter;
