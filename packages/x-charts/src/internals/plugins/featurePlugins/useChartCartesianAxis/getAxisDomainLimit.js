"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxisDomainLimit = void 0;
var getAxisDomainLimit = function (axis, axisDirection, axisIndex, formattedSeries) {
    var _a, _b;
    if (axis.domainLimit !== undefined) {
        return axis.domainLimit;
    }
    if (axisDirection === 'x') {
        for (var _i = 0, _c = (_b = (_a = formattedSeries.line) === null || _a === void 0 ? void 0 : _a.seriesOrder) !== null && _b !== void 0 ? _b : []; _i < _c.length; _i++) {
            var seriesId = _c[_i];
            var series = formattedSeries.line.series[seriesId];
            if (series.xAxisId === axis.id || (series.xAxisId === undefined && axisIndex === 0)) {
                return 'strict';
            }
        }
    }
    return 'nice';
};
exports.getAxisDomainLimit = getAxisDomainLimit;
