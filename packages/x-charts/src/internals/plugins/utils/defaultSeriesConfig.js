"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSeriesConfig = void 0;
var seriesConfig_1 = require("../../../BarChart/seriesConfig");
var seriesConfig_2 = require("../../../LineChart/seriesConfig");
var seriesConfig_3 = require("../../../PieChart/seriesConfig");
var seriesConfig_4 = require("../../../ScatterChart/seriesConfig");
exports.defaultSeriesConfig = {
    bar: seriesConfig_1.barSeriesConfig,
    scatter: seriesConfig_4.scatterSeriesConfig,
    line: seriesConfig_2.lineSeriesConfig,
    pie: seriesConfig_3.pieSeriesConfig,
};
