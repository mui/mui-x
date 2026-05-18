import type {
  GridChartsConfiguration,
  GridChartsConfigurationOptions,
  GridChartsConfigurationSection,
} from '@mui/x-internals/types';
import { DEFAULT_LOCALE, type ChartsLocaleText } from '@mui/x-charts/locales';
import { PaletteOption } from './components/PaletteOption';
import { colorPaletteLookup } from './colors';
import { chartDefaults } from './defaults';
import {
  GridBarChartIcon,
  GridColumnChartIcon,
  GridLineChartIcon,
  GridPieChartIcon,
  GridAreaChartIcon,
} from './icons';

const getChartSection = (localeText: ChartsLocaleText): GridChartsConfigurationSection => ({
  id: 'chart',
  label: localeText.chartConfigurationSectionChart,
  controls: {
    showToolbar: {
      label: localeText.chartConfigurationShowToolbar,
      type: 'boolean',
      default: chartDefaults.column.showToolbar,
    },
    height: {
      label: localeText.chartConfigurationHeight,
      type: 'number',
      default: chartDefaults.column.height,
    },
    grid: {
      label: localeText.chartConfigurationGrid,
      type: 'select',
      default: chartDefaults.column.grid,
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
      default: chartDefaults.column.skipAnimation,
    },
  },
});

