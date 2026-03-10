"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invertScale = invertScale;
exports.getDataIndexForOrdinalScaleValue = getDataIndexForOrdinalScaleValue;
var scaleGuards_1 = require("./scaleGuards");
function invertScale(scale, data, value) {
    if ((0, scaleGuards_1.isOrdinalScale)(scale)) {
        var dataIndex = getDataIndexForOrdinalScaleValue(scale, value);
        return data[dataIndex];
    }
    return scale.invert(value);
}
/**
 * Get the data index for a given value on an ordinal scale.
 */
function getDataIndexForOrdinalScaleValue(scale, value) {
    var dataIndex = scale.bandwidth() === 0
        ? Math.floor((value - Math.min.apply(Math, scale.range()) + scale.step() / 2) / scale.step())
        : Math.floor((value - Math.min.apply(Math, scale.range())) / scale.step());
    return dataIndex;
}
