"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.FunnelPlot = FunnelPlot;
var React = require("react");
var prop_types_1 = require("prop-types");
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var internals_1 = require("@mui/x-charts/internals");
var FunnelSection_1 = require("./FunnelSection");
var labelUtils_1 = require("./labelUtils");
var useFunnelSeries_1 = require("../hooks/useFunnelSeries");
var curves_1 = require("./curves");
var FunnelSectionLabel_1 = require("./FunnelSectionLabel");
var useChartFunnelAxisRendering_selectors_1 = require("./funnelAxisPlugin/useChartFunnelAxisRendering.selectors");
internals_1.cartesianSeriesTypes.addType('funnel');
var useAggregatedData = function () {
    var seriesData = (0, useFunnelSeries_1.useFunnelSeriesContext)();
    var store = (0, internals_1.useStore)();
    var _a = (0, internals_1.useSelector)(store, useChartFunnelAxisRendering_selectors_1.selectorChartXAxis), xAxis = _a.axis, xAxisIds = _a.axisIds;
    var _b = (0, internals_1.useSelector)(store, useChartFunnelAxisRendering_selectors_1.selectorChartYAxis), yAxis = _b.axis, yAxisIds = _b.axisIds;
    var gap = (0, internals_1.useSelector)(store, useChartFunnelAxisRendering_selectors_1.selectorFunnelGap);
    var allData = React.useMemo(function () {
        if (seriesData === undefined) {
            return [];
        }
        var series = seriesData.series, seriesOrder = seriesData.seriesOrder;
        var defaultXAxisId = xAxisIds[0];
        var defaultYAxisId = yAxisIds[0];
        var isHorizontal = Object.values(series).some(function (s) { return s.layout === 'horizontal'; });
        var result = seriesOrder.map(function (seriesId) {
            var _a, _b, _c;
            var currentSeries = series[seriesId];
            var xAxisId = (_a = currentSeries.xAxisId) !== null && _a !== void 0 ? _a : defaultXAxisId;
            var yAxisId = (_b = currentSeries.yAxisId) !== null && _b !== void 0 ? _b : defaultYAxisId;
            var valueFormatter = currentSeries.valueFormatter;
            var baseScaleConfig = isHorizontal ? xAxis[xAxisId] : yAxis[yAxisId];
            var isXAxisBand = xAxis[xAxisId].scaleType === 'band';
            var isYAxisBand = yAxis[yAxisId].scaleType === 'band';
            var bandWidth = ((isXAxisBand || isYAxisBand) &&
                ((_c = baseScaleConfig.scale) === null || _c === void 0 ? void 0 : _c.bandwidth())) ||
                0;
            var xScale = xAxis[xAxisId].scale;
            var yScale = yAxis[yAxisId].scale;
            var xPosition = function (value, bandIndex, bandIdentifier, stackOffset, useBand) {
                if ((0, internals_1.isBandScale)(xScale)) {
                    var position = xScale(bandIdentifier);
                    return useBand ? position + bandWidth : position;
                }
                if (isHorizontal) {
                    return xScale(value + (stackOffset || 0)) + bandIndex * gap;
                }
                return xScale(value);
            };
            var yPosition = function (value, bandIndex, bandIdentifier, stackOffset, useBand) {
                if ((0, internals_1.isBandScale)(yScale)) {
                    var position = yScale(bandIdentifier);
                    return useBand ? position + bandWidth : position;
                }
                if (isHorizontal) {
                    return yScale(value);
                }
                return yScale(value + (stackOffset || 0)) + bandIndex * gap;
            };
            var allY = currentSeries.dataPoints.flatMap(function (d, dataIndex) {
                return d.flatMap(function (v) {
                    var _a;
                    return yPosition(v.y, dataIndex, (_a = baseScaleConfig.data) === null || _a === void 0 ? void 0 : _a[dataIndex], v.stackOffset, v.useBandWidth);
                });
            });
            var allX = currentSeries.dataPoints.flatMap(function (d, dataIndex) {
                return d.flatMap(function (v) {
                    var _a;
                    return xPosition(v.x, dataIndex, (_a = baseScaleConfig.data) === null || _a === void 0 ? void 0 : _a[dataIndex], v.stackOffset, v.useBandWidth);
                });
            });
            var minPoint = {
                x: Math.min.apply(Math, allX),
                y: Math.min.apply(Math, allY),
            };
            var maxPoint = {
                x: Math.max.apply(Math, allX),
                y: Math.max.apply(Math, allY),
            };
            return currentSeries.dataPoints.flatMap(function (values, dataIndex) {
                var _a;
                var color = currentSeries.data[dataIndex].color;
                var id = "".concat(seriesId, "-").concat(dataIndex);
                var sectionLabel = typeof currentSeries.sectionLabel === 'function'
                    ? currentSeries.sectionLabel({
                        dataIndex: dataIndex,
                        seriesId: seriesId,
                        value: currentSeries.data[dataIndex].value,
                    })
                    : currentSeries.sectionLabel;
                var isIncreasing = currentSeries.funnelDirection === 'increasing';
                var curve = (0, curves_1.getFunnelCurve)(currentSeries.curve, {
                    isHorizontal: isHorizontal,
                    gap: gap,
                    position: dataIndex,
                    sections: currentSeries.dataPoints.length,
                    borderRadius: currentSeries.borderRadius,
                    isIncreasing: isIncreasing,
                    min: minPoint,
                    max: maxPoint,
                });
                var bandPoints = curve({}).processPoints(values.map(function (v) {
                    var _a, _b;
                    return ({
                        x: xPosition(v.x, dataIndex, (_a = baseScaleConfig.data) === null || _a === void 0 ? void 0 : _a[dataIndex], v.stackOffset, v.useBandWidth),
                        y: yPosition(v.y, dataIndex, (_b = baseScaleConfig.data) === null || _b === void 0 ? void 0 : _b[dataIndex], v.stackOffset, v.useBandWidth),
                    });
                }));
                var line = (0, d3_shape_1.line)()
                    .x(function (v) { return v.x; })
                    .y(function (v) { return v.y; })
                    .curve(curve);
                return {
                    d: line(bandPoints),
                    color: color,
                    id: id,
                    seriesId: seriesId,
                    dataIndex: dataIndex,
                    variant: currentSeries.variant,
                    label: sectionLabel !== false && __assign(__assign(__assign({}, (0, labelUtils_1.positionLabel)(__assign(__assign({}, sectionLabel), { isHorizontal: isHorizontal, values: bandPoints }))), (0, labelUtils_1.alignLabel)(sectionLabel !== null && sectionLabel !== void 0 ? sectionLabel : {})), { value: valueFormatter
                            ? valueFormatter(currentSeries.data[dataIndex], { dataIndex: dataIndex })
                            : (_a = currentSeries.data[dataIndex].value) === null || _a === void 0 ? void 0 : _a.toLocaleString() }),
                };
            });
        });
        return result;
    }, [seriesData, xAxis, xAxisIds, yAxis, yAxisIds, gap]);
    return allData;
};
function FunnelPlot(props) {
    var onItemClick = props.onItemClick, other = __rest(props, ["onItemClick"]);
    var data = useAggregatedData();
    return (<React.Fragment>
      {data.map(function (series) {
            if (series.length === 0) {
                return null;
            }
            return (<g data-series={series[0].seriesId} key={series[0].seriesId}>
            {series.map(function (_a) {
                    var d = _a.d, color = _a.color, id = _a.id, seriesId = _a.seriesId, dataIndex = _a.dataIndex, variant = _a.variant;
                    return (<FunnelSection_1.FunnelSection {...other} d={d} color={color} key={id} dataIndex={dataIndex} seriesId={seriesId} variant={variant} onClick={onItemClick &&
                            (function (event) {
                                onItemClick(event, { type: 'funnel', seriesId: seriesId, dataIndex: dataIndex });
                            })}/>);
                })}
          </g>);
        })}
      {data.map(function (series) {
            if (series.length === 0) {
                return null;
            }
            return (<g data-series={series[0].seriesId} key={series[0].seriesId}>
            {series.map(function (_a) {
                    var id = _a.id, label = _a.label, seriesId = _a.seriesId, dataIndex = _a.dataIndex;
                    if (!label || !label.value) {
                        return null;
                    }
                    return (<FunnelSectionLabel_1.FunnelSectionLabel key={id} label={label} dataIndex={dataIndex} seriesId={seriesId} {...other}/>);
                })}
          </g>);
        })}
    </React.Fragment>);
}
FunnelPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Callback fired when a funnel item is clicked.
     * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
     * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
     */
    onItemClick: prop_types_1.default.func,
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
