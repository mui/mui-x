"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScalarFormatter = createScalarFormatter;
/**
 * Creates a default formatter function for continuous scales (e.g., linear, sqrt, log).
 * @returns A formatter function for continuous values.
 */
function createScalarFormatter(tickNumber, zoomScale) {
    return function defaultScalarValueFormatter(value, context) {
        if (context.location === 'tick') {
            var domain = context.scale.domain();
            var zeroSizeDomain = domain[0] === domain[1];
            if (zeroSizeDomain) {
                return context.scale.tickFormat(1)(value);
            }
            return context.scale.tickFormat(tickNumber)(value);
        }
        if (context.location === 'zoom-slider-tooltip') {
            return zoomScale.tickFormat(2)(value);
        }
        return "".concat(value);
    };
}
