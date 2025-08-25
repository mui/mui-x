"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChartDefaultId = void 0;
var globalChartDefaultId = 0;
var createChartDefaultId = function () {
    globalChartDefaultId += 1;
    return "mui-chart-".concat(globalChartDefaultId);
};
exports.createChartDefaultId = createChartDefaultId;
