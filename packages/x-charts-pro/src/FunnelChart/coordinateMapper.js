"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPositionGetter = void 0;
var internals_1 = require("@mui/x-charts/internals");
var createPositionGetter = function (scale, isCategoryDirection, gap, ordinalScaleData) {
    return function (value, bandIndex, stackOffset, useBand) {
        if ((0, internals_1.isOrdinalScale)(scale)) {
            var position = scale(ordinalScaleData === null || ordinalScaleData === void 0 ? void 0 : ordinalScaleData[bandIndex]);
            return useBand ? position + scale.bandwidth() : position;
        }
        if (isCategoryDirection) {
            return scale(value + (stackOffset || 0)) + bandIndex * gap;
        }
        return scale(value);
    };
};
exports.createPositionGetter = createPositionGetter;
