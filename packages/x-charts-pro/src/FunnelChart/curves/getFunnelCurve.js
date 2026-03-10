"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunnelCurve = void 0;
var step_1 = require("./step");
var linear_1 = require("./linear");
var bump_1 = require("./bump");
var pyramid_1 = require("./pyramid");
var step_pyramid_1 = require("./step-pyramid");
var curveConstructor = function (curve) {
    if (curve === 'step') {
        return step_1.Step;
    }
    if (curve === 'bump') {
        return bump_1.Bump;
    }
    if (curve === 'pyramid') {
        return pyramid_1.Pyramid;
    }
    if (curve === 'step-pyramid') {
        return step_pyramid_1.StepPyramid;
    }
    return linear_1.Linear;
};
var getFunnelCurve = function (curve, options) {
    if (curve === 'linear-sharp') {
        options.pointShape = 'sharp';
    }
    return function (context) {
        return new (curveConstructor(curve))(context, options);
    };
};
exports.getFunnelCurve = getFunnelCurve;
