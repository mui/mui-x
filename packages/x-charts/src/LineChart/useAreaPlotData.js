"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAreaPlotData = useAreaPlotData;
var React = require("react");
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var useChartGradientId_1 = require("../hooks/useChartGradientId");
var scaleGuards_1 = require("../internals/scaleGuards");
var getCurve_1 = require("../internals/getCurve");
var hooks_1 = require("../hooks");
var constants_1 = require("../constants");
function useAreaPlotData(xAxes, yAxes) {
    var seriesData = (0, hooks_1.useLineSeriesContext)();
    var defaultXAxisId = (0, hooks_1.useXAxes)().xAxisIds[0];
    var defaultYAxisId = (0, hooks_1.useYAxes)().yAxisIds[0];
    var getGradientId = (0, useChartGradientId_1.useChartGradientIdBuilder)();
    // This memo prevents odd line chart behavior when hydrating.
    var allData = React.useMemo(function () {
        var _a;
        if (seriesData === undefined) {
            return [];
        }
        var series = seriesData.series, stackingGroups = seriesData.stackingGroups;
        var areaPlotData = [];
        for (var _i = 0, stackingGroups_1 = stackingGroups; _i < stackingGroups_1.length; _i++) {
            var stackingGroup = stackingGroups_1[_i];
            var groupIds = stackingGroup.ids;
            var _loop_1 = function (i) {
                var seriesId = groupIds[i];
                var _b = series[seriesId], _c = _b.xAxisId, xAxisId = _c === void 0 ? defaultXAxisId : _c, _d = _b.yAxisId, yAxisId = _d === void 0 ? defaultYAxisId : _d, visibleStackedData = _b.visibleStackedData, stackedData = _b.stackedData, data = _b.data, connectNulls = _b.connectNulls, baseline = _b.baseline, curve = _b.curve, strictStepCurve = _b.strictStepCurve, area = _b.area;
                if (!area || !(xAxisId in xAxes) || !(yAxisId in yAxes)) {
                    return "continue";
                }
                var xScale = xAxes[xAxisId].scale;
                var xPosition = (0, hooks_1.getValueToPositionMapper)(xScale);
                var yScale = yAxes[yAxisId].scale;
                var xData = xAxes[xAxisId].data;
                var gradientId = (yAxes[yAxisId].colorScale && getGradientId(yAxisId)) ||
                    (xAxes[xAxisId].colorScale && getGradientId(xAxisId)) ||
                    undefined;
                if (process.env.NODE_ENV !== 'production') {
                    if (xData === undefined) {
                        throw new Error("MUI X Charts: ".concat(xAxisId === constants_1.DEFAULT_X_AXIS_KEY
                            ? 'The first `xAxis`'
                            : "The x-axis with id \"".concat(xAxisId, "\""), " should have data property to be able to display a line plot."));
                    }
                    if (xData.length < stackedData.length) {
                        throw new Error("MUI X Charts: The data length of the x axis (".concat(xData.length, " items) is lower than the length of series (").concat(stackedData.length, " items)."));
                    }
                }
                var shouldExpand = (curve === null || curve === void 0 ? void 0 : curve.includes('step')) && !strictStepCurve && (0, scaleGuards_1.isOrdinalScale)(xScale);
                var formattedData = (_a = xData === null || xData === void 0 ? void 0 : xData.flatMap(function (x, index) {
                    var _a, _b;
                    var nullData = data[index] == null;
                    if (shouldExpand) {
                        var rep = [{ x: x, y: visibleStackedData[index], nullData: nullData, isExtension: false }];
                        if (!nullData && (index === 0 || data[index - 1] == null)) {
                            rep.unshift({
                                x: ((_a = xScale(x)) !== null && _a !== void 0 ? _a : 0) - (xScale.step() - xScale.bandwidth()) / 2,
                                y: visibleStackedData[index],
                                nullData: nullData,
                                isExtension: true,
                            });
                        }
                        if (!nullData && (index === data.length - 1 || data[index + 1] == null)) {
                            rep.push({
                                x: ((_b = xScale(x)) !== null && _b !== void 0 ? _b : 0) + (xScale.step() + xScale.bandwidth()) / 2,
                                y: visibleStackedData[index],
                                nullData: nullData,
                                isExtension: true,
                            });
                        }
                        return rep;
                    }
                    return { x: x, y: visibleStackedData[index], nullData: nullData };
                })) !== null && _a !== void 0 ? _a : [];
                var d3Data = connectNulls ? formattedData.filter(function (d) { return !d.nullData; }) : formattedData;
                var areaPath = (0, d3_shape_1.area)()
                    .x(function (d) { return (d.isExtension ? d.x : xPosition(d.x)); })
                    .defined(function (d) { return connectNulls || !d.nullData || !!d.isExtension; })
                    .y0(function (d) {
                    if (typeof baseline === 'number') {
                        return yScale(baseline);
                    }
                    if (baseline === 'max') {
                        return yScale.range()[1];
                    }
                    if (baseline === 'min') {
                        return yScale.range()[0];
                    }
                    var value = d.y && yScale(d.y[0]);
                    if (Number.isNaN(value)) {
                        return yScale.range()[0];
                    }
                    return value;
                })
                    .y1(function (d) { return d.y && yScale(d.y[1]); });
                var d = areaPath.curve((0, getCurve_1.getCurveFactory)(curve))(d3Data) || '';
                areaPlotData.push({
                    area: series[seriesId].area,
                    color: series[seriesId].color,
                    gradientId: gradientId,
                    d: d,
                    seriesId: seriesId,
                });
            };
            for (var i = groupIds.length - 1; i >= 0; i -= 1) {
                _loop_1(i);
            }
        }
        return areaPlotData;
    }, [seriesData, defaultXAxisId, defaultYAxisId, xAxes, yAxes, getGradientId]);
    return allData;
}
