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
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurationOptions = exports.getLocalizedConfigurationOptions = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var locales_1 = require("@mui/x-charts/locales");
var PaletteOption_1 = require("./components/PaletteOption");
var colors_1 = require("./colors");
var icons_1 = require("./icons");
var getChartSection = function (localeText) { return ({
    id: 'chart',
    label: localeText.chartConfigurationSectionChart,
    controls: {
        showToolbar: {
            label: localeText.chartConfigurationShowToolbar,
            type: 'boolean',
            default: false,
        },
        height: { label: localeText.chartConfigurationHeight, type: 'number', default: 350 },
        grid: {
            label: localeText.chartConfigurationGrid,
            type: 'select',
            default: 'none',
            options: [
                { content: localeText.chartConfigurationOptionNone, value: 'none' },
                { content: localeText.chartConfigurationOptionHorizontal, value: 'horizontal' },
                { content: localeText.chartConfigurationOptionVertical, value: 'vertical' },
                { content: localeText.chartConfigurationOptionBoth, value: 'both' },
            ],
        },
        skipAnimation: {
            label: localeText.chartConfigurationSkipAnimation,
            type: 'boolean',
            default: false,
        },
    },
}); };
var getAxesSection = function (localeText, tickOptions) {
    if (tickOptions === void 0) { tickOptions = true; }
    return ({
        id: 'axes',
        label: localeText.chartConfigurationSectionAxes,
        controls: __assign(__assign(__assign({ categoriesAxisLabel: {
                label: localeText.chartConfigurationCategoriesAxisLabel,
                type: 'string',
                default: '',
            }, seriesAxisLabel: {
                label: localeText.chartConfigurationSeriesAxisLabel,
                type: 'string',
                default: '',
            }, xAxisPosition: {
                label: localeText.chartConfigurationXAxisPosition,
                type: 'select',
                default: 'bottom',
                options: [
                    { content: localeText.chartConfigurationOptionNone, value: 'none' },
                    { content: localeText.chartConfigurationOptionBottom, value: 'bottom' },
                    { content: localeText.chartConfigurationOptionTop, value: 'top' },
                ],
            }, yAxisPosition: {
                label: localeText.chartConfigurationYAxisPosition,
                type: 'select',
                default: 'left',
                options: [
                    { content: localeText.chartConfigurationOptionNone, value: 'none' },
                    { content: localeText.chartConfigurationOptionLeft, value: 'left' },
                    { content: localeText.chartConfigurationOptionRight, value: 'right' },
                ],
            } }, (tickOptions
            ? {
                tickPlacement: {
                    label: localeText.chartConfigurationTickPlacement,
                    type: 'select',
                    default: 'extremities',
                    options: [
                        { content: localeText.chartConfigurationOptionEnd, value: 'end' },
                        {
                            content: localeText.chartConfigurationOptionExtremities,
                            value: 'extremities',
                        },
                        { content: localeText.chartConfigurationOptionMiddle, value: 'middle' },
                        { content: localeText.chartConfigurationOptionStart, value: 'start' },
                    ],
                },
            }
            : {})), (tickOptions
            ? {
                tickLabelPlacement: {
                    label: localeText.chartConfigurationTickLabelPlacement,
                    type: 'select',
                    default: 'middle',
                    options: [
                        { content: localeText.chartConfigurationOptionMiddle, value: 'middle' },
                        { content: localeText.chartConfigurationOptionTick, value: 'tick' },
                    ],
                },
            }
            : {})), { seriesAxisReverse: {
                label: localeText.chartConfigurationSeriesAxisReverse,
                type: 'boolean',
                default: false,
            } }),
    });
};
var getTooltipSection = function (localeText) { return ({
    id: 'tooltip',
    label: localeText.chartConfigurationSectionTooltip,
    controls: {
        tooltipPlacement: {
            label: localeText.chartConfigurationTooltipPlacement,
            type: 'select',
            default: 'auto',
            options: [
                { content: localeText.chartConfigurationOptionAuto, value: 'auto' },
                { content: localeText.chartConfigurationOptionTop, value: 'top' },
                { content: localeText.chartConfigurationOptionBottom, value: 'bottom' },
                { content: localeText.chartConfigurationOptionLeft, value: 'left' },
                { content: localeText.chartConfigurationOptionRight, value: 'right' },
            ],
        },
        tooltipTrigger: {
            label: localeText.chartConfigurationTooltipTrigger,
            type: 'select',
            default: 'axis',
            options: [
                { content: localeText.chartConfigurationOptionNone, value: 'none' },
                { content: localeText.chartConfigurationOptionAxis, value: 'axis' },
                { content: localeText.chartConfigurationOptionItem, value: 'item' },
            ],
        },
    },
}); };
var getLegendSection = function (localeText, defaultDirection, keyPrefix) {
    var _a;
    if (defaultDirection === void 0) { defaultDirection = 'horizontal'; }
    if (keyPrefix === void 0) { keyPrefix = 'legend'; }
    return ({
        id: 'legend',
        label: localeText.chartConfigurationSectionLegend,
        controls: (_a = {},
            _a["".concat(keyPrefix, "PositionHorizontal")] = {
                label: localeText.chartConfigurationLegendPosition,
                type: 'select',
                default: 'top',
                options: [
                    { content: localeText.chartConfigurationOptionNone, value: 'none' },
                    { content: localeText.chartConfigurationOptionTopLeft, value: 'topLeft' },
                    { content: localeText.chartConfigurationOptionTop, value: 'top' },
                    { content: localeText.chartConfigurationOptionTopRight, value: 'topRight' },
                    { content: localeText.chartConfigurationOptionBottomLeft, value: 'bottomLeft' },
                    { content: localeText.chartConfigurationOptionBottom, value: 'bottom' },
                    { content: localeText.chartConfigurationOptionBottomRight, value: 'bottomRight' },
                ],
                isHidden: function (_a) {
                    var configuration = _a.configuration;
                    return configuration["".concat(keyPrefix, "Direction")] === 'vertical' ||
                        (configuration["".concat(keyPrefix, "Direction")] === undefined && defaultDirection === 'vertical');
                },
            },
            _a["".concat(keyPrefix, "PositionVertical")] = {
                label: localeText.chartConfigurationLegendPosition,
                type: 'select',
                default: 'right',
                options: [
                    { content: localeText.chartConfigurationOptionNone, value: 'none' },
                    { content: localeText.chartConfigurationOptionTopLeft, value: 'topLeft' },
                    { content: localeText.chartConfigurationOptionLeft, value: 'left' },
                    { content: localeText.chartConfigurationOptionBottomLeft, value: 'bottomLeft' },
                    { content: localeText.chartConfigurationOptionTopRight, value: 'topRight' },
                    { content: localeText.chartConfigurationOptionRight, value: 'right' },
                    { content: localeText.chartConfigurationOptionBottomRight, value: 'bottomRight' },
                ],
                isHidden: function (_a) {
                    var configuration = _a.configuration;
                    return configuration["".concat(keyPrefix, "Direction")] === 'horizontal' ||
                        (configuration["".concat(keyPrefix, "Direction")] === undefined && defaultDirection === 'horizontal');
                },
            },
            _a["".concat(keyPrefix, "Direction")] = {
                label: localeText.chartConfigurationLegendDirection,
                type: 'select',
                default: defaultDirection,
                options: [
                    { content: localeText.chartConfigurationOptionHorizontal, value: 'horizontal' },
                    { content: localeText.chartConfigurationOptionVertical, value: 'vertical' },
                ],
            },
            _a),
    });
};
var getColors = function (localeText) { return [
    { key: 'rainbowSurgePalette', name: localeText.chartPaletteNameRainbowSurge },
    { key: 'blueberryTwilightPalette', name: localeText.chartPaletteNameBlueberryTwilight },
    { key: 'mangoFusionPalette', name: localeText.chartPaletteNameMangoFusion },
    { key: 'cheerfulFiestaPalette', name: localeText.chartPaletteNameCheerfulFiesta },
    { key: 'strawberrySkyPalette', name: localeText.chartPaletteNameStrawberrySky },
    { key: 'bluePalette', name: localeText.chartPaletteNameBlue },
    { key: 'greenPalette', name: localeText.chartPaletteNameGreen },
    { key: 'purplePalette', name: localeText.chartPaletteNamePurple },
    { key: 'redPalette', name: localeText.chartPaletteNameRed },
    { key: 'orangePalette', name: localeText.chartPaletteNameOrange },
    { key: 'yellowPalette', name: localeText.chartPaletteNameYellow },
    { key: 'cyanPalette', name: localeText.chartPaletteNameCyan },
    { key: 'pinkPalette', name: localeText.chartPaletteNamePink },
]; };
var getColorOptions = function (localeText) { return ({
    label: localeText.chartPaletteLabel,
    type: 'select',
    default: 'rainbowSurgePalette',
    options: getColors(localeText).map(function (_a) {
        var key = _a.key, name = _a.name;
        return ({
            value: key,
            content: (0, jsx_runtime_1.jsx)(PaletteOption_1.PaletteOption, { palette: colors_1.colorPaletteLookup.get(key), children: name }),
        });
    }),
}); };
var getBarColumnCustomization = function (type, localeText) { return [
    {
        id: 'data',
        label: type === 'bar'
            ? localeText.chartConfigurationSectionBars
            : localeText.chartConfigurationSectionColumns,
        controls: {
            borderRadius: {
                label: localeText.chartConfigurationBorderRadius,
                type: 'number',
                default: 0,
            },
            colors: getColorOptions(localeText),
            categoryGapRatio: {
                label: localeText.chartConfigurationCategoryGapRatio,
                type: 'number',
                default: 0.2,
                htmlAttributes: {
                    min: '0',
                    max: '1',
                    step: '0.1',
                },
            },
            barGapRatio: {
                label: localeText.chartConfigurationBarGapRatio,
                type: 'number',
                default: 0.1,
                htmlAttributes: {
                    min: '0',
                    max: '1',
                    step: '0.1',
                },
            },
            stacked: {
                label: localeText.chartConfigurationStacked,
                type: 'boolean',
                default: false,
                isDisabled: function (_a) {
                    var values = _a.values;
                    return values.length < 2;
                },
            },
            itemLabel: {
                label: type === 'bar'
                    ? localeText.chartConfigurationBarLabels
                    : localeText.chartConfigurationColumnLabels,
                type: 'select',
                default: 'none',
                options: [
                    { content: localeText.chartConfigurationOptionNone, value: 'none' },
                    { content: localeText.chartConfigurationOptionValue, value: 'value' },
                ],
            },
        },
    },
    getChartSection(localeText),
    getAxesSection(localeText),
    getTooltipSection(localeText),
    getLegendSection(localeText),
]; };
var getLineAreaCustomization = function (type, localeText) { return [
    {
        id: 'data',
        label: type === 'line'
            ? localeText.chartConfigurationSectionLines
            : localeText.chartConfigurationSectionAreas,
        controls: {
            interpolation: {
                label: localeText.chartConfigurationInterpolation,
                type: 'select',
                default: 'monotoneX',
                options: [
                    { content: localeText.chartConfigurationOptionMonotoneX, value: 'monotoneX' },
                    { content: localeText.chartConfigurationOptionMonotoneY, value: 'monotoneY' },
                    { content: localeText.chartConfigurationOptionCatmullRom, value: 'catmullRom' },
                    { content: localeText.chartConfigurationOptionLinear, value: 'linear' },
                    { content: localeText.chartConfigurationOptionNatural, value: 'natural' },
                    { content: localeText.chartConfigurationOptionStep, value: 'step' },
                    { content: localeText.chartConfigurationOptionStepBefore, value: 'stepBefore' },
                    { content: localeText.chartConfigurationOptionStepAfter, value: 'stepAfter' },
                    { content: localeText.chartConfigurationOptionBumpX, value: 'bumpX' },
                    { content: localeText.chartConfigurationOptionBumpY, value: 'bumpY' },
                ],
            },
            colors: getColorOptions(localeText),
            stacked: {
                label: localeText.chartConfigurationStacked,
                type: 'boolean',
                default: false,
                isDisabled: function (_a) {
                    var values = _a.values;
                    return values.length < 2;
                },
            },
            showMark: {
                label: localeText.chartConfigurationShowMark,
                type: 'boolean',
                default: type === 'line',
            },
        },
    },
    getChartSection(localeText),
    getAxesSection(localeText, false),
    getTooltipSection(localeText),
    getLegendSection(localeText),
]; };
var getLocalizedConfigurationOptions = function (locale) {
    var localeText = __assign(__assign({}, locales_1.DEFAULT_LOCALE), (locale !== null && locale !== void 0 ? locale : {}));
    return {
        column: {
            label: localeText.chartTypeColumn,
            icon: icons_1.GridColumnChartIcon,
            customization: getBarColumnCustomization('column', localeText),
        },
        bar: {
            label: localeText.chartTypeBar,
            icon: icons_1.GridBarChartIcon,
            customization: getBarColumnCustomization('bar', localeText),
        },
        line: {
            label: localeText.chartTypeLine,
            icon: icons_1.GridLineChartIcon,
            customization: getLineAreaCustomization('line', localeText),
        },
        area: {
            label: localeText.chartTypeArea,
            icon: icons_1.GridAreaChartIcon,
            customization: getLineAreaCustomization('area', localeText),
        },
        pie: {
            label: localeText.chartTypePie,
            icon: icons_1.GridPieChartIcon,
            maxDimensions: 1,
            customization: [
                {
                    id: 'data',
                    label: localeText.chartConfigurationSectionArcs,
                    controls: {
                        colors: getColorOptions(localeText),
                        seriesGap: {
                            label: localeText.chartConfigurationSeriesGap,
                            type: 'number',
                            default: 10,
                            isDisabled: function (_a) {
                                var values = _a.values;
                                return values.length < 2;
                            },
                            htmlAttributes: {
                                min: '0',
                            },
                        },
                        paddingAngle: {
                            label: localeText.chartConfigurationPaddingAngle,
                            type: 'number',
                            default: 0,
                        },
                        cornerRadius: {
                            label: localeText.chartConfigurationCornerRadius,
                            type: 'number',
                            default: 0,
                        },
                        itemLabel: {
                            label: localeText.chartConfigurationArcLabels,
                            type: 'select',
                            default: 'none',
                            options: [
                                { content: localeText.chartConfigurationOptionNone, value: 'none' },
                                { content: localeText.chartConfigurationOptionValue, value: 'value' },
                            ],
                        },
                    },
                },
                {
                    id: 'chart',
                    label: localeText.chartConfigurationSectionChart,
                    controls: {
                        showToolbar: {
                            label: localeText.chartConfigurationShowToolbar,
                            type: 'boolean',
                            default: false,
                        },
                        innerRadius: {
                            label: localeText.chartConfigurationInnerRadius,
                            type: 'number',
                            default: 50,
                        },
                        outerRadius: {
                            label: localeText.chartConfigurationOuterRadius,
                            type: 'number',
                            default: 150,
                        },
                        startAngle: {
                            label: localeText.chartConfigurationStartAngle,
                            type: 'number',
                            default: 0,
                        },
                        endAngle: {
                            label: localeText.chartConfigurationEndAngle,
                            type: 'number',
                            default: 360,
                        },
                        height: { label: localeText.chartConfigurationHeight, type: 'number', default: 350 },
                        width: { label: localeText.chartConfigurationWidth, type: 'number', default: 350 },
                        skipAnimation: {
                            label: localeText.chartConfigurationSkipAnimation,
                            type: 'boolean',
                            default: false,
                        },
                    },
                },
                {
                    id: 'tooltip',
                    label: localeText.chartConfigurationSectionTooltip,
                    controls: {
                        tooltipPlacement: {
                            label: localeText.chartConfigurationTooltipPlacement,
                            type: 'select',
                            default: 'auto',
                            options: [
                                { content: localeText.chartConfigurationOptionAuto, value: 'auto' },
                                { content: localeText.chartConfigurationOptionTop, value: 'top' },
                                { content: localeText.chartConfigurationOptionBottom, value: 'bottom' },
                                { content: localeText.chartConfigurationOptionLeft, value: 'left' },
                                { content: localeText.chartConfigurationOptionRight, value: 'right' },
                            ],
                        },
                        pieTooltipTrigger: {
                            label: localeText.chartConfigurationPieTooltipTrigger,
                            type: 'select',
                            default: 'item',
                            options: [
                                { content: localeText.chartConfigurationOptionNone, value: 'none' },
                                { content: localeText.chartConfigurationOptionItem, value: 'item' },
                            ],
                        },
                    },
                },
                getLegendSection(localeText, 'vertical', 'pieLegend'),
            ],
        },
    };
};
exports.getLocalizedConfigurationOptions = getLocalizedConfigurationOptions;
exports.configurationOptions = (0, exports.getLocalizedConfigurationOptions)();
