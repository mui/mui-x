"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoomScaleRange = void 0;
/**
 * Applies the zoom into the scale range.
 * It changes the screen coordinates that the scale covers.
 * Not the data that is displayed.
 *
 * @param scaleRange the original range in real screen coordinates.
 * @param zoomRange the zoom range in percentage.
 * @returns zoomed range in real screen coordinates.
 */
var zoomScaleRange = function (scaleRange, zoomRange) {
    var rangeGap = scaleRange[1] - scaleRange[0];
    var zoomGap = zoomRange[1] - zoomRange[0];
    // If current zoom show the scale between p1 and p2 percents
    // The range should be extended by adding [0, p1] and [p2, 100] segments
    var min = scaleRange[0] - (zoomRange[0] * rangeGap) / zoomGap;
    var max = scaleRange[1] + ((100 - zoomRange[1]) * rangeGap) / zoomGap;
    return [min, max];
};
exports.zoomScaleRange = zoomScaleRange;
