"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaultizeValueFormatter_1 = require("../../internals/defaultizeValueFormatter");
var formatter = function (params) {
    var seriesOrder = params.seriesOrder, series = params.series;
    return {
        seriesOrder: seriesOrder,
        series: (0, defaultizeValueFormatter_1.defaultizeValueFormatter)(series, function (v) { return (v == null ? '' : v.toLocaleString()); }),
    };
};
exports.default = formatter;
