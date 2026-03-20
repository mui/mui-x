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
exports.FunnelSectionLabel = exports.FunnelSectionLabelText = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-charts/internals");
var clsx_1 = require("clsx");
var funnelClasses_1 = require("./funnelClasses");
exports.FunnelSectionLabelText = (0, styles_1.styled)('text', {
    name: 'MuiFunnelChart',
    slot: 'SectionLabel',
})(function () { return ({
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in, fill-opacity 0.2s ease-in, filter 0.2s ease-in',
}); });
/**
 * @ignore - internal component.
 */
var FunnelSectionLabel = (0, internals_1.consumeSlots)('MuiFunnelSectionLabel', 'funnelSectionLabel', {
    classesResolver: funnelClasses_1.useUtilityClasses,
}, React.forwardRef(function FunnelSectionLabel(props, ref) {
    var _a, _b, _c, _d, _e;
    var classes = props.classes, color = props.color, onClick = props.onClick, className = props.className, label = props.label, variant = props.variant, seriesId = props.seriesId, dataIndex = props.dataIndex, other = __rest(props, ["classes", "color", "onClick", "className", "label", "variant", "seriesId", "dataIndex"]);
    var theme = (0, styles_1.useTheme)();
    return ((0, jsx_runtime_1.jsx)(exports.FunnelSectionLabelText, __assign({ stroke: "none", pointerEvents: "none", fontFamily: theme.typography.body2.fontFamily, fontSize: theme.typography.body2.fontSize, fontSizeAdjust: theme.typography.body2.fontSizeAdjust, fontWeight: theme.typography.body2.fontWeight, letterSpacing: theme.typography.body2.letterSpacing, fontStretch: theme.typography.body2.fontStretch, fontStyle: theme.typography.body2.fontStyle, fontVariant: theme.typography.body2.fontVariant, fill: (_c = (_b = (_a = (theme.vars || theme)) === null || _a === void 0 ? void 0 : _a.palette) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.primary, className: (0, clsx_1.default)(classes === null || classes === void 0 ? void 0 : classes.sectionLabel, className), x: label.x, y: label.y, textAnchor: (_d = label.textAnchor) !== null && _d !== void 0 ? _d : 'middle', dominantBaseline: (_e = label.dominantBaseline) !== null && _e !== void 0 ? _e : 'central' }, other, { ref: ref, children: label.value })));
}));
exports.FunnelSectionLabel = FunnelSectionLabel;
