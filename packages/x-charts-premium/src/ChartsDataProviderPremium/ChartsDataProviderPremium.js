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
exports.defaultSeriesConfigPremium = void 0;
exports.ChartsDataProviderPremium = ChartsDataProviderPremium;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var internals_1 = require("@mui/x-charts/internals");
var ChartsLocalizationProvider_1 = require("@mui/x-charts/ChartsLocalizationProvider");
var internals_2 = require("@mui/x-charts-pro/internals");
var internals_3 = require("@mui/x-license/internals");
var internals_4 = require("@mui/x-charts-pro/internals");
var seriesConfig_1 = require("../BarChartPremium/RangeBar/seriesConfig");
var allPlugins_1 = require("../internals/plugins/allPlugins");
var useChartsDataProviderPremiumProps_1 = require("./useChartsDataProviderPremiumProps");
var seriesConfig_2 = require("../CandlestickChart/seriesConfig");
var packageInfo = {
    releaseDate: '__RELEASE_INFO__',
    version: process.env.MUI_VERSION,
    name: 'x-charts-premium',
};
exports.defaultSeriesConfigPremium = __assign(__assign({}, internals_4.defaultSeriesConfigPro), { rangeBar: seriesConfig_1.rangeBarSeriesConfig, ohlc: seriesConfig_2.ohlcSeriesConfig });
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
 * - [ChartsDataProviderPremium API](https://mui.com/x/api/charts/charts-data-provider-premium/)
 *
 * @example
 * ```jsx
 * <ChartsDataProviderPremium
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *   <ChartsSurface>
 *      <BarPlot />
 *      <ChartsXAxis axisId="x-axis" />
 *   </ChartsSurface>
 *   {'Custom Legend Component'}
 * </ChartsDataProviderPremium>
 * ```
 */
function ChartsDataProviderPremium(props) {
    var _a, _b;
    var _c = (0, useChartsDataProviderPremiumProps_1.useChartsDataProviderPremiumProps)(__assign(__assign({}, props), { seriesConfig: (_a = props.seriesConfig) !== null && _a !== void 0 ? _a : exports.defaultSeriesConfigPremium, plugins: (_b = props.plugins) !== null && _b !== void 0 ? _b : allPlugins_1.DEFAULT_PLUGINS })), children = _c.children, localeText = _c.localeText, chartProviderProps = _c.chartProviderProps, slots = _c.slots, slotProps = _c.slotProps;
    (0, internals_3.useLicenseVerifier)(packageInfo);
    return ((0, jsx_runtime_1.jsxs)(internals_1.ChartsProvider, __assign({}, chartProviderProps, { children: [(0, jsx_runtime_1.jsx)(ChartsLocalizationProvider_1.ChartsLocalizationProvider, { localeText: localeText, children: (0, jsx_runtime_1.jsx)(internals_1.ChartsSlotsProvider, { slots: slots, slotProps: slotProps, defaultSlots: internals_2.defaultSlotsMaterial, children: children }) }), (0, jsx_runtime_1.jsx)(internals_2.ChartsWatermark, { packageInfo: packageInfo })] })));
}
ChartsDataProviderPremium.propTypes = {
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
