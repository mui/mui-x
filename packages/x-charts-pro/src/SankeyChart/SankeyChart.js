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
exports.SankeyChart = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var ChartsOverlay_1 = require("@mui/x-charts/ChartsOverlay");
var ChartsWrapper_1 = require("@mui/x-charts/ChartsWrapper");
var useChartsContainerProProps_1 = require("../ChartsContainerPro/useChartsContainerProProps");
var SankeyPlot_1 = require("./SankeyPlot");
var useSankeyChartProps_1 = require("./useSankeyChartProps");
var SankeyTooltip_1 = require("./SankeyTooltip");
var FocusedSankeyNode_1 = require("./FocusedSankeyNode");
var FocusedSankeyLink_1 = require("./FocusedSankeyLink");
var SankeyDataProvider_1 = require("./SankeyDataProvider");
/**
 * Sankey Chart component
 *
 * Displays a Sankey diagram, visualizing flows between nodes where the width
 * of the links is proportional to the flow quantity.
 *
 * Demos:
 *
 * - [Sankey Chart](https://mui.com/x/react-charts/sankey/)
 *
 * API:
 *
 * - [SankeyChart API](https://mui.com/x/api/charts/sankey-chart/)
 */
var SankeyChart = React.forwardRef(function SankeyChart(props, ref) {
    var _a, _b, _c;
    var themedProps = (0, styles_1.useThemeProps)({ props: props, name: 'MuiSankeyChart' });
    var _d = (0, useSankeyChartProps_1.useSankeyChartProps)(themedProps), chartsContainerProps = _d.chartsContainerProps, sankeyPlotProps = _d.sankeyPlotProps, overlayProps = _d.overlayProps, chartsWrapperProps = _d.chartsWrapperProps, children = _d.children;
    var _e = (0, useChartsContainerProProps_1.useChartsContainerProProps)(chartsContainerProps), _f = _e.chartsDataProviderProProps, series = _f.series, chartsDataProviderProProps = __rest(_f, ["series"]), chartsSurfaceProps = _e.chartsSurfaceProps;
    var Tooltip = (_b = (_a = themedProps.slots) === null || _a === void 0 ? void 0 : _a.tooltip) !== null && _b !== void 0 ? _b : SankeyTooltip_1.SankeyTooltip;
    return ((0, jsx_runtime_1.jsx)(SankeyDataProvider_1.SankeyDataProvider, __assign({ series: series }, chartsDataProviderProProps, { children: (0, jsx_runtime_1.jsxs)(ChartsWrapper_1.ChartsWrapper, __assign({}, chartsWrapperProps, { ref: ref, children: [(0, jsx_runtime_1.jsxs)(ChartsSurface_1.ChartsSurface, __assign({}, chartsSurfaceProps, { children: [(0, jsx_runtime_1.jsx)(SankeyPlot_1.SankeyPlot, __assign({}, sankeyPlotProps)), (0, jsx_runtime_1.jsx)(ChartsOverlay_1.ChartsOverlay, __assign({}, overlayProps)), (0, jsx_runtime_1.jsx)(FocusedSankeyNode_1.FocusedSankeyNode, {}), (0, jsx_runtime_1.jsx)(FocusedSankeyLink_1.FocusedSankeyLink, {}), children] })), !themedProps.loading && (0, jsx_runtime_1.jsx)(Tooltip, __assign({ trigger: "item" }, (_c = themedProps.slotProps) === null || _c === void 0 ? void 0 : _c.tooltip))] })) })));
});
exports.SankeyChart = SankeyChart;
SankeyChart.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.shape({
            exportAsImage: prop_types_1.default.func.isRequired,
            exportAsPrint: prop_types_1.default.func.isRequired,
        }),
    }),
    /**
     * Classes applied to the various elements.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * Color palette used to colorize multiple series.
     * @default rainbowSurgePalette
     */
    colors: prop_types_1.default.oneOfType([prop_types_1.default.arrayOf(prop_types_1.default.string), prop_types_1.default.func]),
    /**
     * The description of the chart.
     * Used to provide an accessible description for the chart.
     */
    desc: prop_types_1.default.string,
    /**
     * If `true`, disables keyboard navigation for the chart.
     */
    disableKeyboardNavigation: prop_types_1.default.bool,
    /**
     * Options to enable features planned for the next major.
     */
    experimentalFeatures: prop_types_1.default.object,
    /**
     * The height of the chart in px. If not defined, it takes the height of the parent element.
     */
    height: prop_types_1.default.number,
    /**
     * The highlighted item.
     * Used when the highlight is controlled.
     */
    highlightedItem: prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            nodeId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            seriesId: prop_types_1.default.string.isRequired,
            subType: prop_types_1.default.oneOf([
                /**
                 * Subtype to differentiate between node and link
                 */
                'node',
            ]).isRequired,
            type: prop_types_1.default.oneOf(['sankey']).isRequired,
        }),
        prop_types_1.default.shape({
            seriesId: prop_types_1.default.string.isRequired,
            sourceId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            subType: prop_types_1.default.oneOf([
                /**
                 * Subtype to differentiate between node and link
                 */
                'link',
            ]).isRequired,
            targetId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            type: prop_types_1.default.oneOf(['sankey']).isRequired,
        }),
        prop_types_1.default.shape({
            nodeId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            seriesId: prop_types_1.default.string.isRequired,
            subType: prop_types_1.default.oneOf([
                /**
                 * Subtype to differentiate between node and link
                 */
                'node',
            ]).isRequired,
        }),
        prop_types_1.default.shape({
            seriesId: prop_types_1.default.string.isRequired,
            sourceId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            subType: prop_types_1.default.oneOf([
                /**
                 * Subtype to differentiate between node and link
                 */
                'link',
            ]).isRequired,
            targetId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
        }),
    ]),
    /**
     * This prop is used to help implement the accessibility logic.
     * If you don't provide this prop. It falls back to a randomly generated id.
     */
    id: prop_types_1.default.string,
    /**
     * If `true`, a loading overlay is displayed.
     * @default false
     */
    loading: prop_types_1.default.bool,
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
     * The callback fired when the highlighted item changes.
     *
     * @param {HighlightItemIdentifierWithType<SeriesType> | null} highlightedItem  The newly highlighted item.
     */
    onHighlightChange: prop_types_1.default.func,
    /**
     * Callback fired when a sankey item is clicked.
     * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
     * @param {SankeyLinkIdentifierWithData} link The sankey link identifier.
     */
    onLinkClick: prop_types_1.default.func,
    /**
     * Callback fired when a sankey item is clicked.
     * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
     * @param {SankeyNodeIdentifierWithData} node The sankey node identifier.
     */
    onNodeClick: prop_types_1.default.func,
    /**
     * The callback fired when the tooltip item changes.
     *
     * @param {SeriesItemIdentifier<SeriesType> | null} tooltipItem  The newly highlighted item.
     */
    onTooltipItemChange: prop_types_1.default.func,
    /**
     * The series to display in the Sankey chart.
     * A single object is expected.
     */
    series: prop_types_1.default.object.isRequired,
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
    theme: prop_types_1.default.oneOf(['dark', 'light']),
    /**
     * The title of the chart.
     * Used to provide an accessible label for the chart.
     */
    title: prop_types_1.default.string,
    /**
     * The tooltip item.
     * Used when the tooltip is controlled.
     */
    tooltipItem: prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            nodeId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            seriesId: prop_types_1.default.string.isRequired,
            subType: prop_types_1.default.oneOf([
                /**
                 * Subtype to differentiate between node and link
                 */
                'node',
            ]).isRequired,
            type: prop_types_1.default.oneOf(['sankey']).isRequired,
        }),
        prop_types_1.default.shape({
            seriesId: prop_types_1.default.string.isRequired,
            sourceId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            subType: prop_types_1.default.oneOf([
                /**
                 * Subtype to differentiate between node and link
                 */
                'link',
            ]).isRequired,
            targetId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            type: prop_types_1.default.oneOf(['sankey']).isRequired,
        }),
        prop_types_1.default.shape({
            nodeId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            seriesId: prop_types_1.default.string.isRequired,
            subType: prop_types_1.default.oneOf([
                /**
                 * Subtype to differentiate between node and link
                 */
                'node',
            ]).isRequired,
        }),
        prop_types_1.default.shape({
            seriesId: prop_types_1.default.string.isRequired,
            sourceId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            subType: prop_types_1.default.oneOf([
                /**
                 * Subtype to differentiate between node and link
                 */
                'link',
            ]).isRequired,
            targetId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
        }),
    ]),
    /**
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width: prop_types_1.default.number,
};
