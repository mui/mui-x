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
exports.FunnelSection = exports.FunnelSectionPath = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-charts/internals");
var hooks_1 = require("@mui/x-charts/hooks");
var clsx_1 = require("clsx");
var funnelClasses_1 = require("./funnelClasses");
exports.FunnelSectionPath = (0, styles_1.styled)('path', {
    name: 'MuiFunnelChart',
    slot: 'Section',
})(function () { return ({
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in, fill-opacity 0.2s ease-in, filter 0.2s ease-in',
}); });
/**
 * @ignore - internal component.
 */
var FunnelSection = (0, internals_1.consumeSlots)('MuiFunnelSection', 'funnelSection', {
    classesResolver: funnelClasses_1.useUtilityClasses,
}, React.forwardRef(function FunnelSection(props, ref) {
    var seriesId = props.seriesId, dataIndex = props.dataIndex, classes = props.classes, color = props.color, onClick = props.onClick, className = props.className, _a = props.variant, variant = _a === void 0 ? 'filled' : _a, other = __rest(props, ["seriesId", "dataIndex", "classes", "color", "onClick", "className", "variant"]);
    var identifier = React.useMemo(function () { return ({ type: 'funnel', seriesId: seriesId, dataIndex: dataIndex }); }, [seriesId, dataIndex]);
    var interactionProps = (0, internals_1.useInteractionItemProps)(identifier);
    var highlightState = (0, hooks_1.useItemHighlightState)(identifier);
    var isHighlighted = highlightState === 'highlighted';
    var isFaded = highlightState === 'faded';
    var isOutlined = variant === 'outlined';
    return ((0, jsx_runtime_1.jsx)(exports.FunnelSectionPath, __assign({}, interactionProps, { filter: isHighlighted && !isOutlined ? 'brightness(120%)' : undefined, opacity: isFaded && !isOutlined ? 0.3 : 1, fill: color, stroke: isOutlined ? color : 'none', fillOpacity: isOutlined && !isHighlighted ? 0.4 : 1, strokeOpacity: 1, strokeWidth: isOutlined ? 1.5 : 0, cursor: onClick ? 'pointer' : 'unset', onClick: onClick, "data-highlighted": isHighlighted || undefined, "data-faded": isFaded || undefined, className: (0, clsx_1.default)(classes === null || classes === void 0 ? void 0 : classes.section, className) }, other, { ref: ref })));
}));
exports.FunnelSection = FunnelSection;
