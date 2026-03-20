"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaleSymlog = scaleSymlog;
var d3_scale_1 = require("@mui/x-charts-vendor/d3-scale");
function scaleSymlog() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scale = d3_scale_1.scaleSymlog.apply(void 0, args);
    var originalTicks = scale.ticks;
    var _a = generateScales(scale), negativeScale = _a.negativeScale, linearScale = _a.linearScale, positiveScale = _a.positiveScale;
    // Workaround for https://github.com/d3/d3-scale/issues/162
    scale.ticks = function (count) {
        var ticks = originalTicks(count);
        var constant = scale.constant();
        var negativeLogTickCount = 0;
        var linearTickCount = 0;
        var positiveLogTickCount = 0;
        ticks.forEach(function (tick) {
            if (tick > -constant && tick < constant) {
                linearTickCount += 1;
            }
            if (tick <= -constant) {
                negativeLogTickCount += 1;
            }
            if (tick >= constant) {
                positiveLogTickCount += 1;
            }
        });
        var finalTicks = [];
        if (negativeLogTickCount > 0) {
            finalTicks.push.apply(finalTicks, negativeScale.ticks(negativeLogTickCount));
        }
        if (linearTickCount > 0) {
            var linearTicks = linearScale.ticks(linearTickCount);
            if (finalTicks.at(-1) === linearTicks[0]) {
                finalTicks.push.apply(finalTicks, linearTicks.slice(1));
            }
            else {
                finalTicks.push.apply(finalTicks, linearTicks);
            }
        }
        if (positiveLogTickCount > 0) {
            var positiveTicks = positiveScale.ticks(positiveLogTickCount);
            if (finalTicks.at(-1) === positiveTicks[0]) {
                finalTicks.push.apply(finalTicks, positiveTicks.slice(1));
            }
            else {
                finalTicks.push.apply(finalTicks, positiveTicks);
            }
        }
        return finalTicks;
    };
    scale.tickFormat = function (count, specifier) {
        if (count === void 0) { count = 10; }
        // Calculates the proportion of the domain that each scale occupies, and use that ratio to determine the number of ticks for each scale.
        var constant = scale.constant();
        var _a = scale.domain(), start = _a[0], end = _a[1];
        var extent = end - start;
        var negativeScaleDomain = negativeScale.domain();
        var negativeScaleExtent = negativeScaleDomain[1] - negativeScaleDomain[0];
        var negativeScaleRatio = extent === 0 ? 0 : negativeScaleExtent / extent;
        var negativeScaleTickCount = negativeScaleRatio * count;
        var linearScaleDomain = linearScale.domain();
        var linearScaleExtent = linearScaleDomain[1] - linearScaleDomain[0];
        var linearScaleRatio = extent === 0 ? 0 : linearScaleExtent / extent;
        var linearScaleTickCount = linearScaleRatio * count;
        var positiveScaleDomain = positiveScale.domain();
        var positiveScaleExtent = positiveScaleDomain[1] - positiveScaleDomain[0];
        var positiveScaleRatio = extent === 0 ? 0 : positiveScaleExtent / extent;
        var positiveScaleTickCount = positiveScaleRatio * count;
        var negativeTickFormat = negativeScale.tickFormat(negativeScaleTickCount, specifier);
        var linearTickFormat = linearScale.tickFormat(linearScaleTickCount, specifier);
        var positiveTickFormat = positiveScale.tickFormat(positiveScaleTickCount, specifier);
        return function (tick) {
            var tickFormat = 
            // eslint-disable-next-line no-nested-ternary
            tick.valueOf() <= -constant
                ? negativeTickFormat
                : tick.valueOf() >= constant
                    ? positiveTickFormat
                    : linearTickFormat;
            return tickFormat(tick);
        };
    };
    /* Adaptation of https://github.com/d3/d3-scale/blob/d6904a4bde09e16005e0ad8ca3e25b10ce54fa0d/src/symlog.js#L30 */
    scale.copy = function () {
        return scaleSymlog(scale.domain(), scale.range()).constant(scale.constant());
    };
    return scale;
}
function generateScales(scale) {
    var constant = scale.constant();
    var domain = scale.domain();
    var negativeDomain = [domain[0], Math.min(domain[1], -constant)];
    var negativeLogScale = (0, d3_scale_1.scaleLog)(negativeDomain, scale.range());
    var linearDomain = [Math.max(domain[0], -constant), Math.min(domain[1], constant)];
    var linearScale = (0, d3_scale_1.scaleLinear)(linearDomain, scale.range());
    var positiveDomain = [Math.max(domain[0], constant), domain[1]];
    var positiveLogScale = (0, d3_scale_1.scaleLog)(positiveDomain, scale.range());
    return {
        negativeScale: negativeLogScale,
        linearScale: linearScale,
        positiveScale: positiveLogScale,
    };
}
