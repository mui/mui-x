"use strict";
'use client';
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
exports.LineHighlightPlot = LineHighlightPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useStore_1 = require("../internals/store/useStore");
var LineHighlightElement_1 = require("./LineHighlightElement");
var useScale_1 = require("../hooks/useScale");
var constants_1 = require("../constants");
var useLineSeries_1 = require("../hooks/useLineSeries");
var getColor_1 = require("./seriesConfig/getColor");
var ChartProvider_1 = require("../context/ChartProvider");
var useChartCartesianAxis_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var useAxis_1 = require("../hooks/useAxis");
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightPlot API](https://mui.com/x/api/charts/line-highlight-plot/)
 */
function LineHighlightPlot(props) {
    var _a;
    var slots = props.slots, slotProps = props.slotProps, other = __rest(props, ["slots", "slotProps"]);
    var seriesData = (0, useLineSeries_1.useLineSeriesContext)();
    var _b = (0, useAxis_1.useXAxes)(), xAxis = _b.xAxis, xAxisIds = _b.xAxisIds;
    var _c = (0, useAxis_1.useYAxes)(), yAxis = _c.yAxis, yAxisIds = _c.yAxisIds;
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    var store = (0, useStore_1.useStore)();
    var highlightedIndexes = store.use(useChartCartesianAxis_1.selectorChartsHighlightXAxisIndex);
    if (highlightedIndexes.length === 0) {
        return null;
    }
    if (seriesData === undefined) {
        return null;
    }
    var series = seriesData.series, stackingGroups = seriesData.stackingGroups;
    var defaultXAxisId = xAxisIds[0];
    var defaultYAxisId = yAxisIds[0];
    var Element = (_a = slots === null || slots === void 0 ? void 0 : slots.lineHighlight) !== null && _a !== void 0 ? _a : LineHighlightElement_1.LineHighlightElement;
    return ((0, jsx_runtime_1.jsx)("g", __assign({}, other, { children: highlightedIndexes.flatMap(function (_a) {
            var highlightedIndex = _a.dataIndex, highlightedAxisId = _a.axisId;
            return stackingGroups.flatMap(function (_a) {
                var groupIds = _a.ids;
                return groupIds.flatMap(function (seriesId) {
                    var _a = series[seriesId], _b = _a.xAxisId, xAxisId = _b === void 0 ? defaultXAxisId : _b, _c = _a.yAxisId, yAxisId = _c === void 0 ? defaultYAxisId : _c, visibleStackedData = _a.visibleStackedData, data = _a.data, disableHighlight = _a.disableHighlight, _d = _a.shape, shape = _d === void 0 ? 'circle' : _d;
                    if (disableHighlight || data[highlightedIndex] == null) {
                        return null;
                    }
                    if (highlightedAxisId !== xAxisId) {
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
                    var x = xScale(xData[highlightedIndex]);
                    var y = yScale(visibleStackedData[highlightedIndex][1]); // This should not be undefined since y should not be a band scale
                    if (!instance.isPointInside(x, y)) {
                        return null;
                    }
                    var colorGetter = (0, getColor_1.default)(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);
                    return ((0, jsx_runtime_1.jsx)(Element, __assign({ seriesId: seriesId, color: colorGetter(highlightedIndex), x: x, y: y, shape: shape }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.lineHighlight), "".concat(seriesId)));
                });
            });
        }) })));
}
LineHighlightPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
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
