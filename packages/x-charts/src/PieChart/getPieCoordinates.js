"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPieCoordinates = getPieCoordinates;
var getPercentageValue_1 = require("../internals/getPercentageValue");
function getPieCoordinates(series, drawing) {
    var height = drawing.height, width = drawing.width;
    var cxParam = series.cx, cyParam = series.cy;
    var availableRadius = Math.min(width, height) / 2;
    var cx = (0, getPercentageValue_1.getPercentageValue)(cxParam !== null && cxParam !== void 0 ? cxParam : '50%', width);
    var cy = (0, getPercentageValue_1.getPercentageValue)(cyParam !== null && cyParam !== void 0 ? cyParam : '50%', height);
    return { cx: cx, cy: cy, availableRadius: availableRadius };
}
