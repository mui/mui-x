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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusedPieArc = FocusedPieArc;
var jsx_runtime_1 = require("react/jsx-runtime");
var styles_1 = require("@mui/material/styles");
var useFocusedItem_1 = require("../hooks/useFocusedItem");
var usePieSeries_1 = require("../hooks/usePieSeries");
var PieArc_1 = require("./PieArc");
var pieClasses_1 = require("./pieClasses");
var useItemHighlightState_1 = require("../hooks/useItemHighlightState");
var getModifiedArcProperties_1 = require("./dataTransform/getModifiedArcProperties");
function FocusedPieArc(props) {
    var _a;
    var theme = (0, styles_1.useTheme)();
    var focusedItem = (0, useFocusedItem_1.useFocusedItem)();
    var pieSeriesLayout = (0, usePieSeries_1.usePieSeriesLayout)();
    var highlightState = (0, useItemHighlightState_1.useItemHighlightState)(focusedItem);
    var isHighlighted = highlightState === 'highlighted';
    var isFaded = highlightState === 'faded';
    var pieSeries = (0, usePieSeries_1.usePieSeriesContext)();
    var classes = (0, pieClasses_1.useUtilityClasses)();
    if (focusedItem === null || focusedItem.type !== 'pie' || !pieSeries) {
        return null;
    }
    var series = pieSeries === null || pieSeries === void 0 ? void 0 : pieSeries.series[focusedItem.seriesId];
    var _b = pieSeriesLayout[focusedItem.seriesId], center = _b.center, radius = _b.radius;
    if (!series || !center || !radius) {
        return null;
    }
    var item = series.data[focusedItem.dataIndex];
    var _c = (0, getModifiedArcProperties_1.getModifiedArcProperties)(series, pieSeriesLayout[focusedItem.seriesId], isHighlighted, isFaded), arcLabelRadius = _c.arcLabelRadius, arcSizes = __rest(_c, ["arcLabelRadius"]);
    return ((0, jsx_runtime_1.jsx)(PieArc_1.PieArc, __assign({ transform: "translate(".concat(pieSeriesLayout[series.id].center.x, ", ").concat(pieSeriesLayout[series.id].center.y, ")"), startAngle: item.startAngle, endAngle: item.endAngle, color: "transparent", pointerEvents: "none", skipInteraction: true, skipAnimation: true, stroke: ((_a = theme.vars) !== null && _a !== void 0 ? _a : theme).palette.text.primary, seriesId: series.id, className: classes.focusIndicator, dataIndex: focusedItem.dataIndex, isFaded: false, isHighlighted: false, isFocused: false, strokeWidth: 3 }, arcSizes, props)));
}
