"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenLabels = shortenLabels;
var clampAngle_1 = require("../internals/clampAngle");
var ellipsize_1 = require("../internals/ellipsize");
var domUtils_1 = require("../internals/domUtils");
function shortenLabels(visibleLabels, drawingArea, maxHeight, isRtl, tickLabelStyle) {
    var _a, _b;
    var _c;
    var shortenedLabels = new Map();
    var angle = (0, clampAngle_1.clampAngle)((_c = tickLabelStyle === null || tickLabelStyle === void 0 ? void 0 : tickLabelStyle.angle) !== null && _c !== void 0 ? _c : 0);
    // Multiplying the space available to the left of the text position by leftBoundFactor returns the max width of the text.
    // Same for rightBoundFactor
    var leftBoundFactor = 1;
    var rightBoundFactor = 1;
    if ((tickLabelStyle === null || tickLabelStyle === void 0 ? void 0 : tickLabelStyle.textAnchor) === 'start') {
        leftBoundFactor = Infinity;
        rightBoundFactor = 1;
    }
    else if ((tickLabelStyle === null || tickLabelStyle === void 0 ? void 0 : tickLabelStyle.textAnchor) === 'end') {
        leftBoundFactor = 1;
        rightBoundFactor = Infinity;
    }
    else {
        leftBoundFactor = 2;
        rightBoundFactor = 2;
    }
    if (angle > 90 && angle < 270) {
        _a = [rightBoundFactor, leftBoundFactor], leftBoundFactor = _a[0], rightBoundFactor = _a[1];
    }
    if (isRtl) {
        _b = [rightBoundFactor, leftBoundFactor], leftBoundFactor = _b[0], rightBoundFactor = _b[1];
    }
    var _loop_1 = function (item) {
        if (item.formattedValue) {
            // That maximum width of the tick depends on its proximity to the axis bounds.
            var width_1 = Math.min((item.offset + item.labelOffset) * leftBoundFactor, (drawingArea.left +
                drawingArea.width +
                drawingArea.right -
                item.offset -
                item.labelOffset) *
                rightBoundFactor);
            var doesTextFit = function (text) {
                return (0, ellipsize_1.doesTextFitInRect)(text, {
                    width: width_1,
                    height: maxHeight,
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
