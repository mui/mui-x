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
var seriesProcessor = function (params) {
    var seriesOrder = params.seriesOrder, series = params.series;
    var defaultizedSeries = {};
    seriesOrder.forEach(function (seriesId) {
        var _a, _b, _c, _d;
        var arcs = (0, d3_shape_1.pie)()
            .startAngle((2 * Math.PI * ((_a = series[seriesId].startAngle) !== null && _a !== void 0 ? _a : 0)) / 360)
            .endAngle((2 * Math.PI * ((_b = series[seriesId].endAngle) !== null && _b !== void 0 ? _b : 360)) / 360)
            .padAngle((2 * Math.PI * ((_c = series[seriesId].paddingAngle) !== null && _c !== void 0 ? _c : 0)) / 360)
            .sortValues(getSortingComparator((_d = series[seriesId].sortingValues) !== null && _d !== void 0 ? _d : 'none'))(series[seriesId].data.map(function (piePoint) { return piePoint.value; }));
        defaultizedSeries[seriesId] = __assign(__assign({ labelMarkType: 'circle', valueFormatter: function (item) { return item.value.toLocaleString(); } }, series[seriesId]), { data: series[seriesId].data
                .map(function (item, index) {
                var _a;
                return (__assign(__assign(__assign({}, item), { id: (_a = item.id) !== null && _a !== void 0 ? _a : "auto-generated-pie-id-".concat(seriesId, "-").concat(index) }), arcs[index]));
            })
                .map(function (item, index) {
                var _a, _b, _c;
                return (__assign(__assign({ labelMarkType: 'circle' }, item), { formattedValue: (_c = (_b = (_a = series[seriesId]).valueFormatter) === null || _b === void 0 ? void 0 : _b.call(_a, __assign(__assign({}, item), { label: (0, getLabel_1.getLabel)(item.label, 'arc') }), { dataIndex: index })) !== null && _c !== void 0 ? _c : item.value.toLocaleString() }));
            }) });
    });
    return {
        seriesOrder: seriesOrder,
        series: defaultizedSeries,
    };
};
exports.default = seriesProcessor;
