"use strict";
'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkPlot = MarkPlot;
var prop_types_1 = require("prop-types");
var React = require("react");
var constants_1 = require("../constants");
var useSkipAnimation_1 = require("../hooks/useSkipAnimation");
var useChartId_1 = require("../hooks/useChartId");
var useScale_1 = require("../hooks/useScale");
var useLineSeries_1 = require("../hooks/useLineSeries");
var cleanId_1 = require("../internals/cleanId");
var CircleMarkElement_1 = require("./CircleMarkElement");
var getColor_1 = require("./seriesConfig/getColor");
var MarkElement_1 = require("./MarkElement");
var ChartProvider_1 = require("../context/ChartProvider");
var hooks_1 = require("../hooks");
var useInternalIsZoomInteracting_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting");
var useChartCartesianAxis_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var useSelector_1 = require("../internals/store/useSelector");
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkPlot API](https://mui.com/x/api/charts/mark-plot/)
 */
function MarkPlot(props) {
    var slots = props.slots, slotProps = props.slotProps, inSkipAnimation = props.skipAnimation, onItemClick = props.onItemClick, other = __rest(props, ["slots", "slotProps", "skipAnimation", "onItemClick"]);
    var isZoomInteracting = (0, useInternalIsZoomInteracting_1.useInternalIsZoomInteracting)();
    var skipAnimation = (0, useSkipAnimation_1.useSkipAnimation)(isZoomInteracting || inSkipAnimation);
    var seriesData = (0, useLineSeries_1.useLineSeriesContext)();
    var _a = (0, hooks_1.useXAxes)(), xAxis = _a.xAxis, xAxisIds = _a.xAxisIds;
    var _b = (0, hooks_1.useYAxes)(), yAxis = _b.yAxis, yAxisIds = _b.yAxisIds;
    var chartId = (0, useChartId_1.useChartId)();
    var _c = (0, ChartProvider_1.useChartContext)(), instance = _c.instance, store = _c.store;
    var _d = (0, hooks_1.useItemHighlightedGetter)(), isFaded = _d.isFaded, isHighlighted = _d.isHighlighted;
    var xAxisHighlightIndexes = (0, useSelector_1.useSelector)(store, useChartCartesianAxis_1.selectorChartsHighlightXAxisIndex);
    var highlightedItems = React.useMemo(function () {
        var rep = {};
        for (var _i = 0, xAxisHighlightIndexes_1 = xAxisHighlightIndexes; _i < xAxisHighlightIndexes_1.length; _i++) {
            var _a = xAxisHighlightIndexes_1[_i], dataIndex = _a.dataIndex, axisId = _a.axisId;
            if (rep[axisId] === undefined) {
                rep[axisId] = new Set([dataIndex]);
            }
            else {
                rep[axisId].add(dataIndex);
            }
        }
        return rep;
    }, [xAxisHighlightIndexes]);
    if (seriesData === undefined) {
        return null;
    }
    var series = seriesData.series, stackingGroups = seriesData.stackingGroups;
    var defaultXAxisId = xAxisIds[0];
    var defaultYAxisId = yAxisIds[0];
    return (<g {...other}>
      {stackingGroups.flatMap(function (_a) {
            var groupIds = _a.ids;
            return groupIds.map(function (seriesId) {
                var _a;
                var _b = series[seriesId], _c = _b.xAxisId, xAxisId = _c === void 0 ? defaultXAxisId : _c, _d = _b.yAxisId, yAxisId = _d === void 0 ? defaultYAxisId : _d, stackedData = _b.stackedData, data = _b.data, _e = _b.showMark, showMark = _e === void 0 ? true : _e, _f = _b.shape, shape = _f === void 0 ? 'circle' : _f;
                if (showMark === false) {
                    return null;
                }
                var xScale = (0, useScale_1.getValueToPositionMapper)(xAxis[xAxisId].scale);
                var yScale = yAxis[yAxisId].scale;
                var xData = xAxis[xAxisId].data;
                if (xData === undefined) {
                    throw new Error("MUI X Charts: ".concat(xAxisId === constants_1.DEFAULT_X_AXIS_KEY
                        ? 'The first `xAxis`'
                        : "The x-axis with id \"".concat(xAxisId, "\""), " should have data property to be able to display a line plot."));
                }
                var clipId = (0, cleanId_1.cleanId)("".concat(chartId, "-").concat(seriesId, "-line-clip")); // We assume that if displaying line mark, the line will also be rendered
                var colorGetter = (0, getColor_1.default)(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);
                var Mark = (_a = slots === null || slots === void 0 ? void 0 : slots.mark) !== null && _a !== void 0 ? _a : (shape === 'circle' ? CircleMarkElement_1.CircleMarkElement : MarkElement_1.MarkElement);
                var isSeriesHighlighted = isHighlighted({ seriesId: seriesId });
                var isSeriesFaded = !isSeriesHighlighted && isFaded({ seriesId: seriesId });
                return (<g key={seriesId} clipPath={"url(#".concat(clipId, ")")} data-series={seriesId}>
              {xData === null || xData === void 0 ? void 0 : xData.map(function (x, index) {
                        var value = data[index] == null ? null : stackedData[index][1];
                        return {
                            x: xScale(x),
                            y: value === null ? null : yScale(value),
                            position: x,
                            value: value,
                            index: index,
                        };
                    }).filter(function (_a) {
                        var x = _a.x, y = _a.y, index = _a.index, position = _a.position, value = _a.value;
                        if (value === null || y === null) {
                            // Remove missing data point
                            return false;
                        }
                        if (!instance.isPointInside(x, y)) {
                            // Remove out of range
                            return false;
                        }
                        if (showMark === true) {
                            return true;
                        }
                        return showMark({
                            x: x,
                            y: y,
                            index: index,
                            position: position,
                            value: value,
                        });
                    }).map(function (_a) {
                        var _b;
                        var x = _a.x, y = _a.y, index = _a.index;
                        return (<Mark key={"".concat(seriesId, "-").concat(index)} id={seriesId} dataIndex={index} shape={shape} color={colorGetter(index)} x={x} y={y} // Don't know why TS doesn't get from the filter that y can't be null
                         skipAnimation={skipAnimation} onClick={onItemClick &&
                                (function (event) {
                                    return onItemClick(event, { type: 'line', seriesId: seriesId, dataIndex: index });
                                })} isHighlighted={((_b = highlightedItems[xAxisId]) === null || _b === void 0 ? void 0 : _b.has(index)) || isSeriesHighlighted} isFaded={isSeriesFaded} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.mark}/>);
                    })}
            </g>);
            });
        })}
    </g>);
}
MarkPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Callback fired when a line mark item is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {LineItemIdentifier} lineItemIdentifier The line mark item identifier.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * If `true`, animations are skipped.
     */
    skipAnimation: prop_types_1.default.bool,
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
     */
    slots: prop_types_1.default.object,
};
