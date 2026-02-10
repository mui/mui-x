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
exports.getModifiedArcProperties = getModifiedArcProperties;
var angleConversion_1 = require("../../internals/angleConversion");
/**
 * Function that returns arc properties after applying transformation from highlight/fade states.
 */
function getModifiedArcProperties(seriesDef, seriesLayout, isHighlighted, isFaded) {
    var _a, _b, _c, _d, _e, _f;
    var faded = seriesDef.faded, highlighted = seriesDef.highlighted, _g = seriesDef.paddingAngle, basePaddingAngle = _g === void 0 ? 0 : _g, _h = seriesDef.cornerRadius, baseCornerRadius = _h === void 0 ? 0 : _h;
    var _j = seriesLayout.radius, _k = _j.inner, baseInnerRadius = _k === void 0 ? 0 : _k, baseArcLabelRadius = _j.label, baseOuterRadius = _j.outer;
    var attributesOverride = __assign({ additionalRadius: 0 }, ((isFaded && faded) || (isHighlighted && highlighted) || {}));
    var paddingAngle = Math.max(0, (0, angleConversion_1.deg2rad)((_a = attributesOverride.paddingAngle) !== null && _a !== void 0 ? _a : basePaddingAngle));
    var innerRadius = Math.max(0, (_b = attributesOverride.innerRadius) !== null && _b !== void 0 ? _b : baseInnerRadius);
    var outerRadius = Math.max(0, (_c = attributesOverride.outerRadius) !== null && _c !== void 0 ? _c : baseOuterRadius + attributesOverride.additionalRadius);
    var cornerRadius = (_d = attributesOverride.cornerRadius) !== null && _d !== void 0 ? _d : baseCornerRadius;
    var arcLabelRadius = (_f = (_e = attributesOverride.arcLabelRadius) !== null && _e !== void 0 ? _e : baseArcLabelRadius) !== null && _f !== void 0 ? _f : (innerRadius + outerRadius) / 2;
    return {
        paddingAngle: paddingAngle,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        cornerRadius: cornerRadius,
        arcLabelRadius: arcLabelRadius,
    };
}
