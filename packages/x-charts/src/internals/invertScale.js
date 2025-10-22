"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invertScale = invertScale;
var scaleGuards_1 = require("./scaleGuards");
function invertScale(scale, data, value) {
    if ((0, scaleGuards_1.isOrdinalScale)(scale)) {
        var dataIndex = scale.bandwidth() === 0
            ? Math.floor((value - Math.min.apply(Math, scale.range()) + scale.step() / 2) / scale.step())
            : Math.floor((value - Math.min.apply(Math, scale.range())) / scale.step());
        return data[dataIndex];
    }
    return scale.invert(value);
}
