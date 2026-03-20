"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsRenderer = ChartsRenderer;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var BarChartPro_1 = require("@mui/x-charts-pro/BarChartPro");
var LineChartPro_1 = require("@mui/x-charts-pro/LineChartPro");
var PieChartPro_1 = require("@mui/x-charts-pro/PieChartPro");
var configuration_1 = require("./configuration");
var colors_1 = require("./colors");
var getLegendPosition = function (position) {
    var horizontal = 'center';
    var vertical = 'middle';
    if (position === 'none') {
        return undefined;
    }
    if (position === 'top' || position === 'topLeft' || position === 'topRight') {
        vertical = 'top';
    }
    if (position === 'bottom' || position === 'bottomLeft' || position === 'bottomRight') {
        vertical = 'bottom';
    }
    if (position === 'left' || position === 'topLeft' || position === 'bottomLeft') {
        horizontal = 'start';
    }
    if (position === 'right' || position === 'topRight' || position === 'bottomRight') {
        horizontal = 'end';
    }
    return { horizontal: horizontal, vertical: vertical };
};
/**
 * A component that renders different types of charts based on the provided data and configuration.
 * It supports column, bar, line, area and pie charts with customizable styling and formatting options.
 * The component handles both single and multiple dimension datasets, with special data processing for each case.
 * For multiple dimension datasets, it creates grouped axes.
 *
 * @link https://www.mui.com/x/react-charts/data-grid-integration/
 * @param {Array<{id: string, label: string, data: Array<string|number|Date|null>}>} props.dimensions - Array of dimension objects containing data for chart axes
 * @param {Array<{id: string, label: string, data: Array<number|null>}>} props.values - Array of value objects containing the numerical data to plot
 * @param {string} props.chartType - Type of chart to render (e.g. 'bar', 'line', 'pie')
 * @param {Object} props.configuration - Configuration object containing chart-specific options. These options are merged with default configurations defined for each chart type
 * @param {Function} [props.onRender] - Optional callback function called before rendering to modify chart props. Receives chart type, props and component as arguments and should return a React node
 * @returns {React.ReactNode} The rendered chart component
 */
