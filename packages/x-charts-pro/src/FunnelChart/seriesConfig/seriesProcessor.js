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
Object.defineProperty(exports, "__esModule", { value: true });
var createPoint = function (_a) {
    var main = _a.main, other = _a.other, inverse = _a.inverse, useBandWidth = _a.useBandWidth, stackOffset = _a.stackOffset;
    return inverse
        ? { x: other, y: main, useBandWidth: useBandWidth, stackOffset: stackOffset }
        : { x: main, y: other, useBandWidth: useBandWidth, stackOffset: stackOffset };
};
var getFunnelDirection = function (funnelDirection, curve, firstValue, lastValue) {
    if (curve !== 'step' &&
        curve !== 'linear-sharp' &&
        (funnelDirection === 'increasing' || funnelDirection === 'decreasing')) {
        return funnelDirection;
    }
    // Implicit check for null or undefined values
    return firstValue != null && lastValue != null && firstValue < lastValue
        ? 'increasing'
        : 'decreasing';
};
var seriesProcessor = function (params) {
    var seriesOrder = params.seriesOrder, series = params.series;
    var completedSeries = {};
    var isHorizontal = seriesOrder.some(function (seriesId) { return series[seriesId].layout === 'horizontal'; });
    seriesOrder.forEach(function (seriesId) {
        var currentSeries = series[seriesId];
        var firstDataPoint = currentSeries.data.at(0);
        var lastDataPoint = currentSeries.data.at(-1);
        var funnelDirection = getFunnelDirection(currentSeries.funnelDirection, currentSeries.curve, firstDataPoint === null || firstDataPoint === void 0 ? void 0 : firstDataPoint.value, lastDataPoint === null || lastDataPoint === void 0 ? void 0 : lastDataPoint.value);
        completedSeries[seriesId] = __assign(__assign({ labelMarkType: 'square', layout: isHorizontal ? 'horizontal' : 'vertical', valueFormatter: function (item) { return (item == null ? '' : item.value.toLocaleString()); } }, currentSeries), { data: currentSeries.data.map(function (v, i) {
                var _a;
                return (__assign({ id: "".concat(seriesId, "-funnel-item-").concat((_a = v.id) !== null && _a !== void 0 ? _a : i) }, v));
            }), funnelDirection: funnelDirection, dataPoints: [] });
        var stackOffsets = completedSeries[seriesId].data
            .toReversed()
            .map(function (_, i, array) { return array.slice(0, i).reduce(function (acc, item) { return acc + item.value; }, 0); })
            .toReversed();
        completedSeries[seriesId].dataPoints = completedSeries[seriesId].data.map(function (item, dataIndex, array) {
            var _a, _b;
            // Main = main axis, Other = other axis
            // For horizontal layout, main is y, other is x
            // For vertical layout, main is x, other is y
            var isIncreasing = completedSeries[seriesId].funnelDirection === 'increasing';
            var currentMaxMain = 0;
            var nextMaxMain = 0;
            var nextDataIndex = 0;
            if (isIncreasing) {
                nextDataIndex = dataIndex === 0 ? dataIndex : dataIndex - 1;
                currentMaxMain = (_a = array[nextDataIndex].value) !== null && _a !== void 0 ? _a : 0;
                nextMaxMain = item.value;
            }
            else {
                nextDataIndex = dataIndex === array.length - 1 ? dataIndex : dataIndex + 1;
                currentMaxMain = item.value;
                nextMaxMain = (_b = array[nextDataIndex].value) !== null && _b !== void 0 ? _b : 0;
            }
            var stackOffset = stackOffsets[dataIndex];
            var nextMaxOther = 0;
            var currentMaxOther = completedSeries[seriesId].data[dataIndex].value;
            return [
                // Top right (vertical) or Top left (horizontal)
                createPoint({
                    main: currentMaxMain,
                    other: currentMaxOther,
                    inverse: isHorizontal,
                    useBandWidth: false,
                    stackOffset: stackOffset,
                }),
                // Bottom right (vertical) or Top right (horizontal)
                createPoint({
                    main: nextMaxMain,
                    other: nextMaxOther,
                    inverse: isHorizontal,
                    useBandWidth: true,
                    stackOffset: stackOffset,
                }),
                // Bottom left (vertical) or Bottom right (horizontal)
                createPoint({
                    main: -nextMaxMain,
                    other: nextMaxOther,
                    inverse: isHorizontal,
                    useBandWidth: true,
                    stackOffset: stackOffset,
                }),
                // Top left (vertical) or Bottom left (horizontal)
                createPoint({
                    main: -currentMaxMain,
                    other: currentMaxOther,
                    inverse: isHorizontal,
                    useBandWidth: false,
                    stackOffset: stackOffset,
                }),
            ];
        });
    });
    return {
        seriesOrder: seriesOrder,
        series: completedSeries,
    };
};
exports.default = seriesProcessor;
