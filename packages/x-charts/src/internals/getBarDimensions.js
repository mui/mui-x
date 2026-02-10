"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBarDimensions = getBarDimensions;
var findMinMax_1 = require("./findMinMax");
var getBandSize_1 = require("./getBandSize");
function shouldInvertStartCoordinate(verticalLayout, baseValue, reverse) {
    var isVerticalAndPositive = verticalLayout && baseValue > 0;
    var isHorizontalAndNegative = !verticalLayout && baseValue < 0;
    var invertStartCoordinate = isVerticalAndPositive || isHorizontalAndNegative;
    return reverse ? !invertStartCoordinate : invertStartCoordinate;
}
function getBarDimensions(params) {
    var _a;
    var verticalLayout = params.verticalLayout, xAxisConfig = params.xAxisConfig, yAxisConfig = params.yAxisConfig, series = params.series, dataIndex = params.dataIndex, numberOfGroups = params.numberOfGroups, groupIndex = params.groupIndex;
    var baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig);
    var reverse = (_a = (verticalLayout ? yAxisConfig.reverse : xAxisConfig.reverse)) !== null && _a !== void 0 ? _a : false;
    var _b = (0, getBandSize_1.getBandSize)(baseScaleConfig.scale.bandwidth(), numberOfGroups, baseScaleConfig.barGapRatio), barWidth = _b.barWidth, offset = _b.offset;
    var barOffset = groupIndex * (barWidth + offset);
    var xScale = xAxisConfig.scale;
    var yScale = yAxisConfig.scale;
    var baseValue = baseScaleConfig.data[dataIndex];
    var seriesValue = series.data[dataIndex];
    if (seriesValue == null) {
        return null;
    }
    var values = series.visibleStackedData[dataIndex];
    var valueCoordinates = values.map(function (v) { return (verticalLayout ? yScale(v) : xScale(v)); });
    var _c = (0, findMinMax_1.findMinMax)(valueCoordinates).map(function (v) { return Math.round(v); }), minValueCoord = _c[0], maxValueCoord = _c[1];
    var barSize = 0;
    if (seriesValue !== 0) {
        if (!series.hidden) {
            barSize = Math.max(series.minBarSize, maxValueCoord - minValueCoord);
        }
    }
    var shouldInvert = shouldInvertStartCoordinate(verticalLayout, seriesValue, reverse);
    var startCoordinate = 0;
    if (shouldInvert) {
        startCoordinate = maxValueCoord - barSize;
    }
    else {
        startCoordinate = minValueCoord;
    }
    return {
        x: verticalLayout ? xScale(baseValue) + barOffset : startCoordinate,
        y: verticalLayout ? startCoordinate : yScale(baseValue) + barOffset,
        height: verticalLayout ? barSize : barWidth,
        width: verticalLayout ? barWidth : barSize,
    };
}
