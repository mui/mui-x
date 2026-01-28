import type {
  GridChartsConfiguration,
  GridChartsConfigurationOptions,
  GridChartsConfigurationSection,
} from '@mui/x-internals/types';
import { DEFAULT_LOCALE, type ChartsLocaleText } from '@mui/x-charts/locales';
import { PaletteOption } from './components/PaletteOption';
import { colorPaletteLookup } from './colors';
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
      default: '',
    },
    seriesAxisLabel: {
      label: localeText.chartConfigurationSeriesAxisLabel,
      type: 'string',
      default: '',
    },
    xAxisPosition: {
      label: localeText.chartConfigurationXAxisPosition,
      type: 'select',
      default: 'bottom',
      options: [
        { content: localeText.chartConfigurationOptionNone, value: 'none' },
        { content: localeText.chartConfigurationOptionBottom, value: 'bottom' },
        { content: localeText.chartConfigurationOptionTop, value: 'top' },
      ],
    },
    yAxisPosition: {
      label: localeText.chartConfigurationYAxisPosition,
      type: 'select',
      default: 'left',
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
      : {}),
    ...(tickOptions
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
      : {}),
    seriesAxisReverse: {
      label: localeText.chartConfigurationSeriesAxisReverse,
      type: 'boolean',
      default: false,
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
      isHidden: ({ configuration }: { configuration: GridChartsConfiguration }) =>
        configuration[`${keyPrefix}Direction`] === 'vertical' ||
        (configuration[`${keyPrefix}Direction`] === undefined && defaultDirection === 'vertical'),
    },
    [`${keyPrefix}PositionVertical`]: {
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
  default: 'rainbowSurgePalette',
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
        isDisabled: ({ values }: { values: any[] }) => values.length < 2,
      },
      itemLabel: {
        label:
          type === 'bar'
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
        isDisabled: ({ values }: { values: any[] }) => values.length < 2,
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
              default: 10,
              isDisabled: ({ values }: { values: any[] }) => values.length < 2,
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

export const configurationOptions = getLocalizedConfigurationOptions();
