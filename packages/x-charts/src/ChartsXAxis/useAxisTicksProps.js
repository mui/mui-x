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
exports.useAxisTicksProps = useAxisTicksProps;
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var styles_1 = require("@mui/material/styles");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var ChartsText_1 = require("../ChartsText");
var useAxis_1 = require("../hooks/useAxis");
var defaultTextPlacement_1 = require("../ChartsText/defaultTextPlacement");
var invertTextAnchor_1 = require("../internals/invertTextAnchor");
var utilities_1 = require("./utilities");
function useAxisTicksProps(inProps) {
    var _a, _b, _c, _d, _e;
    var _f = (0, useAxis_1.useXAxes)(), xAxis = _f.xAxis, xAxisIds = _f.xAxisIds;
    var _g = xAxis[(_a = inProps.axisId) !== null && _a !== void 0 ? _a : xAxisIds[0]], xScale = _g.scale, tickNumber = _g.tickNumber, reverse = _g.reverse, settings = __rest(_g, ["scale", "tickNumber", "reverse"]);
    // eslint-disable-next-line material-ui/mui-name-matches-component-name
    var themedProps = (0, styles_1.useThemeProps)({ props: __assign(__assign({}, settings), inProps), name: 'MuiChartsXAxis' });
    var defaultizedProps = __assign(__assign({}, utilities_1.defaultProps), themedProps);
    var position = defaultizedProps.position, tickLabelStyle = defaultizedProps.tickLabelStyle, slots = defaultizedProps.slots, slotProps = defaultizedProps.slotProps;
    var theme = (0, styles_1.useTheme)();
    var isRtl = (0, RtlProvider_1.useRtl)();
    var classes = (0, utilities_1.useUtilityClasses)(defaultizedProps);
    var positionSign = position === 'bottom' ? 1 : -1;
    var Tick = (_b = slots === null || slots === void 0 ? void 0 : slots.axisTick) !== null && _b !== void 0 ? _b : 'line';
    var TickLabel = (_c = slots === null || slots === void 0 ? void 0 : slots.axisTickLabel) !== null && _c !== void 0 ? _c : ChartsText_1.ChartsText;
    var defaultTextAnchor = (0, defaultTextPlacement_1.getDefaultTextAnchor)((position === 'bottom' ? 0 : 180) - ((_d = tickLabelStyle === null || tickLabelStyle === void 0 ? void 0 : tickLabelStyle.angle) !== null && _d !== void 0 ? _d : 0));
    var defaultDominantBaseline = (0, defaultTextPlacement_1.getDefaultBaseline)((position === 'bottom' ? 0 : 180) - ((_e = tickLabelStyle === null || tickLabelStyle === void 0 ? void 0 : tickLabelStyle.angle) !== null && _e !== void 0 ? _e : 0));
    var axisTickLabelProps = (0, useSlotProps_1.default)({
        elementType: TickLabel,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisTickLabel,
        additionalProps: {
            style: __assign(__assign(__assign({}, theme.typography.caption), { fontSize: 12, lineHeight: 1.25, textAnchor: isRtl ? (0, invertTextAnchor_1.invertTextAnchor)(defaultTextAnchor) : defaultTextAnchor, dominantBaseline: defaultDominantBaseline }), tickLabelStyle),
        },
        className: classes.tickLabel,
        ownerState: {},
    });
    return {
        xScale: xScale,
        defaultizedProps: defaultizedProps,
        tickNumber: tickNumber,
        positionSign: positionSign,
        classes: classes,
        Tick: Tick,
        TickLabel: TickLabel,
        axisTickLabelProps: axisTickLabelProps,
        reverse: reverse,
    };
}
