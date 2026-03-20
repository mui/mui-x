"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scalePoint = scalePoint;
var scaleBand_1 = require("./scaleBand");
function scalePoint() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    // ScalePoint is essentially ScaleBand with paddingInner(1)
    var scale = scaleBand_1.scaleBand.apply(void 0, args).paddingInner(1);
    // Remove paddingInner method and make padding alias to paddingOuter
    var originalCopy = scale.copy;
    scale.padding = scale.paddingOuter;
    delete scale.paddingInner;
    delete scale.paddingOuter;
    scale.copy = function () {
        var copied = originalCopy();
        copied.padding = copied.paddingOuter;
        delete copied.paddingInner;
        delete copied.paddingOuter;
        copied.copy = scale.copy;
        return copied;
    };
    return scale;
}
