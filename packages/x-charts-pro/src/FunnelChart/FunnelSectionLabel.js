"use strict";
'use client';
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
exports.FunnelSectionLabel = void 0;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-charts/internals");
var funnelSectionClasses_1 = require("./funnelSectionClasses");
/**
 * @ignore - internal component.
 */
var FunnelSectionLabel = (0, internals_1.consumeSlots)('MuiFunnelSectionLabel', 'funnelSectionLabel', {
    classesResolver: funnelSectionClasses_1.useLabelUtilityClasses,
}, React.forwardRef(function FunnelSectionLabel(props, ref) {
    var _a, _b, _c, _d, _e;
    var classes = props.classes, color = props.color, onClick = props.onClick, className = props.className, label = props.label, seriesId = props.seriesId, dataIndex = props.dataIndex, other = __rest(props, ["classes", "color", "onClick", "className", "label", "seriesId", "dataIndex"]);
    var theme = (0, styles_1.useTheme)();
    return (<text stroke="none" pointerEvents="none" fontFamily={theme.typography.body2.fontFamily} fontSize={theme.typography.body2.fontSize} fontSizeAdjust={theme.typography.body2.fontSizeAdjust} fontWeight={theme.typography.body2.fontWeight} letterSpacing={theme.typography.body2.letterSpacing} fontStretch={theme.typography.body2.fontStretch} fontStyle={theme.typography.body2.fontStyle} fontVariant={theme.typography.body2.fontVariant} fill={(_c = (_b = (_a = (theme.vars || theme)) === null || _a === void 0 ? void 0 : _a.palette) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.primary} className={classes === null || classes === void 0 ? void 0 : classes.label} x={label.x} y={label.y} textAnchor={(_d = label.textAnchor) !== null && _d !== void 0 ? _d : 'middle'} dominantBaseline={(_e = label.dominantBaseline) !== null && _e !== void 0 ? _e : 'central'} {...other} ref={ref}>
        {label.value}
      </text>);
}));
exports.FunnelSectionLabel = FunnelSectionLabel;
