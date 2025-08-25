"use strict";
'use client';
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
exports.useTransformData = useTransformData;
var React = require("react");
var useItemHighlightedGetter_1 = require("../../hooks/useItemHighlightedGetter");
var angleConversion_1 = require("../../internals/angleConversion");
function useTransformData(series) {
    var seriesId = series.id, data = series.data, faded = series.faded, highlighted = series.highlighted, _a = series.paddingAngle, basePaddingAngle = _a === void 0 ? 0 : _a, _b = series.innerRadius, baseInnerRadius = _b === void 0 ? 0 : _b, baseArcLabelRadius = series.arcLabelRadius, baseOuterRadius = series.outerRadius, _c = series.cornerRadius, baseCornerRadius = _c === void 0 ? 0 : _c;
    var _d = (0, useItemHighlightedGetter_1.useItemHighlightedGetter)(), isItemFaded = _d.isFaded, isItemHighlighted = _d.isHighlighted;
    var dataWithHighlight = React.useMemo(function () {
        return data.map(function (item, itemIndex) {
            var _a, _b, _c, _d, _e, _f;
            var currentItem = {
                seriesId: seriesId,
                dataIndex: itemIndex,
            };
            var isHighlighted = isItemHighlighted(currentItem);
            var isFaded = !isHighlighted && isItemFaded(currentItem);
            var attributesOverride = __assign({ additionalRadius: 0 }, ((isFaded && faded) || (isHighlighted && highlighted) || {}));
            var paddingAngle = Math.max(0, (0, angleConversion_1.deg2rad)((_a = attributesOverride.paddingAngle) !== null && _a !== void 0 ? _a : basePaddingAngle));
            var innerRadius = Math.max(0, (_b = attributesOverride.innerRadius) !== null && _b !== void 0 ? _b : baseInnerRadius);
            var outerRadius = Math.max(0, (_c = attributesOverride.outerRadius) !== null && _c !== void 0 ? _c : baseOuterRadius + attributesOverride.additionalRadius);
            var cornerRadius = (_d = attributesOverride.cornerRadius) !== null && _d !== void 0 ? _d : baseCornerRadius;
            var arcLabelRadius = (_f = (_e = attributesOverride.arcLabelRadius) !== null && _e !== void 0 ? _e : baseArcLabelRadius) !== null && _f !== void 0 ? _f : (innerRadius + outerRadius) / 2;
            return __assign(__assign(__assign({}, item), attributesOverride), { dataIndex: itemIndex, isFaded: isFaded, isHighlighted: isHighlighted, paddingAngle: paddingAngle, innerRadius: innerRadius, outerRadius: outerRadius, cornerRadius: cornerRadius, arcLabelRadius: arcLabelRadius });
        });
    }, [
        baseCornerRadius,
        baseInnerRadius,
        baseOuterRadius,
        basePaddingAngle,
        baseArcLabelRadius,
        data,
        faded,
        highlighted,
        isItemFaded,
        isItemHighlighted,
        seriesId,
    ]);
    return dataWithHighlight;
}
