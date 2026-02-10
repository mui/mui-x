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
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useLegend_1 = require("../hooks/useLegend");
var ChartsLabelMark_1 = require("../ChartsLabel/ChartsLabelMark");
var onClickContextBuilder_1 = require("./onClickContextBuilder");
var chartsLegendClasses_1 = require("./chartsLegendClasses");
var consumeSlots_1 = require("../internals/consumeSlots");
var ChartsLabel_1 = require("../ChartsLabel/ChartsLabel");
var ChartProvider_1 = require("../context/ChartProvider");
var useChartVisibilityManager_1 = require("../internals/plugins/featurePlugins/useChartVisibilityManager");
var useStore_1 = require("../internals/store/useStore");
var RootElement = (0, styles_1.styled)('ul', {
    name: 'MuiChartsLegend',
    slot: 'Root',
})(function (_a) {
    var _b, _c;
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
    }, _b["& .".concat(chartsLegendClasses_1.legendClasses.series)] = (_c = {
            display: ownerState.direction === 'vertical' ? 'flex' : 'inline-flex',
            alignItems: 'center',
            gap: theme.spacing(1),
            cursor: ownerState.onItemClick || ownerState.toggleVisibilityOnClick ? 'pointer' : 'default'
        },
        _c["&.".concat(chartsLegendClasses_1.legendClasses.hidden)] = {
            opacity: 0.5,
        },
        _c), _b.gridArea = 'legend', _b)));
});
var ChartsLegend = (0, consumeSlots_1.consumeSlots)('MuiChartsLegend', 'legend', {
    defaultProps: { direction: 'horizontal' },
    // @ts-expect-error position is used only in the slots, but it is passed to the SVG wrapper.
    // We omit it here to avoid passing to slots.
    omitProps: ['position'],
    classesResolver: chartsLegendClasses_1.useUtilityClasses,
}, React.forwardRef(function ChartsLegend(props, ref) {
    var data = (0, useLegend_1.useLegend)();
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    var store = (0, useStore_1.useStore)();
    var isItemVisible = store.use(useChartVisibilityManager_1.selectorIsItemVisibleGetter);
    var direction = props.direction, onItemClick = props.onItemClick, className = props.className, classes = props.classes, toggleVisibilityOnClick = props.toggleVisibilityOnClick, other = __rest(props, ["direction", "onItemClick", "className", "classes", "toggleVisibilityOnClick"]);
    var isButton = Boolean(onItemClick || toggleVisibilityOnClick);
    var Element = isButton ? 'button' : 'div';
    var handleClick = (0, useEventCallback_1.default)(function (item, i) {
        return function (event) {
            if (onItemClick && item) {
                onItemClick(event, (0, onClickContextBuilder_1.seriesContextBuilder)(item), i);
            }
            if (toggleVisibilityOnClick) {
                instance.toggleItemVisibility({
                    type: item.type,
                    seriesId: item.seriesId,
                    dataIndex: item.dataIndex,
                });
            }
        };
    });
    if (data.items.length === 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(RootElement, __assign({ className: (0, clsx_1.default)(classes === null || classes === void 0 ? void 0 : classes.root, className), ref: ref }, other, { ownerState: props, children: data.items.map(function (item, i) {
            var isVisible = isItemVisible({
                type: item.type,
                seriesId: item.seriesId,
                dataIndex: item.dataIndex,
            });
            return ((0, jsx_runtime_1.jsx)("li", { className: classes === null || classes === void 0 ? void 0 : classes.item, "data-series": item.seriesId, "data-index": item.dataIndex, children: (0, jsx_runtime_1.jsxs)(Element, { className: (0, clsx_1.default)(classes === null || classes === void 0 ? void 0 : classes.series, !isVisible && (classes === null || classes === void 0 ? void 0 : classes.hidden)), role: isButton ? 'button' : undefined, type: isButton ? 'button' : undefined, 
                    // @ts-expect-error onClick is only attached to a button
                    onClick: isButton ? handleClick(item, i) : undefined, children: [(0, jsx_runtime_1.jsx)(ChartsLabelMark_1.ChartsLabelMark, { className: classes === null || classes === void 0 ? void 0 : classes.mark, color: item.color, type: item.markType }), (0, jsx_runtime_1.jsx)(ChartsLabel_1.ChartsLabel, { className: classes === null || classes === void 0 ? void 0 : classes.label, children: item.label })] }) }, "".concat(item.seriesId, "-").concat(item.dataIndex)));
        }) })));
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
    /**
     * If `true`, clicking on a legend item will toggle the visibility of the corresponding series.
     * @default false
     */
    toggleVisibilityOnClick: prop_types_1.default.bool,
};
