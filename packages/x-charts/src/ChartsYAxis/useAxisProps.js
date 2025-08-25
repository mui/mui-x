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
exports.useAxisProps = void 0;
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var styles_1 = require("@mui/material/styles");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var ChartsText_1 = require("../ChartsText");
var useAxis_1 = require("../hooks/useAxis");
var defaultTextPlacement_1 = require("../ChartsText/defaultTextPlacement");
var invertTextAnchor_1 = require("../internals/invertTextAnchor");
var utilities_1 = require("./utilities");
var isBandScale_1 = require("../internals/isBandScale");
var isInfinity_1 = require("../internals/isInfinity");
var useAxisProps = function (inProps) {
    var _a, _b, _c, _d, _e, _f, _g;
    var _h = (0, useAxis_1.useYAxes)(), yAxis = _h.yAxis, yAxisIds = _h.yAxisIds;
    var _j = yAxis[(_a = inProps.axisId) !== null && _a !== void 0 ? _a : yAxisIds[0]], yScale = _j.scale, tickNumber = _j.tickNumber, reverse = _j.reverse, settings = __rest(_j, ["scale", "tickNumber", "reverse"]);
    // eslint-disable-next-line material-ui/mui-name-matches-component-name
    var themedProps = (0, styles_1.useThemeProps)({ props: __assign(__assign({}, settings), inProps), name: 'MuiChartsYAxis' });
    var defaultizedProps = __assign(__assign({}, utilities_1.defaultProps), themedProps);
    var position = defaultizedProps.position, tickLabelStyle = defaultizedProps.tickLabelStyle, labelStyle = defaultizedProps.labelStyle, slots = defaultizedProps.slots, slotProps = defaultizedProps.slotProps;
    var theme = (0, styles_1.useTheme)();
    var isRtl = (0, RtlProvider_1.useRtl)();
    var classes = (0, utilities_1.useUtilityClasses)(defaultizedProps);
    var positionSign = position === 'right' ? 1 : -1;
    var tickFontSize = typeof (tickLabelStyle === null || tickLabelStyle === void 0 ? void 0 : tickLabelStyle.fontSize) === 'number' ? tickLabelStyle.fontSize : 12;
    var Line = (_b = slots === null || slots === void 0 ? void 0 : slots.axisLine) !== null && _b !== void 0 ? _b : 'line';
    var Tick = (_c = slots === null || slots === void 0 ? void 0 : slots.axisTick) !== null && _c !== void 0 ? _c : 'line';
    var TickLabel = (_d = slots === null || slots === void 0 ? void 0 : slots.axisTickLabel) !== null && _d !== void 0 ? _d : ChartsText_1.ChartsText;
    var Label = (_e = slots === null || slots === void 0 ? void 0 : slots.axisLabel) !== null && _e !== void 0 ? _e : ChartsText_1.ChartsText;
    var defaultTextAnchor = (0, defaultTextPlacement_1.getDefaultTextAnchor)((position === 'right' ? -90 : 90) - ((_f = tickLabelStyle === null || tickLabelStyle === void 0 ? void 0 : tickLabelStyle.angle) !== null && _f !== void 0 ? _f : 0));
    var defaultDominantBaseline = (0, defaultTextPlacement_1.getDefaultBaseline)((position === 'right' ? -90 : 90) - ((_g = tickLabelStyle === null || tickLabelStyle === void 0 ? void 0 : tickLabelStyle.angle) !== null && _g !== void 0 ? _g : 0));
    var axisTickLabelProps = (0, useSlotProps_1.default)({
        elementType: TickLabel,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisTickLabel,
        additionalProps: {
            style: __assign(__assign(__assign({}, theme.typography.caption), { fontSize: tickFontSize, textAnchor: isRtl ? (0, invertTextAnchor_1.invertTextAnchor)(defaultTextAnchor) : defaultTextAnchor, dominantBaseline: defaultDominantBaseline }), tickLabelStyle),
        },
        className: classes.tickLabel,
        ownerState: {},
    });
    var axisLabelProps = (0, useSlotProps_1.default)({
        elementType: Label,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisLabel,
        additionalProps: {
            style: __assign(__assign(__assign({}, theme.typography.body1), { lineHeight: 1, fontSize: 14, angle: positionSign * 90, textAnchor: 'middle', dominantBaseline: 'text-before-edge' }), labelStyle),
        },
        ownerState: {},
    });
    var lineProps = (0, useSlotProps_1.default)({
        elementType: Line,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisLine,
        additionalProps: {
            strokeLinecap: 'square',
        },
        ownerState: {},
    });
    var domain = yScale.domain();
    var isScaleBand = (0, isBandScale_1.isBandScale)(yScale);
    var skipAxisRendering = (isScaleBand && domain.length === 0) ||
        (!isScaleBand && domain.some(isInfinity_1.isInfinity)) ||
        position === 'none';
    return {
        yScale: yScale,
        defaultizedProps: defaultizedProps,
        tickNumber: tickNumber,
        positionSign: positionSign,
        skipAxisRendering: skipAxisRendering,
        classes: classes,
        Line: Line,
        Tick: Tick,
        TickLabel: TickLabel,
        Label: Label,
        axisTickLabelProps: axisTickLabelProps,
        axisLabelProps: axisLabelProps,
        lineProps: lineProps,
        reverse: reverse,
        isRtl: isRtl,
    };
};
exports.useAxisProps = useAxisProps;
