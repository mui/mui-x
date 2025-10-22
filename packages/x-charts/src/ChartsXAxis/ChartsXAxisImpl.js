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
exports.ChartsXAxisImpl = ChartsXAxisImpl;
var React = require("react");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var styles_1 = require("@mui/material/styles");
var ChartsSingleXAxisTicks_1 = require("./ChartsSingleXAxisTicks");
var ChartsGroupedXAxisTicks_1 = require("./ChartsGroupedXAxisTicks");
var ChartsText_1 = require("../ChartsText");
var scaleGuards_1 = require("../internals/scaleGuards");
var isInfinity_1 = require("../internals/isInfinity");
var utilities_1 = require("./utilities");
var hooks_1 = require("../hooks");
var domUtils_1 = require("../internals/domUtils");
var AxisSharedComponents_1 = require("../internals/components/AxisSharedComponents");
var XAxisRoot = (0, styles_1.styled)(AxisSharedComponents_1.AxisRoot, {
    name: 'MuiChartsXAxis',
    slot: 'Root',
})({});
/**
 * @ignore - internal component. Use `ChartsXAxis` instead.
 */
function ChartsXAxisImpl(_a) {
    var _b, _c;
    var axis = _a.axis, inProps = __rest(_a, ["axis"]);
    var xScale = axis.scale, tickNumber = axis.tickNumber, reverse = axis.reverse, settings = __rest(axis, ["scale", "tickNumber", "reverse"]);
    // eslint-disable-next-line material-ui/mui-name-matches-component-name
    var themedProps = (0, styles_1.useThemeProps)({ props: __assign(__assign({}, settings), inProps), name: 'MuiChartsXAxis' });
    var defaultizedProps = __assign(__assign({}, utilities_1.defaultProps), themedProps);
    var position = defaultizedProps.position, labelStyle = defaultizedProps.labelStyle, offset = defaultizedProps.offset, slots = defaultizedProps.slots, slotProps = defaultizedProps.slotProps, sx = defaultizedProps.sx, disableLine = defaultizedProps.disableLine, label = defaultizedProps.label, axisHeight = defaultizedProps.height;
    var theme = (0, styles_1.useTheme)();
    var classes = (0, utilities_1.useUtilityClasses)(defaultizedProps);
    var _d = (0, hooks_1.useDrawingArea)(), left = _d.left, top = _d.top, width = _d.width, height = _d.height;
    var positionSign = position === 'bottom' ? 1 : -1;
    var Line = (_b = slots === null || slots === void 0 ? void 0 : slots.axisLine) !== null && _b !== void 0 ? _b : 'line';
    var Label = (_c = slots === null || slots === void 0 ? void 0 : slots.axisLabel) !== null && _c !== void 0 ? _c : ChartsText_1.ChartsText;
    var axisLabelProps = (0, useSlotProps_1.default)({
        elementType: Label,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisLabel,
        additionalProps: {
            style: __assign(__assign(__assign({}, theme.typography.body1), { lineHeight: 1, fontSize: 14, textAnchor: 'middle', dominantBaseline: position === 'bottom' ? 'text-after-edge' : 'text-before-edge' }), labelStyle),
        },
        ownerState: {},
    });
    if (position === 'none') {
        return null;
    }
    var labelHeight = label ? (0, domUtils_1.measureText)(label, axisLabelProps.style).height : 0;
    var domain = xScale.domain();
    var isScaleOrdinal = (0, scaleGuards_1.isOrdinalScale)(xScale);
    var skipTickRendering = isScaleOrdinal ? domain.length === 0 : domain.some(isInfinity_1.isInfinity);
    var children = null;
    if (!skipTickRendering) {
        children =
            'groups' in axis && Array.isArray(axis.groups) ? (<ChartsGroupedXAxisTicks_1.ChartsGroupedXAxisTicks {...inProps}/>) : (<ChartsSingleXAxisTicks_1.ChartsSingleXAxisTicks {...inProps} axisLabelHeight={labelHeight}/>);
    }
    var labelRefPoint = {
        x: left + width / 2,
        y: positionSign * axisHeight,
    };
    return (<XAxisRoot transform={"translate(0, ".concat(position === 'bottom' ? top + height + offset : top - offset, ")")} className={classes.root} sx={sx}>
      {!disableLine && (<Line x1={left} x2={left + width} className={classes.line} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisLine}/>)}
      {children}
      {label && (<g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label}/>
        </g>)}
    </XAxisRoot>);
}
