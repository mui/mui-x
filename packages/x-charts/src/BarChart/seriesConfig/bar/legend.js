"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var legendUtils_1 = require("../../../internals/legendUtils");
var legendGetter = function (series) { return (0, legendUtils_1.getSeriesLegendItems)('bar', series); };
exports.default = legendGetter;
