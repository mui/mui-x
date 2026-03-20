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
exports.ChartsYAxisImpl = ChartsYAxisImpl;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var styles_1 = require("@mui/material/styles");
var ChartsSingleYAxisTicks_1 = require("./ChartsSingleYAxisTicks");
var ChartsGroupedYAxisTicks_1 = require("./ChartsGroupedYAxisTicks");
var ChartsText_1 = require("../ChartsText");
var utilities_1 = require("./utilities");
var isInfinity_1 = require("../internals/isInfinity");
var useDrawingArea_1 = require("../hooks/useDrawingArea");
var useIsHydrated_1 = require("../hooks/useIsHydrated");
var scaleGuards_1 = require("../internals/scaleGuards");
var domUtils_1 = require("../internals/domUtils");
var AxisSharedComponents_1 = require("../internals/components/AxisSharedComponents");
var YAxisRoot = (0, styles_1.styled)(AxisSharedComponents_1.AxisRoot, {
    name: 'MuiChartsYAxis',
    slot: 'Root',
})({});
/**
 * @ignore - internal component. Use `ChartsYAxis` instead.
 */
function ChartsYAxisImpl(_a) {
    var _b, _c;
    var axis = _a.axis, inProps = __rest(_a, ["axis"]);
    // @ts-expect-error ordinalTimeTicks may not be present on all axis types
    // Should be set to never, but this causes other issues with proptypes generator.
    var yScale = axis.scale, tickNumber = axis.tickNumber, reverse = axis.reverse, ordinalTimeTicks = axis.ordinalTimeTicks, settings = __rest(axis, ["scale", "tickNumber", "reverse", "ordinalTimeTicks"]);
    var isHydrated = (0, useIsHydrated_1.useIsHydrated)();
    // eslint-disable-next-line mui/material-ui-name-matches-component-name
    var themedProps = (0, styles_1.useThemeProps)({ props: __assign(__assign({}, settings), inProps), name: 'MuiChartsYAxis' });
    var defaultizedProps = __assign(__assign({}, utilities_1.defaultProps), themedProps);
    var position = defaultizedProps.position, disableLine = defaultizedProps.disableLine, label = defaultizedProps.label, labelStyle = defaultizedProps.labelStyle, offset = defaultizedProps.offset, axisWidth = defaultizedProps.width, sx = defaultizedProps.sx, slots = defaultizedProps.slots, slotProps = defaultizedProps.slotProps;
    var theme = (0, styles_1.useTheme)();
    var classes = (0, utilities_1.useUtilityClasses)(defaultizedProps);
    var _d = (0, useDrawingArea_1.useDrawingArea)(), left = _d.left, top = _d.top, width = _d.width, height = _d.height;
    var positionSign = position === 'right' ? 1 : -1;
    var Line = (_b = slots === null || slots === void 0 ? void 0 : slots.axisLine) !== null && _b !== void 0 ? _b : 'line';
    var Label = (_c = slots === null || slots === void 0 ? void 0 : slots.axisLabel) !== null && _c !== void 0 ? _c : ChartsText_1.ChartsText;
    var lineProps = (0, useSlotProps_1.default)({
        elementType: Line,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisLine,
        additionalProps: {
            strokeLinecap: 'square',
        },
        ownerState: {},
    });
    var axisLabelProps = (0, useSlotProps_1.default)({
        elementType: Label,
        // @ts-expect-error `useSlotProps` applies `WithCommonProps` with adds a `style: React.CSSProperties` prop automatically.
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisLabel,
        // @ts-expect-error `useSlotProps` applies `WithCommonProps` with adds a `style: React.CSSProperties` prop automatically.
        additionalProps: {
            style: __assign(__assign(__assign({}, theme.typography.body1), { lineHeight: 1, fontSize: 14, angle: positionSign * 90, textAnchor: 'middle', dominantBaseline: 'text-before-edge' }), labelStyle),
        },
        ownerState: {},
    });
    // Skip axis rendering if no data is available
    // - The domain is an empty array for band/point scales.
    // - The domains contains Infinity for continuous scales.
    // - The position is set to 'none'.
    if (position === 'none') {
        return null;
    }
    var labelRefPoint = {
        x: positionSign * axisWidth,
        y: top + height / 2,
    };
    var axisLabelHeight = label == null ? 0 : (0, domUtils_1.getStringSize)(label, axisLabelProps.style).height;
    var domain = yScale.domain();
    var isScaleOrdinal = (0, scaleGuards_1.isOrdinalScale)(yScale);
    var skipTickRendering = isScaleOrdinal ? domain.length === 0 : domain.some(isInfinity_1.isInfinity);
    var children = null;
    if (!skipTickRendering) {
        children =
            'groups' in axis && Array.isArray(axis.groups) ? ((0, jsx_runtime_1.jsx)(ChartsGroupedYAxisTicks_1.ChartsGroupedYAxisTicks, __assign({}, inProps))) : ((0, jsx_runtime_1.jsx)(ChartsSingleYAxisTicks_1.ChartsSingleYAxisTicks, __assign({}, inProps, { axisLabelHeight: axisLabelHeight, ordinalTimeTicks: ordinalTimeTicks })));
    }
    return ((0, jsx_runtime_1.jsxs)(YAxisRoot, { transform: "translate(".concat(position === 'right' ? left + width + offset : left - offset, ", 0)"), className: classes.root, "data-axis-id": defaultizedProps.id, sx: sx, children: [!disableLine && (0, jsx_runtime_1.jsx)(Line, __assign({ y1: top, y2: top + height, className: classes.line }, lineProps)), children, label && isHydrated && ((0, jsx_runtime_1.jsx)("g", { className: classes.label, children: (0, jsx_runtime_1.jsx)(Label, __assign({}, labelRefPoint, axisLabelProps, { text: label })) }))] }));
}
