"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLinePlotData = useLinePlotData;
var React = require("react");
var warning_1 = require("@mui/x-internals/warning");
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var useChartGradientId_1 = require("../hooks/useChartGradientId");
var scaleGuards_1 = require("../internals/scaleGuards");
var getCurve_1 = require("../internals/getCurve");
var hooks_1 = require("../hooks");
var constants_1 = require("../constants");
function useLinePlotData(xAxes, yAxes) {
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
        var linePlotData = [];
        for (var _i = 0, stackingGroups_1 = stackingGroups; _i < stackingGroups_1.length; _i++) {
            var stackingGroup = stackingGroups_1[_i];
            var groupIds = stackingGroup.ids;
            var _loop_1 = function (seriesId) {
                var _c = series[seriesId], _d = _c.xAxisId, xAxisId = _d === void 0 ? defaultXAxisId : _d, _e = _c.yAxisId, yAxisId = _e === void 0 ? defaultYAxisId : _e, stackedData = _c.stackedData, visibleStackedData = _c.visibleStackedData, data = _c.data, connectNulls = _c.connectNulls, curve = _c.curve, strictStepCurve = _c.strictStepCurve;
                if (!(xAxisId in xAxes) || !(yAxisId in yAxes)) {
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
                        (0, warning_1.warnOnce)("MUI X Charts: The data length of the x axis (".concat(xData.length, " items) is lower than the length of series (").concat(stackedData.length, " items)."), 'error');
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
                var hidden = series[seriesId].hidden;
                var linePath = (0, d3_shape_1.line)()
                    .x(function (d) { return (d.isExtension ? d.x : xPosition(d.x)); })
                    .defined(function (d) { return connectNulls || !d.nullData || !!d.isExtension; })
                    .y(function (d) {
                    if (hidden) {
                        return yScale(yScale.domain()[0]);
                    }
                    return yScale(d.y[1]);
                });
                var d = linePath.curve((0, getCurve_1.getCurveFactory)(curve))(d3Data) || '';
                linePlotData.push({
                    color: series[seriesId].color,
                    gradientId: gradientId,
                    d: d,
                    seriesId: seriesId,
                    hidden: series[seriesId].hidden,
                });
            };
            for (var _b = 0, groupIds_1 = groupIds; _b < groupIds_1.length; _b++) {
                var seriesId = groupIds_1[_b];
                _loop_1(seriesId);
            }
        }
        return linePlotData;
    }, [seriesData, defaultXAxisId, defaultYAxisId, xAxes, yAxes, getGradientId]);
    return allData;
}
