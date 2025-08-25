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
exports.ChartDataProviderPro = ChartDataProviderPro;
var React = require("react");
var prop_types_1 = require("prop-types");
var Watermark_1 = require("@mui/x-license/Watermark");
var internals_1 = require("@mui/x-charts/internals");
var ChartsLocalizationProvider_1 = require("@mui/x-charts/ChartsLocalizationProvider");
var useLicenseVerifier_1 = require("@mui/x-license/useLicenseVerifier");
var material_1 = require("../internals/material");
var allPlugins_1 = require("../internals/plugins/allPlugins");
var useChartDataProviderProProps_1 = require("./useChartDataProviderProProps");
var releaseInfo = '__RELEASE_INFO__';
var packageIdentifier = 'x-charts-pro';
/**
 * Orchestrates the data providers for the chart components and hooks.
 *
 * Use this component if you have custom HTML components that need to access the chart data.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartDataProviderPro API](https://mui.com/x/api/charts/chart-data-provider/)
 *
 * @example
 * ```jsx
 * <ChartDataProviderPro
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *   <ChartsSurface>
 *      <BarPlot />
 *      <ChartsXAxis axisId="x-axis" />
 *   </ChartsSurface>
 *   {'Custom Legend Component'}
 * </ChartDataProviderPro>
 * ```
 */
function ChartDataProviderPro(props) {
    var _a;
    var _b = (0, useChartDataProviderProProps_1.useChartDataProviderProProps)(__assign(__assign({}, props), { plugins: (_a = props.plugins) !== null && _a !== void 0 ? _a : allPlugins_1.DEFAULT_PLUGINS })), children = _b.children, localeText = _b.localeText, chartProviderProps = _b.chartProviderProps, slots = _b.slots, slotProps = _b.slotProps;
    (0, useLicenseVerifier_1.useLicenseVerifier)(packageIdentifier, releaseInfo);
    return (<internals_1.ChartProvider {...chartProviderProps}>
      <ChartsLocalizationProvider_1.ChartsLocalizationProvider localeText={localeText}>
        <internals_1.ChartsSlotsProvider slots={slots} slotProps={slotProps} defaultSlots={material_1.defaultSlotsMaterial}>
          {children}
        </internals_1.ChartsSlotsProvider>
      </ChartsLocalizationProvider_1.ChartsLocalizationProvider>
      <Watermark_1.Watermark packageName={packageIdentifier} releaseInfo={releaseInfo}/>
    </internals_1.ChartProvider>);
}
ChartDataProviderPro.propTypes = {
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
     * Options to enable features planned for the next major.
     */
    experimentalFeatures: prop_types_1.default.shape({
        preferStrictDomainInLineCharts: prop_types_1.default.bool,
    }),
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
