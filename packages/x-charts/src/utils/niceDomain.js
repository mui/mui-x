"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.niceDomain = niceDomain;
var getScale_1 = require("../internals/getScale");
function niceDomain(scaleType, domain, count) {
    if (count === void 0) { count = 5; }
    var scale = (0, getScale_1.getScale)(scaleType, domain, [0, 1]);
    scale.nice(count);
    return scale.domain();
}
