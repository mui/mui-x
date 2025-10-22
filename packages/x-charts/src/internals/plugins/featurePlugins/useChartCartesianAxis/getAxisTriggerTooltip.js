"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxisTriggerTooltip = void 0;
var isCartesian_1 = require("../../../isCartesian");
var getAxisTriggerTooltip = function (axisDirection, seriesConfig, formattedSeries, defaultAxisId) {
    var tooltipAxesIds = new Set();
    var chartTypes = Object.keys(seriesConfig).filter(isCartesian_1.isCartesianSeriesType);
    chartTypes.forEach(function (chartType) {
        var _a, _b, _c, _d;
        var series = (_b = (_a = formattedSeries[chartType]) === null || _a === void 0 ? void 0 : _a.series) !== null && _b !== void 0 ? _b : {};
        var tooltipAxes = (_d = (_c = seriesConfig[chartType]).axisTooltipGetter) === null || _d === void 0 ? void 0 : _d.call(_c, series);
        if (tooltipAxes === undefined) {
            return;
        }
        tooltipAxes.forEach(function (_a) {
            var axisId = _a.axisId, direction = _a.direction;
            if (direction === axisDirection) {
                tooltipAxesIds.add(axisId !== null && axisId !== void 0 ? axisId : defaultAxisId);
            }
        });
    });
    return tooltipAxesIds;
};
exports.getAxisTriggerTooltip = getAxisTriggerTooltip;
