"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickNumber = getTickNumber;
exports.scaleTickNumberByRange = scaleTickNumberByRange;
exports.getDefaultTickNumber = getDefaultTickNumber;
function getTickNumber(params, domain, defaultTickNumber) {
    var tickMaxStep = params.tickMaxStep, tickMinStep = params.tickMinStep, tickNumber = params.tickNumber;
    var maxTicks = tickMinStep === undefined ? 999 : Math.floor(Math.abs(domain[1] - domain[0]) / tickMinStep);
    var minTicks = tickMaxStep === undefined ? 2 : Math.ceil(Math.abs(domain[1] - domain[0]) / tickMaxStep);
    var defaultizedTickNumber = tickNumber !== null && tickNumber !== void 0 ? tickNumber : defaultTickNumber;
    return Math.min(maxTicks, Math.max(minTicks, defaultizedTickNumber));
}
function scaleTickNumberByRange(tickNumber, range) {
    var rangeGap = range[1] - range[0];
    /* If the range start and end are the same, `tickNumber` will become infinity, so we default to 1. */
    if (rangeGap === 0) {
        return 1;
    }
    return tickNumber / ((range[1] - range[0]) / 100);
}
function getDefaultTickNumber(dimension) {
    return Math.floor(Math.abs(dimension) / 50);
}
