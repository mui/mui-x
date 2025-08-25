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
exports.ChartsLegend = void 0;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var useLegend_1 = require("../hooks/useLegend");
var ChartsLabelMark_1 = require("../ChartsLabel/ChartsLabelMark");
var onClickContextBuilder_1 = require("./onClickContextBuilder");
var chartsLegendClasses_1 = require("./chartsLegendClasses");
var consumeSlots_1 = require("../internals/consumeSlots");
var ChartsLabel_1 = require("../ChartsLabel/ChartsLabel");
var RootElement = (0, styles_1.styled)('ul', {
    name: 'MuiChartsLegend',
    slot: 'Root',
})(function (_a) {
    var _b;
    var ownerState = _a.ownerState, theme = _a.theme;
    return (__assign(__assign({}, theme.typography.caption), (_b = { color: (theme.vars || theme).palette.text.primary, lineHeight: '100%', display: 'flex', flexDirection: ownerState.direction === 'vertical' ? 'column' : 'row', alignItems: ownerState.direction === 'vertical' ? undefined : 'center', flexShrink: 0, gap: theme.spacing(2), listStyleType: 'none', paddingInlineStart: 0, marginBlock: theme.spacing(1), marginInline: theme.spacing(1), flexWrap: 'wrap', li: {
                display: ownerState.direction === 'horizontal' ? 'inline-flex' : undefined,
            } }, _b["button.".concat(chartsLegendClasses_1.legendClasses.series)] = {
        // Reset button styles
        background: 'none',
        border: 'none',
        padding: 0,
        fontFamily: 'inherit',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        letterSpacing: 'inherit',
        color: 'inherit',
    }, _b["& .".concat(chartsLegendClasses_1.legendClasses.series)] = {
        display: ownerState.direction === 'vertical' ? 'flex' : 'inline-flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    }, _b)));
});
var ChartsLegend = (0, consumeSlots_1.consumeSlots)('MuiChartsLegend', 'legend', {
    defaultProps: { direction: 'horizontal' },
    // @ts-expect-error position is used only in the slots, but it is passed to the SVG wrapper.
    // We omit it here to avoid passing to slots.
    omitProps: ['position'],
    classesResolver: chartsLegendClasses_1.useUtilityClasses,
}, React.forwardRef(function ChartsLegend(props, ref) {
    var data = (0, useLegend_1.useLegend)();
    var direction = props.direction, onItemClick = props.onItemClick, className = props.className, classes = props.classes, other = __rest(props, ["direction", "onItemClick", "className", "classes"]);
    if (data.items.length === 0) {
        return null;
    }
    var Element = onItemClick ? 'button' : 'div';
    return (<RootElement className={(0, clsx_1.default)(classes === null || classes === void 0 ? void 0 : classes.root, className)} ref={ref} {...other} ownerState={props}>
        {data.items.map(function (item, i) {
            return (<li key={item.id} className={classes === null || classes === void 0 ? void 0 : classes.item} data-series={item.id}>
              <Element className={classes === null || classes === void 0 ? void 0 : classes.series} role={onItemClick ? 'button' : undefined} type={onItemClick ? 'button' : undefined} onClick={onItemClick
                    ? // @ts-ignore onClick is only attached to a button
                        function (event) { return onItemClick(event, (0, onClickContextBuilder_1.seriesContextBuilder)(item), i); }
                    : undefined}>
                <ChartsLabelMark_1.ChartsLabelMark className={classes === null || classes === void 0 ? void 0 : classes.mark} color={item.color} type={item.markType}/>
                <ChartsLabel_1.ChartsLabel className={classes === null || classes === void 0 ? void 0 : classes.label}>{item.label}</ChartsLabel_1.ChartsLabel>
              </Element>
            </li>);
        })}
      </RootElement>);
}));
exports.ChartsLegend = ChartsLegend;
ChartsLegend.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * The direction of the legend layout.
     * The default depends on the chart.
     */
    direction: prop_types_1.default.oneOf(['horizontal', 'vertical']),
    /**
     * Callback fired when a legend item is clicked.
     * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event The click event.
     * @param {SeriesLegendItemContext} legendItem The legend item data.
     * @param {number} index The index of the clicked legend item.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
     */
    slots: prop_types_1.default.object,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
