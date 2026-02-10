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
var seriesProcessor = function (_a, dataset, isItemVisible) {
    var series = _a.series, seriesOrder = _a.seriesOrder;
    var completeSeries = Object.fromEntries(Object.entries(series).map(function (_a) {
        var _b, _c, _d;
        var seriesId = _a[0], seriesData = _a[1];
        var datasetKeys = seriesData === null || seriesData === void 0 ? void 0 : seriesData.datasetKeys;
        var missingKeys = ['x', 'y'].filter(function (key) { return typeof (datasetKeys === null || datasetKeys === void 0 ? void 0 : datasetKeys[key]) !== 'string'; });
        if ((seriesData === null || seriesData === void 0 ? void 0 : seriesData.datasetKeys) && missingKeys.length > 0) {
            throw new Error([
                "MUI X Charts: scatter series with id='".concat(seriesId, "' has incomplete datasetKeys."),
                "Properties ".concat(missingKeys.map(function (key) { return "\"".concat(key, "\""); }).join(', '), " are missing."),
            ].join('\n'));
        }
        var data = !datasetKeys
            ? ((_b = seriesData.data) !== null && _b !== void 0 ? _b : [])
            : ((_c = dataset === null || dataset === void 0 ? void 0 : dataset.map(function (d) {
                var _a, _b;
                return {
                    x: (_a = d[datasetKeys.x]) !== null && _a !== void 0 ? _a : null,
                    y: (_b = d[datasetKeys.y]) !== null && _b !== void 0 ? _b : null,
                    z: datasetKeys.z && d[datasetKeys.z],
                    id: datasetKeys.id && d[datasetKeys.id],
                };
            })) !== null && _c !== void 0 ? _c : []);
        return [
            seriesId,
            __assign(__assign({ labelMarkType: 'circle', markerSize: 4 }, seriesData), { preview: __assign({ markerSize: 1 }, seriesData === null || seriesData === void 0 ? void 0 : seriesData.preview), data: data, hidden: !(isItemVisible === null || isItemVisible === void 0 ? void 0 : isItemVisible({ type: 'scatter', seriesId: seriesId })), valueFormatter: (_d = seriesData.valueFormatter) !== null && _d !== void 0 ? _d : (function (v) { return v && "(".concat(v.x, ", ").concat(v.y, ")"); }) }),
        ];
    }));
    return {
        series: completeSeries,
        seriesOrder: seriesOrder,
    };
};
exports.default = seriesProcessor;
