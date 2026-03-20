"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetRangeBarDimensions = createGetRangeBarDimensions;
var internals_1 = require("@mui/x-charts/internals");
function createGetRangeBarDimensions(params) {
    var verticalLayout = params.verticalLayout, xAxisConfig = params.xAxisConfig, yAxisConfig = params.yAxisConfig, series = params.series, numberOfGroups = params.numberOfGroups;
    var baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig);
    var xScale = xAxisConfig.scale;
    var yScale = yAxisConfig.scale;
    var bandWidth = baseScaleConfig.scale.bandwidth();
    var _a = (0, internals_1.getBandSize)(bandWidth, numberOfGroups, baseScaleConfig.barGapRatio), barWidth = _a.barWidth, offset = _a.offset;
    return function getBarDimensions(dataIndex, groupIndex) {
        var barOffset = groupIndex * (barWidth + offset);
        var baseValue = baseScaleConfig.data[dataIndex];
        var seriesValue = series.data[dataIndex];
        if (seriesValue == null) {
            return null;
        }
        var valueCoordinates = seriesValue.map(function (v) { return (verticalLayout ? yScale(v) : xScale(v)); });
        var minValueCoord = Math.round(Math.min.apply(Math, valueCoordinates));
        var maxValueCoord = Math.round(Math.max.apply(Math, valueCoordinates));
        var barSize = maxValueCoord - minValueCoord;
        return {
            x: verticalLayout ? xScale(baseValue) + barOffset : minValueCoord,
            y: verticalLayout ? minValueCoord : yScale(baseValue) + barOffset,
            height: verticalLayout ? barSize : barWidth,
            width: verticalLayout ? barWidth : barSize,
        };
    };
}
