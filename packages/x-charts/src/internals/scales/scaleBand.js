"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyof = keyof;
exports.scaleBand = scaleBand;
/* eslint-disable func-names */
// Adapted from d3-scale v4.0.2
// https://github.com/d3/d3-scale/blob/d6904a4bde09e16005e0ad8ca3e25b10ce54fa0d/src/band.js
var d3_array_1 = require("@mui/x-charts-vendor/d3-array");
function keyof(value) {
    if (Array.isArray(value)) {
        return JSON.stringify(value);
    }
    if (typeof value === 'object' && value !== null) {
        return value.valueOf();
    }
    return value;
}
function scaleBand() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    // @ts-expect-error, InternMap accepts two arguments, but its types are set as Map, which doesn't.
    var index = new d3_array_1.InternMap(undefined, keyof);
    var domain = [];
    var ordinalRange = [];
    var r0 = 0;
    var r1 = 1;
    var step;
    var bandwidth;
    var isRound = false;
    var paddingInner = 0;
    var paddingOuter = 0;
    var align = 0.5;
    var scale = function (d) {
        var i = index.get(d);
        if (i === undefined) {
            return undefined;
        }
        return ordinalRange[i % ordinalRange.length];
    };
    var rescale = function () {
        var n = domain.length;
        var reverse = r1 < r0;
        var start = reverse ? r1 : r0;
        var stop = reverse ? r0 : r1;
        step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
        if (isRound) {
            step = Math.floor(step);
        }
        var adjustedStart = start + (stop - start - step * (n - paddingInner)) * align;
        bandwidth = step * (1 - paddingInner);
        var finalStart = isRound ? Math.round(adjustedStart) : adjustedStart;
        var finalBandwidth = isRound ? Math.round(bandwidth) : bandwidth;
        bandwidth = finalBandwidth;
        var values = (0, d3_array_1.range)(n).map(function (i) { return finalStart + step * i; });
        ordinalRange = reverse ? values.reverse() : values;
        return scale;
    };
    scale.domain = function (_) {
        if (!arguments.length) {
            return domain.slice();
        }
        domain = [];
        // @ts-expect-error, InternMap accepts two arguments.
        index = new d3_array_1.InternMap(undefined, keyof);
        for (var _i = 0, _a = _; _i < _a.length; _i++) {
            var value = _a[_i];
            if (index.has(value)) {
                continue;
            }
            index.set(value, domain.push(value) - 1);
        }
        return rescale();
    };
    scale.range = function (_) {
        if (!arguments.length) {
            return [r0, r1];
        }
        var _a = _, v0 = _a[0], v1 = _a[1];
        r0 = +v0;
        r1 = +v1;
        return rescale();
    };
    scale.rangeRound = function (_) {
        var v0 = _[0], v1 = _[1];
        r0 = +v0;
        r1 = +v1;
        isRound = true;
        return rescale();
    };
    scale.bandwidth = function () {
        return bandwidth;
    };
    scale.step = function () {
        return step;
    };
    scale.round = function (_) {
        if (!arguments.length) {
            return isRound;
        }
        isRound = !!_;
        return rescale();
    };
    scale.padding = function (_) {
        if (!arguments.length) {
            return paddingInner;
        }
        paddingInner = Math.min(1, (paddingOuter = +_));
        return rescale();
    };
    scale.paddingInner = function (_) {
        if (!arguments.length) {
            return paddingInner;
        }
        paddingInner = Math.min(1, _);
        return rescale();
    };
    scale.paddingOuter = function (_) {
        if (!arguments.length) {
            return paddingOuter;
        }
        paddingOuter = +_;
        return rescale();
    };
    scale.align = function (_) {
        if (!arguments.length) {
            return align;
        }
        align = Math.max(0, Math.min(1, _));
        return rescale();
    };
    scale.copy = function () {
        return scaleBand(domain, [r0, r1])
            .round(isRound)
            .paddingInner(paddingInner)
            .paddingOuter(paddingOuter)
            .align(align);
    };
    // Initialize from arguments
    var arg0 = args[0], arg1 = args[1];
    if (args.length > 1) {
        scale.domain(arg0);
        scale.range(arg1);
    }
    else if (arg0) {
        scale.range(arg0);
    }
    else {
        rescale();
    }
    return scale;
}
