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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsDataProvider = ChartsDataProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var material_1 = require("../internals/material");
var ChartsSlotsContext_1 = require("../context/ChartsSlotsContext");
var useChartsDataProviderProps_1 = require("./useChartsDataProviderProps");
var ChartsProvider_1 = require("../context/ChartsProvider");
var ChartsLocalizationProvider_1 = require("../ChartsLocalizationProvider");
/**
 * Orchestrates the data providers for the chart components and hooks.
 *
 * Use this component if you have custom HTML components that need to access the chart data.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/react-charts/composition/)
 *
 * API:
 *
 * - [ChartsDataProvider API](https://mui.com/x/api/charts/charts-data-provider/)
 *
 * @example
 * ```jsx
 * <ChartsDataProvider
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *   <ChartsSurface>
 *      <BarPlot />
 *      <ChartsXAxis axisId="x-axis" />
 *   </ChartsSurface>
 *   {'Custom Legend Component'}
 * </ChartsDataProvider>
 * ```
 */
function ChartsDataProvider(props) {
    var _a = (0, useChartsDataProviderProps_1.useChartsDataProviderProps)(props), children = _a.children, localeText = _a.localeText, chartProviderProps = _a.chartProviderProps, slots = _a.slots, slotProps = _a.slotProps;
    return ((0, jsx_runtime_1.jsx)(ChartsProvider_1.ChartsProvider, __assign({}, chartProviderProps, { children: (0, jsx_runtime_1.jsx)(ChartsLocalizationProvider_1.ChartsLocalizationProvider, { localeText: localeText, children: (0, jsx_runtime_1.jsx)(ChartsSlotsContext_1.ChartsSlotsProvider, { slots: slots, slotProps: slotProps, defaultSlots: material_1.defaultSlotsMaterial, children: children }) }) })));
}
ChartsDataProvider.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.any,
    }),
    /**
     * Color palette used to colorize multiple series.
     * @default rainbowSurgePalette
     */
    colors: prop_types_1.default.oneOfType([prop_types_1.default.arrayOf(prop_types_1.default.string), prop_types_1.default.func]),
    /**
     * An array of objects that can be used to populate series and axes data using their `dataKey` property.
     */
    dataset: prop_types_1.default.arrayOf(prop_types_1.default.object),
    /**
     * The height of the chart in px. If not defined, it takes the height of the parent element.
     */
    height: prop_types_1.default.number,
    /**
     * This prop is used to help implement the accessibility logic.
     * If you don't provide this prop. It falls back to a randomly generated id.
     */
    id: prop_types_1.default.string,
    /**
     * Localized text for chart components.
     */
    localeText: prop_types_1.default.object,
    /**
     * The margin between the SVG and the drawing area.
     * It's used for leaving some space for extra information such as the x- and y-axis or legend.
     *
     * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
     */
    margin: prop_types_1.default.oneOfType([
        prop_types_1.default.number,
        prop_types_1.default.shape({
            bottom: prop_types_1.default.number,
            left: prop_types_1.default.number,
            right: prop_types_1.default.number,
            top: prop_types_1.default.number,
        }),
    ]),
    /**
     * The array of series to display.
     * Each type of series has its own specificity.
     * Please refer to the appropriate docs page to learn more about it.
     */
    series: prop_types_1.default.arrayOf(prop_types_1.default.object),
    /**
     * If `true`, animations are skipped.
     * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
     */
    skipAnimation: prop_types_1.default.bool,
    /**
     * The props for the slots.
     */
    slotProps: prop_types_1.default.object,
    /**
     * Slots to customize charts' components.
     */
    slots: prop_types_1.default.object,
    theme: prop_types_1.default.oneOf(['dark', 'light']),
    /**
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width: prop_types_1.default.number,
};
