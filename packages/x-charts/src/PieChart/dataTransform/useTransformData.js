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
var useIsItemFocusedGetter_1 = require("../../hooks/useIsItemFocusedGetter");
var getModifiedArcProperties_1 = require("./getModifiedArcProperties");
function useTransformData(series) {
    var seriesId = series.id, data = series.data, faded = series.faded, highlighted = series.highlighted;
    var _a = (0, useItemHighlightedGetter_1.useItemHighlightedGetter)(), isItemFaded = _a.isFaded, isItemHighlighted = _a.isHighlighted;
    var isItemFocused = (0, useIsItemFocusedGetter_1.useIsItemFocusedGetter)();
    var dataWithHighlight = React.useMemo(function () {
        return data.map(function (item, itemIndex) {
            var _a, _b;
            var currentItem = {
                seriesId: seriesId,
                dataIndex: itemIndex,
            };
            var isHighlighted = isItemHighlighted(currentItem);
            var isFaded = !isHighlighted && isItemFaded(currentItem);
            var isFocused = isItemFocused({ type: 'pie', seriesId: seriesId, dataIndex: itemIndex });
            // TODO v9: Replace the second argument with the result of useSeriesLayout
            var arcSizes = (0, getModifiedArcProperties_1.getModifiedArcProperties)(series, {
                radius: {
                    inner: (_a = series.innerRadius) !== null && _a !== void 0 ? _a : 0,
                    outer: series.outerRadius,
                    label: (_b = series.arcLabelRadius) !== null && _b !== void 0 ? _b : 0,
                    available: 0,
                },
            }, isHighlighted, isFaded);
            var attributesOverride = __assign({ additionalRadius: 0 }, ((isFaded && faded) || (isHighlighted && highlighted) || {}));
            return __assign(__assign(__assign(__assign({}, item), attributesOverride), { dataIndex: itemIndex, isFaded: isFaded, isHighlighted: isHighlighted, isFocused: isFocused }), arcSizes);
        });
    }, [data, seriesId, isItemHighlighted, isItemFaded, isItemFocused, series, faded, highlighted]);
    return dataWithHighlight;
}
