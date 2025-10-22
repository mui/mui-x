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
var getSeriesWithDefaultValues = function (seriesData, seriesIndex, colors) {
    var _a;
    return __assign({ id: (_a = seriesData.id) !== null && _a !== void 0 ? _a : "auto-generated-id-".concat(seriesIndex), color: colors[seriesIndex % colors.length] }, seriesData);
};
exports.default = getSeriesWithDefaultValues;
