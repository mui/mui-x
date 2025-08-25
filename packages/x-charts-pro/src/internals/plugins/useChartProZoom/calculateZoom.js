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
exports.calculateZoom = calculateZoom;
/**
 * Calculates the new zoom range based on the current zoom, step, and constraints.
 *
 * A step of 0.1 or -0.1 means that 10% of the current range will be subtracted/added, respectively, and assuming no
 * constraints (e.g., minSpan, maxEnd) are faced.
 *
 * @param zoom Current zoom range with start and end values.
 * @param step Percentage of the current zoom range to adjust (positive to zoom in, negative to zoom out). Ranges from 0 to 1.
 * @param minSpan Minimum allowed span between start and end values.
 * @param maxSpan Maximum allowed span between start and end values.
 * @param minStart Minimum allowed start value.
 * @param maxEnd Maximum allowed end value.
 */
function calculateZoom(zoom, step, _a) {
    var minSpan = _a.minSpan, maxSpan = _a.maxSpan, minStart = _a.minStart, maxEnd = _a.maxEnd;
    var span = zoom.end - zoom.start;
    var delta = (span * step) / 2;
    if (delta > 0) {
        delta = Math.min(delta, (span - minSpan) / 2);
    }
    else {
        delta = Math.max(delta, (span - maxSpan) / 2);
    }
    return __assign(__assign({}, zoom), { start: Math.max(minStart, zoom.start + delta), end: Math.min(maxEnd, zoom.end - delta) });
}