const getAxesSection = (
  localeText: ChartsLocaleText,
  tickOptions = true,
): GridChartsConfigurationSection => ({
  id: 'axes',
  label: localeText.chartConfigurationSectionAxes,
  controls: {
    categoriesAxisLabel: {
      label: localeText.chartConfigurationCategoriesAxisLabel,
      type: 'string',
      default: chartDefaults.column.categoriesAxisLabel,
    },
    seriesAxisLabel: {
      label: localeText.chartConfigurationSeriesAxisLabel,
      type: 'string',
      default: chartDefaults.column.seriesAxisLabel,
    },
    xAxisPosition: {
      label: localeText.chartConfigurationXAxisPosition,
      type: 'select',
      default: chartDefaults.column.xAxisPosition,
      options: [
        { content: localeText.chartConfigurationOptionNone, value: 'none' },
        { content: localeText.chartConfigurationOptionBottom, value: 'bottom' },
        { content: localeText.chartConfigurationOptionTop, value: 'top' },
      ],
    },
    yAxisPosition: {
      label: localeText.chartConfigurationYAxisPosition,
      type: 'select',
      default: chartDefaults.column.yAxisPosition,
      options: [
        { content: localeText.chartConfigurationOptionNone, value: 'none' },
        { content: localeText.chartConfigurationOptionLeft, value: 'left' },
        { content: localeText.chartConfigurationOptionRight, value: 'right' },
      ],
    },
    ...(tickOptions
      ? {
          tickPlacement: {
            label: localeText.chartConfigurationTickPlacement,
            type: 'select',
            default: chartDefaults.column.tickPlacement,
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
      : {}),
    ...(tickOptions
      ? {
          tickLabelPlacement: {
            label: localeText.chartConfigurationTickLabelPlacement,
            type: 'select',
            default: chartDefaults.column.tickLabelPlacement,
            options: [
              { content: localeText.chartConfigurationOptionMiddle, value: 'middle' },
              { content: localeText.chartConfigurationOptionTick, value: 'tick' },
            ],
          },
        }
      : {}),
    seriesAxisReverse: {
      label: localeText.chartConfigurationSeriesAxisReverse,
      type: 'boolean',
      default: chartDefaults.column.seriesAxisReverse,
    },
  },
});

const getTooltipSection = (localeText: ChartsLocaleText): GridChartsConfigurationSection => ({
  id: 'tooltip',
  label: localeText.chartConfigurationSectionTooltip,
  controls: {
    tooltipPlacement: {
      label: localeText.chartConfigurationTooltipPlacement,
      type: 'select',
      default: chartDefaults.column.tooltipPlacement,
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
      default: chartDefaults.column.tooltipTrigger,
      options: [
        { content: localeText.chartConfigurationOptionNone, value: 'none' },
        { content: localeText.chartConfigurationOptionAxis, value: 'axis' },
        { content: localeText.chartConfigurationOptionItem, value: 'item' },
      ],
    },
  },
});

const getLegendSection = (
  localeText: ChartsLocaleText,
  defaultDirection: 'horizontal' | 'vertical' = 'horizontal',
  keyPrefix: string = 'legend',
): GridChartsConfigurationSection => ({
  id: 'legend',
  label: localeText.chartConfigurationSectionLegend,
  controls: {
    [`${keyPrefix}PositionHorizontal`]: {
      label: localeText.chartConfigurationLegendPosition,
      type: 'select',
      default: chartDefaults.column.legendPositionHorizontal,
      options: [
        { content: localeText.chartConfigurationOptionNone, value: 'none' },
        { content: localeText.chartConfigurationOptionTopLeft, value: 'topLeft' },
        { content: localeText.chartConfigurationOptionTop, value: 'top' },
        { content: localeText.chartConfigurationOptionTopRight, value: 'topRight' },
        { content: localeText.chartConfigurationOptionBottomLeft, value: 'bottomLeft' },
        { content: localeText.chartConfigurationOptionBottom, value: 'bottom' },
        { content: localeText.chartConfigurationOptionBottomRight, value: 'bottomRight' },
      ],
      isHidden: ({ configuration }: { configuration: GridChartsConfiguration }) =>
        configuration[`${keyPrefix}Direction`] === 'vertical' ||
        (configuration[`${keyPrefix}Direction`] === undefined && defaultDirection === 'vertical'),
    },
    [`${keyPrefix}PositionVertical`]: {
      label: localeText.chartConfigurationLegendPosition,
      type: 'select',
      default: chartDefaults.column.legendPositionVertical,
      options: [
        { content: localeText.chartConfigurationOptionNone, value: 'none' },
        { content: localeText.chartConfigurationOptionTopLeft, value: 'topLeft' },
        { content: localeText.chartConfigurationOptionLeft, value: 'left' },
        { content: localeText.chartConfigurationOptionBottomLeft, value: 'bottomLeft' },
        { content: localeText.chartConfigurationOptionTopRight, value: 'topRight' },
        { content: localeText.chartConfigurationOptionRight, value: 'right' },
        { content: localeText.chartConfigurationOptionBottomRight, value: 'bottomRight' },
      ],
      isHidden: ({ configuration }: { configuration: GridChartsConfiguration }) =>
        configuration[`${keyPrefix}Direction`] === 'horizontal' ||
        (configuration[`${keyPrefix}Direction`] === undefined && defaultDirection === 'horizontal'),
    },
    [`${keyPrefix}Direction`]: {
      label: localeText.chartConfigurationLegendDirection,
      type: 'select',
      default: defaultDirection,
      options: [
        { content: localeText.chartConfigurationOptionHorizontal, value: 'horizontal' },
        { content: localeText.chartConfigurationOptionVertical, value: 'vertical' },
      ],
    },
  },
});

const getColors = (localeText: ChartsLocaleText) => [
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
];

const getColorOptions = (localeText: ChartsLocaleText) => ({
  label: localeText.chartPaletteLabel,
  type: 'select' as const,
  default: chartDefaults.column.colors,
  options: getColors(localeText).map(({ key, name }) => ({
    value: key,
    content: <PaletteOption palette={colorPaletteLookup.get(key)!}>{name}</PaletteOption>,
  })),
});

const getBarColumnCustomization = (
  type: 'bar' | 'column',
  localeText: ChartsLocaleText,
): GridChartsConfigurationSection[] => [
  {
    id: 'data',
    label:
      type === 'bar'
        ? localeText.chartConfigurationSectionBars
        : localeText.chartConfigurationSectionColumns,
    controls: {
      borderRadius: {
        label: localeText.chartConfigurationBorderRadius,
        type: 'number',
        default: chartDefaults[type].borderRadius,
      },
      colors: getColorOptions(localeText),
      categoryGapRatio: {
        label: localeText.chartConfigurationCategoryGapRatio,
        type: 'number',
        default: chartDefaults[type].categoryGapRatio,
        htmlAttributes: {
          min: '0',
          max: '1',
          step: '0.1',
        },
      },
      barGapRatio: {
        label: localeText.chartConfigurationBarGapRatio,
        type: 'number',
        default: chartDefaults[type].barGapRatio,
        htmlAttributes: {
          min: '0',
          max: '1',
          step: '0.1',
        },
      },
      stacked: {
        label: localeText.chartConfigurationStacked,
        type: 'boolean',
        default: chartDefaults[type].stacked,
        isDisabled: ({ values }: { values: any[] }) => values.length < 2,
      },
      itemLabel: {
        label:
          type === 'bar'
            ? localeText.chartConfigurationBarLabels
            : localeText.chartConfigurationColumnLabels,
        type: 'select',
        default: chartDefaults[type].itemLabel,
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
];

const getLineAreaCustomization = (
  type: 'line' | 'area',
  localeText: ChartsLocaleText,
): GridChartsConfigurationSection[] => [
  {
    id: 'data',
    label:
      type === 'line'
        ? localeText.chartConfigurationSectionLines
        : localeText.chartConfigurationSectionAreas,
    controls: {
      interpolation: {
        label: localeText.chartConfigurationInterpolation,
        type: 'select',
        default: chartDefaults[type].interpolation,
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
        default: chartDefaults[type].stacked,
        isDisabled: ({ values }: { values: any[] }) => values.length < 2,
      },
      showMark: {
        label: localeText.chartConfigurationShowMark,
        type: 'boolean',
        default: chartDefaults[type].showMark,
      },
    },
  },
  getChartSection(localeText),
  getAxesSection(localeText, false),
  getTooltipSection(localeText),
  getLegendSection(localeText),
];

export const getLocalizedConfigurationOptions = (
  locale?: Partial<ChartsLocaleText>,
): GridChartsConfigurationOptions => {
  const localeText: ChartsLocaleText = {
    ...DEFAULT_LOCALE,
    ...(locale ?? {}),
  };

  return {
    column: {
      label: localeText.chartTypeColumn,
      icon: GridColumnChartIcon,
      customization: getBarColumnCustomization('column', localeText),
    },
    bar: {
      label: localeText.chartTypeBar,
      icon: GridBarChartIcon,
      customization: getBarColumnCustomization('bar', localeText),
    },
    line: {
      label: localeText.chartTypeLine,
      icon: GridLineChartIcon,
      customization: getLineAreaCustomization('line', localeText),
    },
    area: {
      label: localeText.chartTypeArea,
      icon: GridAreaChartIcon,
      customization: getLineAreaCustomization('area', localeText),
    },
    pie: {
      label: localeText.chartTypePie,
      icon: GridPieChartIcon,
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
              default: chartDefaults.pie.seriesGap,
              isDisabled: ({ values }: { values: any[] }) => values.length < 2,
              htmlAttributes: {
                min: '0',
              },
            },
            paddingAngle: {
              label: localeText.chartConfigurationPaddingAngle,
              type: 'number',
              default: chartDefaults.pie.paddingAngle,
            },
            cornerRadius: {
              label: localeText.chartConfigurationCornerRadius,
              type: 'number',
              default: chartDefaults.pie.cornerRadius,
            },
            itemLabel: {
              label: localeText.chartConfigurationArcLabels,
              type: 'select',
              default: chartDefaults.pie.itemLabel,
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
              default: chartDefaults.pie.showToolbar,
            },
            innerRadius: {
              label: localeText.chartConfigurationInnerRadius,
              type: 'number',
              default: chartDefaults.pie.innerRadius,
            },
            outerRadius: {
              label: localeText.chartConfigurationOuterRadius,
              type: 'number',
              default: chartDefaults.pie.outerRadius,
            },
            startAngle: {
              label: localeText.chartConfigurationStartAngle,
              type: 'number',
              default: chartDefaults.pie.startAngle,
            },
            endAngle: {
              label: localeText.chartConfigurationEndAngle,
              type: 'number',
              default: chartDefaults.pie.endAngle,
            },
            height: {
              label: localeText.chartConfigurationHeight,
              type: 'number',
              default: chartDefaults.pie.height,
            },
            width: {
              label: localeText.chartConfigurationWidth,
              type: 'number',
              default: chartDefaults.pie.width,
            },
            skipAnimation: {
              label: localeText.chartConfigurationSkipAnimation,
              type: 'boolean',
              default: chartDefaults.pie.skipAnimation,
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
              default: chartDefaults.pie.tooltipPlacement,
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
              default: chartDefaults.pie.pieTooltipTrigger,
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

export const configurationOptions = getLocalizedConfigurationOptions();
