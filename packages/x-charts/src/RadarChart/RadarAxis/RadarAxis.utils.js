"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelAttributes = getLabelAttributes;
/**
 * Return text anchor of labels.
 * @param angle The axis angle (in rad) with clock direction and 0 at the top
 */
function getTextAnchor(angle) {
    if (angle < 20) {
        return 'start';
    }
    if (angle < 90 - 10) {
        return 'end';
    }
    if (angle < 270 - 10) {
        return 'start';
    }
    if (angle < 360 - 20) {
        return 'end';
    }
    return 'start';
}
function getDominantBaseline(angle) {
    if (angle < 160) {
        return 'auto';
    }
    if (angle < 360 - 20) {
        return 'hanging';
    }
    return 'auto';
}
var LABEL_MARGIN = 2;
function getLabelAttributes(params) {
    var _a, _b, _c, _d;
    var x = params.x, y = params.y, angle = params.angle;
    if (params.labelOrientation === 'horizontal') {
        var textAnchor_1 = typeof params.textAnchor === 'function'
            ? params.textAnchor(angle)
            : ((_a = params.textAnchor) !== null && _a !== void 0 ? _a : getTextAnchor(angle));
        var dominantBaseline_1 = typeof params.dominantBaseline === 'function'
            ? params.dominantBaseline(angle)
            : ((_b = params.dominantBaseline) !== null && _b !== void 0 ? _b : getDominantBaseline(angle));
        var marginX = textAnchor_1 === 'start' ? LABEL_MARGIN : -LABEL_MARGIN;
        var marginY = dominantBaseline_1 === 'auto' ? -LABEL_MARGIN : LABEL_MARGIN;
        return {
            x: x + marginX,
            y: y + marginY,
            textAnchor: textAnchor_1,
            dominantBaseline: dominantBaseline_1,
        };
    }
    // orientation='rotated'
    var textAnchor = typeof params.textAnchor === 'function'
        ? params.textAnchor(angle)
        : ((_c = params.textAnchor) !== null && _c !== void 0 ? _c : 'start');
    var dominantBaseline = typeof params.dominantBaseline === 'function'
        ? params.dominantBaseline(angle)
        : ((_d = params.dominantBaseline) !== null && _d !== void 0 ? _d : 'auto');
    return {
        x: x,
        y: y,
        textAnchor: textAnchor,
        dominantBaseline: dominantBaseline,
        transform: "rotate(".concat(angle, ", ").concat(x, ", ").concat(y, ")"),
    };
}
