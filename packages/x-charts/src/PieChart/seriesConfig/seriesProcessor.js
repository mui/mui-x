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
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var getLabel_1 = require("../../internals/getLabel");
var angleConversion_1 = require("../../internals/angleConversion");
var getSortingComparator = function (comparator) {
    if (comparator === void 0) { comparator = 'none'; }
    if (typeof comparator === 'function') {
        return comparator;
    }
    switch (comparator) {
        case 'none':
            return null;
        case 'desc':
            return function (a, b) { return b - a; };
        case 'asc':
            return function (a, b) { return a - b; };
        default:
            return null;
    }
};
var seriesProcessor = function (params, dataset, isItemVisible) {
    var seriesOrder = params.seriesOrder, series = params.series;
    var defaultizedSeries = {};
    seriesOrder.forEach(function (seriesId) {
        var _a, _b, _c, _d;
        // Filter out hidden data points for arc calculation
        var visibleData = series[seriesId].data.filter(function (_, index) {
            return isItemVisible === null || isItemVisible === void 0 ? void 0 : isItemVisible({ type: 'pie', seriesId: seriesId, dataIndex: index });
        });
        var visibleArcs = (0, d3_shape_1.pie)()
            .startAngle((0, angleConversion_1.deg2rad)((_a = series[seriesId].startAngle) !== null && _a !== void 0 ? _a : 0))
            .endAngle((0, angleConversion_1.deg2rad)((_b = series[seriesId].endAngle) !== null && _b !== void 0 ? _b : 360))
            .padAngle((0, angleConversion_1.deg2rad)((_c = series[seriesId].paddingAngle) !== null && _c !== void 0 ? _c : 0))
            .sortValues(getSortingComparator((_d = series[seriesId].sortingValues) !== null && _d !== void 0 ? _d : 'none'))(visibleData.map(function (piePoint) { return piePoint.value; }));
        // Map arcs back to original data, maintaining original indices
        var visibleIndex = 0;
        defaultizedSeries[seriesId] = __assign(__assign({ labelMarkType: 'circle', valueFormatter: function (item) { return item.value.toLocaleString(); } }, series[seriesId]), { data: series[seriesId].data.map(function (item, index) {
                var _a, _b, _c, _d, _e;
                var itemId = (_a = item.id) !== null && _a !== void 0 ? _a : "auto-generated-pie-id-".concat(seriesId, "-").concat(index);
                var isHidden = !(isItemVisible === null || isItemVisible === void 0 ? void 0 : isItemVisible({ type: 'pie', seriesId: seriesId, dataIndex: index }));
                var arcData;
                if (isHidden) {
                    // For hidden items, create a zero-size arc starting at the previous visible arc's end angle
                    // and ending at the same angle
                    var startAngle = visibleIndex > 0
                        ? visibleArcs[visibleIndex - 1].endAngle
                        : (0, angleConversion_1.deg2rad)((_b = series[seriesId].startAngle) !== null && _b !== void 0 ? _b : 0);
                    arcData = {
                        startAngle: startAngle,
                        endAngle: startAngle,
                        padAngle: 0,
                        value: item.value,
                        index: index,
                    };
                }
                else {
                    arcData = visibleArcs[visibleIndex];
                    visibleIndex += 1;
                }
                var processedItem = __assign(__assign(__assign({}, item), { id: itemId, hidden: isHidden }), arcData);
                return __assign(__assign({ labelMarkType: 'circle' }, processedItem), { formattedValue: (_e = (_d = (_c = series[seriesId]).valueFormatter) === null || _d === void 0 ? void 0 : _d.call(_c, __assign(__assign({}, processedItem), { label: (0, getLabel_1.getLabel)(processedItem.label, 'arc') }), { dataIndex: index })) !== null && _e !== void 0 ? _e : processedItem.value.toLocaleString() });
            }) });
    });
    return {
        seriesOrder: seriesOrder,
        series: defaultizedSeries,
    };
};
exports.default = seriesProcessor;
