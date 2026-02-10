"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMarkPlotData = useMarkPlotData;
var React = require("react");
var useChartId_1 = require("../hooks/useChartId");
var hooks_1 = require("../hooks");
var cleanId_1 = require("../internals/cleanId");
var constants_1 = require("../constants");
var getColor_1 = require("./seriesConfig/getColor");
var ChartProvider_1 = require("../context/ChartProvider");
function useMarkPlotData(xAxes, yAxes) {
    var seriesData = (0, hooks_1.useLineSeriesContext)();
    var defaultXAxisId = (0, hooks_1.useXAxes)().xAxisIds[0];
    var defaultYAxisId = (0, hooks_1.useYAxes)().yAxisIds[0];
    var chartId = (0, useChartId_1.useChartId)();
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    var allData = React.useMemo(function () {
        if (seriesData === undefined) {
            return [];
        }
        var series = seriesData.series, stackingGroups = seriesData.stackingGroups;
        var markPlotData = [];
        for (var _i = 0, stackingGroups_1 = stackingGroups; _i < stackingGroups_1.length; _i++) {
            var stackingGroup = stackingGroups_1[_i];
            var groupIds = stackingGroup.ids;
            for (var _a = 0, groupIds_1 = groupIds; _a < groupIds_1.length; _a++) {
                var seriesId = groupIds_1[_a];
                var _b = series[seriesId], _c = _b.xAxisId, xAxisId = _c === void 0 ? defaultXAxisId : _c, _d = _b.yAxisId, yAxisId = _d === void 0 ? defaultYAxisId : _d, visibleStackedData = _b.visibleStackedData, data = _b.data, _e = _b.showMark, showMark = _e === void 0 ? true : _e, _f = _b.shape, shape = _f === void 0 ? 'circle' : _f, hidden = _b.hidden;
                if (showMark === false) {
                    continue;
                }
                if (!(xAxisId in xAxes) || !(yAxisId in yAxes)) {
                    continue;
                }
                var xScale = (0, hooks_1.getValueToPositionMapper)(xAxes[xAxisId].scale);
                var yScale = yAxes[yAxisId].scale;
                var xData = xAxes[xAxisId].data;
                if (process.env.NODE_ENV !== 'production') {
                    if (xData === undefined) {
                        throw new Error("MUI X Charts: ".concat(xAxisId === constants_1.DEFAULT_X_AXIS_KEY
                            ? 'The first `xAxis`'
                            : "The x-axis with id \"".concat(xAxisId, "\""), " should have data property to be able to display a line plot."));
                    }
                }
                var clipId = (0, cleanId_1.cleanId)("".concat(chartId, "-").concat(seriesId, "-line-clip"));
                var colorGetter = (0, getColor_1.default)(series[seriesId], xAxes[xAxisId], yAxes[yAxisId]);
                var marks = [];
                if (xData) {
                    for (var index = 0; index < xData.length; index += 1) {
                        var x = xData[index];
                        var value = data[index] == null ? null : visibleStackedData[index][1];
                        if (value === null) {
                            continue;
                        }
                        // The line fade animation move all the values to the min.
                        // So we need to do the same with mark in order for it to look nice.
                        var y = yScale(hidden ? yScale.domain()[0] : value);
                        var xPos = xScale(x);
                        if (!instance.isPointInside(xPos, y)) {
                            continue;
                        }
                        if (showMark !== true) {
                            var shouldInclude = showMark({
                                x: xPos,
                                y: y,
                                index: index,
                                position: x,
                                value: value,
                            });
                            if (!shouldInclude) {
                                continue;
                            }
                        }
                        marks.push({
                            x: xPos,
                            y: y,
                            index: index,
                            color: colorGetter(index),
                        });
                    }
                }
                markPlotData.push({
                    seriesId: seriesId,
                    clipId: clipId,
                    shape: shape,
                    xAxisId: xAxisId,
                    marks: marks,
                    hidden: hidden,
                });
            }
        }
        return markPlotData;
    }, [seriesData, defaultXAxisId, defaultYAxisId, chartId, xAxes, yAxes, instance]);
    return allData;
}
