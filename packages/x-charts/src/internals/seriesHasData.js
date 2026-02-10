"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seriesHasData = seriesHasData;
function seriesHasData(series, type, seriesId) {
    var _a, _b;
    // @ts-ignore sankey is not in MIT version
    if (type === 'sankey') {
        return false;
    }
    var data = (_b = (_a = series[type]) === null || _a === void 0 ? void 0 : _a.series[seriesId]) === null || _b === void 0 ? void 0 : _b.data;
    return data != null && data.length > 0;
}