function ChartsRenderer(_a) {
    var _b;
    var _c;
    var dimensions = _a.dimensions, values = _a.values, chartType = _a.chartType, configuration = _a.configuration, onRender = _a.onRender;
    var hasMultipleDimensions = dimensions.length > 1;
    var dimensionRawData = dimensions.length > 0 ? dimensions[dimensions.length - 1].data : [];
    var dimensionLabel = __spreadArray([], dimensions.map(function (dimension) { return dimension.label; }), true).reverse().join(' - ');
    // for single dimension dataset: make sure that the items are unique. for repeated values add the count to the value
    // for multiple dimension datasets: transpose the data and create a array of arrays with the data per index
    // this will allow easier data management in the groups value getter function
    var itemCount = new Map();
    var dimensionData = hasMultipleDimensions
        ? Array.from({ length: dimensions[0].data.length }, function (_, dataIndex) {
            return dimensions.map(function (dimension) { return dimension.data[dataIndex]; });
        })
        : dimensionRawData.map(function (item) {
            var itemValue = item instanceof Date ? item.toLocaleDateString() : String(item);
            var currentCount = itemCount.get(itemValue) || 1;
            itemCount.set(itemValue, currentCount + 1);
            return currentCount > 1 ? "".concat(item, " (").concat(currentCount, ")") : item;
        });
    // for multiple dimension datasets, create groups and height props for the axis
    var groups = hasMultipleDimensions
        ? Array.from({ length: dimensions.length }, function (_, dimensionIndex) { return ({
            getValue: function (value) { return value[dimensionIndex]; },
        }); }).reverse()
        : undefined;
    var valueFormatter = function (value) {
        if (Array.isArray(value)) {
            return value.join(' - ');
        }
        return String(value);
    };
    var sections = ((_c = configuration_1.configurationOptions[chartType]) === null || _c === void 0 ? void 0 : _c.customization) || [];
    var defaultOptions = Object.fromEntries(sections.flatMap(function (section) {
        return Object.entries(section.controls).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [key, value.default];
        });
    }));
    // merge passed options with the defaults
    var chartConfiguration = React.useMemo(function () {
        return __assign(__assign({}, defaultOptions), configuration);
    }, [defaultOptions, configuration]);
    if (chartType === 'bar' || chartType === 'column') {
        var layout = chartType === 'bar' ? 'horizontal' : 'vertical';
        var _d = layout === 'vertical'
            ? {
                categoriesAxis: 'xAxis',
                categoriesAxisPosition: chartConfiguration.xAxisPosition,
                seriesAxis: 'yAxis',
                seriesAxisPosition: chartConfiguration.yAxisPosition,
            }
            : {
                categoriesAxis: 'yAxis',
                categoriesAxisPosition: chartConfiguration.yAxisPosition,
                seriesAxis: 'xAxis',
                seriesAxisPosition: chartConfiguration.xAxisPosition,
            }, categoriesAxis = _d.categoriesAxis, categoriesAxisPosition = _d.categoriesAxisPosition, seriesAxis = _d.seriesAxis, seriesAxisPosition = _d.seriesAxisPosition;
        // Build axis configuration
        var categoriesAxisConfig = {
            data: dimensionData,
            categoryGapRatio: chartConfiguration.categoryGapRatio,
            barGapRatio: chartConfiguration.barGapRatio,
            tickPlacement: chartConfiguration.tickPlacement,
            tickLabelPlacement: chartConfiguration.tickLabelPlacement,
            valueFormatter: valueFormatter,
            groups: groups,
            label: chartConfiguration.categoriesAxisLabel || dimensionLabel,
            position: categoriesAxisPosition,
        };
        var seriesAxisConfig = {
            label: chartConfiguration.seriesAxisLabel,
            position: seriesAxisPosition,
            reverse: chartConfiguration.seriesAxisReverse,
        };
        var axisProp = (_b = {},
            _b[categoriesAxis] = [categoriesAxisConfig],
            _b[seriesAxis] = [seriesAxisConfig],
            _b);
        var seriesProp = chartConfiguration.stacked
            ? values.map(function (value) { return (__assign(__assign({}, value), { stack: 'stack' })); })
            : values;
        var barLabel = chartConfiguration.itemLabel === 'value' ? 'value' : undefined;
        var legendPosition = getLegendPosition(chartConfiguration.legendDirection === 'vertical'
            ? chartConfiguration.legendPositionVertical
            : chartConfiguration.legendPositionHorizontal);
        var props = __assign(__assign({}, axisProp), { series: seriesProp, hideLegend: legendPosition === undefined, height: chartConfiguration.height, layout: layout, borderRadius: chartConfiguration.borderRadius, colors: colors_1.colorPaletteLookup.get(chartConfiguration.colors), grid: {
                vertical: chartConfiguration.grid === 'vertical' || chartConfiguration.grid === 'both',
                horizontal: chartConfiguration.grid === 'horizontal' || chartConfiguration.grid === 'both',
            }, skipAnimation: chartConfiguration.skipAnimation, showToolbar: chartConfiguration.showToolbar, barLabel: barLabel, slotProps: {
                tooltip: {
                    trigger: chartConfiguration.tooltipTrigger,
                    placement: chartConfiguration.tooltipPlacement,
                },
                legend: {
                    direction: chartConfiguration.legendDirection,
                    position: legendPosition,
                },
            } });
        return onRender ? onRender(chartType, props, BarChartPro_1.BarChartPro) : (0, jsx_runtime_1.jsx)(BarChartPro_1.BarChartPro, __assign({}, props));
    }
    if (chartType === 'line' || chartType === 'area') {
        var area_1 = chartType === 'area';
        var seriesProp = values.map(function (value) { return (__assign(__assign({}, value), { area: area_1, curve: chartConfiguration.interpolation, showMark: chartConfiguration.showMark, stack: chartConfiguration.stacked ? 'stack' : undefined })); });
        // Build axis configuration
        var xAxisConfig = {
            data: dimensionData,
            scaleType: 'point',
            valueFormatter: valueFormatter,
            groups: groups,
            label: chartConfiguration.categoriesAxisLabel || dimensionLabel,
            position: chartConfiguration.xAxisPosition,
        };
        var yAxisConfig = {
            label: chartConfiguration.seriesAxisLabel,
            position: chartConfiguration.yAxisPosition,
            reverse: chartConfiguration.seriesAxisReverse,
        };
        var legendPosition = getLegendPosition(chartConfiguration.legendDirection === 'vertical'
            ? chartConfiguration.legendPositionVertical
            : chartConfiguration.legendPositionHorizontal);
        var props = {
            xAxis: [xAxisConfig],
            yAxis: [yAxisConfig],
            series: seriesProp,
            hideLegend: legendPosition === undefined,
            height: chartConfiguration.height,
            colors: colors_1.colorPaletteLookup.get(chartConfiguration.colors),
            skipAnimation: chartConfiguration.skipAnimation,
            showToolbar: chartConfiguration.showToolbar,
            grid: {
                vertical: chartConfiguration.grid === 'vertical' || chartConfiguration.grid === 'both',
                horizontal: chartConfiguration.grid === 'horizontal' || chartConfiguration.grid === 'both',
            },
            slotProps: {
                tooltip: {
                    trigger: chartConfiguration.tooltipTrigger,
                    placement: chartConfiguration.tooltipPlacement,
                },
                legend: {
                    direction: chartConfiguration.legendDirection,
                    position: legendPosition,
                },
            },
        };
        return onRender ? onRender(chartType, props, LineChartPro_1.LineChartPro) : (0, jsx_runtime_1.jsx)(LineChartPro_1.LineChartPro, __assign({}, props));
    }
    if (chartType === 'pie') {
        // - `chartConfiguration.outerRadius - chartConfiguration.innerRadius` is available radius for the whole chart
        // - to get the radius for each series, we need to substract all the gaps
        //   between the series from the total available radius (`chartConfiguration.seriesGap * values.length - 1` - there is always
        //   one gap less than the number of series)
        // - then we divide the result by the number of series to get the radius for each series
        var radiusPerSeries_1 = (chartConfiguration.outerRadius -
            chartConfiguration.innerRadius -
            chartConfiguration.seriesGap * values.length -
            1) /
            values.length;
        var seriesProp = values.map(function (valueItem, valueIndex) { return ({
            data: valueItem.data.map(function (item, itemIndex) { return ({
                id: "".concat(valueItem.id, "-").concat(itemIndex),
                value: item || 0,
                label: "".concat(String(dimensionData[itemIndex]), " - ").concat(valueItem.label),
            }); }),
            arcLabel: chartConfiguration.itemLabel === 'value' ? 'value' : undefined,
            // each series starts from
            // - inner radius of the chart
            // - plus all the series before
            // - plus the gap between the series
            innerRadius: chartConfiguration.innerRadius +
                valueIndex * radiusPerSeries_1 +
                chartConfiguration.seriesGap * valueIndex,
            // each series ends at the radius that is the same as start plus the radius of one series
            outerRadius: chartConfiguration.innerRadius +
                (valueIndex + 1) * radiusPerSeries_1 +
                chartConfiguration.seriesGap * valueIndex,
            cornerRadius: chartConfiguration.cornerRadius,
            startAngle: chartConfiguration.startAngle,
            endAngle: chartConfiguration.endAngle,
            paddingAngle: chartConfiguration.paddingAngle,
        }); });
        var legendPosition = getLegendPosition(chartConfiguration.pieLegendDirection === 'vertical'
            ? chartConfiguration.pieLegendPositionVertical
            : chartConfiguration.pieLegendPositionHorizontal);
        var props = {
            series: seriesProp,
            height: chartConfiguration.height,
            width: chartConfiguration.width,
            skipAnimation: chartConfiguration.skipAnimation,
            hideLegend: legendPosition === undefined,
            colors: colors_1.colorPaletteLookup.get(chartConfiguration.colors),
            showToolbar: chartConfiguration.showToolbar,
            slotProps: {
                legend: {
                    direction: chartConfiguration.pieLegendDirection,
                    position: legendPosition,
                    sx: {
                        overflowY: 'scroll',
                        flexWrap: 'nowrap',
                        maxWidth: chartConfiguration.width,
                        maxHeight: chartConfiguration.height,
                    },
                },
                tooltip: {
                    trigger: chartConfiguration.pieTooltipTrigger,
                    placement: chartConfiguration.tooltipPlacement,
                },
            },
        };
        return onRender ? onRender(chartType, props, PieChartPro_1.PieChartPro) : (0, jsx_runtime_1.jsx)(PieChartPro_1.PieChartPro, __assign({}, props));
    }
    return null;
}
ChartsRenderer.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    chartType: prop_types_1.default.string.isRequired,
    configuration: prop_types_1.default.object.isRequired,
    dimensions: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        data: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number, prop_types_1.default.string])).isRequired,
        id: prop_types_1.default.string.isRequired,
        label: prop_types_1.default.string.isRequired,
    })).isRequired,
    onRender: prop_types_1.default.func,
    values: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        data: prop_types_1.default.arrayOf(prop_types_1.default.number).isRequired,
        id: prop_types_1.default.string.isRequired,
        label: prop_types_1.default.string.isRequired,
    })).isRequired,
};
