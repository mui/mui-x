"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invertScale = invertScale;
var isBandScale_1 = require("./isBandScale");
function invertScale(scale, data, value) {
    if ((0, isBandScale_1.isBandScale)(scale)) {
        var dataIndex = scale.bandwidth() === 0
            ? Math.floor((value - Math.min.apply(Math, scale.range()) + scale.step() / 2) / scale.step())
            : Math.floor((value - Math.min.apply(Math, scale.range())) / scale.step());
        return data[dataIndex];
    }
    return scale.invert(value);
}
