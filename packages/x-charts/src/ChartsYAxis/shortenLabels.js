"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenLabels = shortenLabels;
var clampAngle_1 = require("../internals/clampAngle");
var ellipsize_1 = require("../internals/ellipsize");
var domUtils_1 = require("../internals/domUtils");
function shortenLabels(visibleLabels, drawingArea, maxWidth, isRtl, tickLabelStyle) {
    var _a, _b;
    var _c;
    var shortenedLabels = new Map();
    var angle = (0, clampAngle_1.clampAngle)((_c = tickLabelStyle === null || tickLabelStyle === void 0 ? void 0 : tickLabelStyle.angle) !== null && _c !== void 0 ? _c : 0);
    var topBoundFactor = 1;
    var bottomBoundFactor = 1;
    if ((tickLabelStyle === null || tickLabelStyle === void 0 ? void 0 : tickLabelStyle.textAnchor) === 'start') {
        topBoundFactor = Infinity;
        bottomBoundFactor = 1;
    }
    else if ((tickLabelStyle === null || tickLabelStyle === void 0 ? void 0 : tickLabelStyle.textAnchor) === 'end') {
        topBoundFactor = 1;
        bottomBoundFactor = Infinity;
    }
    else {
        topBoundFactor = 2;
        bottomBoundFactor = 2;
    }
    if (angle > 180) {
        _a = [bottomBoundFactor, topBoundFactor], topBoundFactor = _a[0], bottomBoundFactor = _a[1];
    }
    if (isRtl) {
        _b = [bottomBoundFactor, topBoundFactor], topBoundFactor = _b[0], bottomBoundFactor = _b[1];
    }
    var _loop_1 = function (item) {
        if (item.formattedValue) {
            // That maximum height of the tick depends on its proximity to the axis bounds.
            var height_1 = Math.min((item.offset + item.labelOffset) * topBoundFactor, (drawingArea.top +
                drawingArea.height +
                drawingArea.bottom -
                item.offset -
                item.labelOffset) *
                bottomBoundFactor);
            var doesTextFit = function (text) {
                return (0, ellipsize_1.doesTextFitInRect)(text, {
                    width: maxWidth,
                    height: height_1,
                    angle: angle,
                    measureText: function (string) { return (0, domUtils_1.getStringSize)(string, tickLabelStyle); },
                });
            };
            shortenedLabels.set(item, (0, ellipsize_1.ellipsize)(item.formattedValue.toString(), doesTextFit));
        }
    };
    for (var _i = 0, visibleLabels_1 = visibleLabels; _i < visibleLabels_1.length; _i++) {
        var item = visibleLabels_1[_i];
        _loop_1(item);
    }
    return shortenedLabels;
}
