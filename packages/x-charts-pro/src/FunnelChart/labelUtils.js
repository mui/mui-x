"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionLabel = exports.alignLabel = void 0;
/**
 * It tries to keep the label inside the bounds of the section based on the position.
 *
 * @returns The text anchor and dominant baseline of the label.
 */
var alignLabel = function (_a) {
    var _b, _c;
    var position = _a.position, textAnchor = _a.textAnchor, dominantBaseline = _a.dominantBaseline;
    var vertical = (_b = position === null || position === void 0 ? void 0 : position.vertical) !== null && _b !== void 0 ? _b : 'middle';
    var horizontal = (_c = position === null || position === void 0 ? void 0 : position.horizontal) !== null && _c !== void 0 ? _c : 'center';
    var anchor = 'middle';
    var baseline = 'central';
    if (vertical === 'top') {
        baseline = 'hanging';
    }
    else if (vertical === 'bottom') {
        baseline = 'baseline';
    }
    if (horizontal === 'start') {
        anchor = 'start';
    }
    else if (horizontal === 'end') {
        anchor = 'end';
    }
    return {
        textAnchor: textAnchor !== null && textAnchor !== void 0 ? textAnchor : anchor,
        dominantBaseline: dominantBaseline !== null && dominantBaseline !== void 0 ? dominantBaseline : baseline,
    };
};
exports.alignLabel = alignLabel;
/**
 * This function calculates the position of the label based on the position and margin.
 *
 * It is quite complex, because it needs to calculate the position based on the position of the points of a rectangle.
 * And we are manually calculating each possible position of the label.
 *
 * @returns The x and y position of the label.
 */
var positionLabel = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var position = _a.position, offset = _a.offset, isHorizontal = _a.isHorizontal, values = _a.values;
    var vertical = (_b = position === null || position === void 0 ? void 0 : position.vertical) !== null && _b !== void 0 ? _b : 'middle';
    var horizontal = (_c = position === null || position === void 0 ? void 0 : position.horizontal) !== null && _c !== void 0 ? _c : 'center';
    var x = 0;
    var y = 0;
    // The min/max values are due to the sections possibly being sloped.
    // Importance of values differs from the horizontal and vertical sections.
    // Example (vertical):
    // MaxL         MaxT         MaxR
    //  \                          /
    //   \                        /
    //    MinL      MaxB      MinR
    var minTop = 0;
    var maxTop = 0;
    var minBottom = 0;
    var maxBottom = 0;
    var minLeft = 0;
    var maxLeft = 0;
    var minRight = 0;
    var maxRight = 0;
    var middle = 0;
    var center = 0;
    var mv = typeof offset === 'number' ? offset : ((_d = offset === null || offset === void 0 ? void 0 : offset.y) !== null && _d !== void 0 ? _d : 0);
    var mh = typeof offset === 'number' ? offset : ((_e = offset === null || offset === void 0 ? void 0 : offset.x) !== null && _e !== void 0 ? _e : 0);
    // Min ... Max
    var Ys = values.map(function (v) { return v.y; }).toSorted(function (a, b) { return a - b; });
    var Xs = values.map(function (v) { return v.x; }).toSorted(function (a, b) { return a - b; });
    // Visualization of the points in a hierarchical order:
    //              MaxT
    //              MinT
    // MaxL MinL  Cent/Mid  MinR MaxR
    //              MinB
    //              MaxB
    if (isHorizontal) {
        maxTop = Ys.at(0) - mv;
        minTop = Ys.at(1) - mv;
        minBottom = Ys.at(2) + mv;
        maxBottom = ((_f = Ys.at(3)) !== null && _f !== void 0 ? _f : Ys.at(2)) + mv;
        maxRight = ((_g = Xs.at(3)) !== null && _g !== void 0 ? _g : Xs.at(2)) + mh;
        // We don't need (minRight/minLeft) for horizontal
        maxLeft = Xs.at(0) + mh;
        center = (maxRight + maxLeft) / 2;
        middle = (maxBottom + maxTop) / 2;
    }
    else {
        maxTop = Ys.at(0) - mv;
        // We don't need (minTop/minBottom) for vertical
        maxBottom = ((_h = Ys.at(3)) !== null && _h !== void 0 ? _h : Ys.at(2)) - mv;
        maxRight = ((_j = Xs.at(3)) !== null && _j !== void 0 ? _j : Xs.at(2)) + mh;
        minRight = Xs.at(2) + mh;
        minLeft = Xs.at(1) - mh;
        maxLeft = Xs.at(0) - mh;
        center = (maxRight + maxLeft) / 2;
        middle = (maxBottom + maxTop) / 2;
    }
    if (isHorizontal) {
        if (horizontal === 'center') {
            x = center;
            if (vertical === 'top') {
                y = (maxTop + minTop) / 2;
            }
            else if (vertical === 'middle') {
                y = middle;
            }
            else if (vertical === 'bottom') {
                y = (maxBottom + minBottom) / 2;
            }
        }
        else if (horizontal === 'start') {
            x = maxLeft;
            if (vertical === 'top') {
                y = maxTop;
            }
            else if (vertical === 'middle') {
                y = middle;
            }
            else if (vertical === 'bottom') {
                y = maxBottom;
            }
        }
        else if (horizontal === 'end') {
            x = maxRight;
            if (vertical === 'top') {
                y = minTop;
            }
            else if (vertical === 'middle') {
                y = middle;
            }
            else if (vertical === 'bottom') {
                y = minBottom;
            }
        }
    }
    if (!isHorizontal) {
        if (vertical === 'middle') {
            y = middle;
            if (horizontal === 'start') {
                x = (maxLeft + minLeft) / 2;
            }
            else if (horizontal === 'center') {
                x = center;
            }
            else if (horizontal === 'end') {
                x = (maxRight + minRight) / 2;
            }
        }
        else if (vertical === 'top') {
            y = maxTop;
            if (horizontal === 'start') {
                x = maxLeft;
            }
            else if (horizontal === 'center') {
                x = center;
            }
            else if (horizontal === 'end') {
                x = maxRight;
            }
        }
        else if (vertical === 'bottom') {
            y = maxBottom;
            if (horizontal === 'start') {
                x = minLeft;
            }
            else if (horizontal === 'center') {
                x = center;
            }
            else if (horizontal === 'end') {
                x = minRight;
            }
        }
    }
    return {
        x: x,
        y: y,
    };
};
exports.positionLabel = positionLabel;
