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
  label: localeText.chartConfiguration.section.chart,
  controls: {
    showToolbar: {
      label: localeText.chartConfiguration.showToolbar,
      type: 'boolean',
      default: false,
    },
    height: { label: localeText.chartConfiguration.height, type: 'number', default: 350 },
    grid: {
      label: localeText.chartConfiguration.grid,
      type: 'select',
      default: 'none',
      options: [
        { content: localeText.chartConfiguration.option.none, value: 'none' },
        { content: localeText.chartConfiguration.option.horizontal, value: 'horizontal' },
        { content: localeText.chartConfiguration.option.vertical, value: 'vertical' },
        { content: localeText.chartConfiguration.option.both, value: 'both' },
      ],
    },
    skipAnimation: {
      label: localeText.chartConfiguration.skipAnimation,
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
  label: localeText.chartConfiguration.section.axes,
  controls: {
    categoriesAxisLabel: {
      label: localeText.chartConfiguration.categoriesAxisLabel,
      type: 'string',
      default: '',
    },
    seriesAxisLabel: {
      label: localeText.chartConfiguration.seriesAxisLabel,
      type: 'string',
      default: '',
    },
    xAxisPosition: {
      label: localeText.chartConfiguration.xAxisPosition,
      type: 'select',
      default: 'bottom',
      options: [
        { content: localeText.chartConfiguration.option.none, value: 'none' },
        { content: localeText.chartConfiguration.option.bottom, value: 'bottom' },
        { content: localeText.chartConfiguration.option.top, value: 'top' },
      ],
    },
    yAxisPosition: {
      label: localeText.chartConfiguration.yAxisPosition,
      type: 'select',
      default: 'left',
      options: [
        { content: localeText.chartConfiguration.option.none, value: 'none' },
        { content: localeText.chartConfiguration.option.left, value: 'left' },
        { content: localeText.chartConfiguration.option.right, value: 'right' },
      ],
    },
    ...(tickOptions
      ? {
          tickPlacement: {
            label: localeText.chartConfiguration.tickPlacement,
            type: 'select',
            default: 'extremities',
            options: [
              { content: localeText.chartConfiguration.option.end, value: 'end' },
              {
                content: localeText.chartConfiguration.option.extremities,
                value: 'extremities',
              },
              { content: localeText.chartConfiguration.option.middle, value: 'middle' },
              { content: localeText.chartConfiguration.option.start, value: 'start' },
            ],
          },
        }
      : {}),
    ...(tickOptions
      ? {
          tickLabelPlacement: {
            label: localeText.chartConfiguration.tickLabelPlacement,
            type: 'select',
            default: 'middle',
            options: [
              { content: localeText.chartConfiguration.option.middle, value: 'middle' },
              { content: localeText.chartConfiguration.option.tick, value: 'tick' },
            ],
          },
        }
      : {}),
    seriesAxisReverse: {
      label: localeText.chartConfiguration.axisReverse,
      type: 'boolean',
      default: false,
    },
  },
});

const getTooltipSection = (localeText: ChartsLocaleText): GridChartsConfigurationSection => ({
  id: 'tooltip',
  label: localeText.chartConfiguration.sectionTooltip,
  controls: {
    tooltipPlacement: {
      label: localeText.chartConfiguration.tooltipPlacement,
      type: 'select',
      default: 'auto',
      options: [
        { content: localeText.chartConfiguration.option.auto, value: 'auto' },
        { content: localeText.chartConfiguration.option.top, value: 'top' },
        { content: localeText.chartConfiguration.option.bottom, value: 'bottom' },
        { content: localeText.chartConfiguration.option.left, value: 'left' },
        { content: localeText.chartConfiguration.option.right, value: 'right' },
      ],
    },
    tooltipTrigger: {
      label: localeText.chartConfiguration.tooltipTrigger,
      type: 'select',
      default: 'axis',
      options: [
        { content: localeText.chartConfiguration.option.none, value: 'none' },
        { content: localeText.chartConfiguration.option.axis, value: 'axis' },
        { content: localeText.chartConfiguration.option.item, value: 'item' },
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
  label: localeText.chartConfiguration.sectionLegend,
  controls: {
    [`${keyPrefix}PositionHorizontal`]: {
      label: localeText.chartConfiguration.legendPosition,
      type: 'select',
      default: 'top',
      options: [
        { content: localeText.chartConfiguration.option.none, value: 'none' },
        { content: localeText.chartConfiguration.option.topLeft, value: 'topLeft' },
        { content: localeText.chartConfiguration.option.top, value: 'top' },
        { content: localeText.chartConfiguration.option.topRight, value: 'topRight' },
        { content: localeText.chartConfiguration.option.bottomLeft, value: 'bottomLeft' },
        { content: localeText.chartConfiguration.option.bottom, value: 'bottom' },
        { content: localeText.chartConfiguration.option.bottomRight, value: 'bottomRight' },
      ],
      isHidden: ({ configuration }: { configuration: GridChartsConfiguration }) =>
        configuration[`${keyPrefix}Direction`] === 'vertical' ||
        (configuration[`${keyPrefix}Direction`] === undefined && defaultDirection === 'vertical'),
    },
    [`${keyPrefix}PositionVertical`]: {
      label: localeText.chartConfiguration.legendPosition,
      type: 'select',
      default: 'right',
      options: [
        { content: localeText.chartConfiguration.option.none, value: 'none' },
        { content: localeText.chartConfiguration.option.topLeft, value: 'topLeft' },
        { content: localeText.chartConfiguration.option.left, value: 'left' },
        { content: localeText.chartConfiguration.option.bottomLeft, value: 'bottomLeft' },
        { content: localeText.chartConfiguration.option.topRight, value: 'topRight' },
        { content: localeText.chartConfiguration.option.right, value: 'right' },
        { content: localeText.chartConfiguration.option.bottomRight, value: 'bottomRight' },
      ],
      isHidden: ({ configuration }: { configuration: GridChartsConfiguration }) =>
        configuration[`${keyPrefix}Direction`] === 'horizontal' ||
        (configuration[`${keyPrefix}Direction`] === undefined && defaultDirection === 'horizontal'),
    },
    [`${keyPrefix}Direction`]: {
      label: localeText.chartConfiguration.legendDirection,
      type: 'select',
      default: defaultDirection,
      options: [
        { content: localeText.chartConfiguration.option.horizontal, value: 'horizontal' },
        { content: localeText.chartConfiguration.option.vertical, value: 'vertical' },
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
        ? localeText.chartConfiguration.section.bars
        : localeText.chartConfiguration.section.columns,
    controls: {
      borderRadius: {
        label: localeText.chartConfiguration.borderRadius,
        type: 'number',
        default: 0,
      },
      colors: getColorOptions(localeText),
      categoryGapRatio: {
        label: localeText.chartConfiguration.categoryGapRatio,
        type: 'number',
        default: 0.2,
        htmlAttributes: {
          min: '0',
          max: '1',
          step: '0.1',
        },
      },
      barGapRatio: {
        label: localeText.chartConfiguration.barGapRatio,
        type: 'number',
        default: 0.1,
        htmlAttributes: {
          min: '0',
          max: '1',
          step: '0.1',
        },
      },
      stacked: {
        label: localeText.chartConfiguration.stacked,
        type: 'boolean',
        default: false,
        isDisabled: ({ values }: { values: any[] }) => values.length < 2,
      },
      itemLabel: {
        label:
          type === 'bar'
            ? localeText.chartConfiguration.barLabels
            : localeText.chartConfiguration.columnLabels,
        type: 'select',
        default: 'none',
        options: [
          { content: localeText.chartConfiguration.option.none, value: 'none' },
          { content: localeText.chartConfiguration.option.value, value: 'value' },
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
        ? localeText.chartConfiguration.sectionLines
        : localeText.chartConfiguration.sectionAreas,
    controls: {
      interpolation: {
        label: localeText.chartConfiguration.interpolation,
        type: 'select',
        default: 'monotoneX',
        options: [
          { content: localeText.chartConfiguration.option.monotoneX, value: 'monotoneX' },
          { content: localeText.chartConfiguration.option.monotoneY, value: 'monotoneY' },
          { content: localeText.chartConfiguration.option.catmullRom, value: 'catmullRom' },
          { content: localeText.chartConfiguration.option.linear, value: 'linear' },
          { content: localeText.chartConfiguration.option.natural, value: 'natural' },
          { content: localeText.chartConfiguration.option.step, value: 'step' },
          { content: localeText.chartConfiguration.option.stepBefore, value: 'stepBefore' },
          { content: localeText.chartConfiguration.option.stepAfter, value: 'stepAfter' },
          { content: localeText.chartConfiguration.option.bumpX, value: 'bumpX' },
          { content: localeText.chartConfiguration.option.bumpY, value: 'bumpY' },
        ],
      },
      colors: getColorOptions(localeText),
      stacked: {
        label: localeText.chartConfiguration.stacked,
        type: 'boolean',
        default: false,
        isDisabled: ({ values }: { values: any[] }) => values.length < 2,
      },
      showMark: {
        label: localeText.chartConfiguration.showMark,
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
          label: localeText.chartConfiguration.sectionArcs,
          controls: {
            colors: getColorOptions(localeText),
            seriesGap: {
              label: localeText.chartConfiguration.seriesGap,
              type: 'number',
              default: 10,
              isDisabled: ({ values }: { values: any[] }) => values.length < 2,
              htmlAttributes: {
                min: '0',
              },
            },
            paddingAngle: {
              label: localeText.chartConfiguration.paddingAngle,
              type: 'number',
              default: 0,
            },
            cornerRadius: {
              label: localeText.chartConfiguration.cornerRadius,
              type: 'number',
              default: 0,
            },
            itemLabel: {
              label: localeText.chartConfiguration.arcLabels,
              type: 'select',
              default: 'none',
              options: [
                { content: localeText.chartConfiguration.option.none, value: 'none' },
                { content: localeText.chartConfiguration.option.value, value: 'value' },
              ],
            },
          },
        },
        {
          id: 'chart',
          label: localeText.chartConfiguration.section.chart,
          controls: {
            showToolbar: {
              label: localeText.chartConfiguration.showToolbar,
              type: 'boolean',
              default: false,
            },
            innerRadius: {
              label: localeText.chartConfiguration.innerRadius,
              type: 'number',
              default: 50,
            },
            outerRadius: {
              label: localeText.chartConfiguration.outerRadius,
              type: 'number',
              default: 150,
            },
            startAngle: {
              label: localeText.chartConfiguration.startAngle,
              type: 'number',
              default: 0,
            },
            endAngle: {
              label: localeText.chartConfiguration.endAngle,
              type: 'number',
              default: 360,
            },
            height: { label: localeText.chartConfiguration.height, type: 'number', default: 350 },
            width: { label: localeText.chartConfiguration.width, type: 'number', default: 350 },
            skipAnimation: {
              label: localeText.chartConfiguration.skipAnimation,
              type: 'boolean',
              default: false,
            },
          },
        },
        {
          id: 'tooltip',
          label: localeText.chartConfiguration.sectionTooltip,
          controls: {
            tooltipPlacement: {
              label: localeText.chartConfiguration.tooltipPlacement,
              type: 'select',
              default: 'auto',
              options: [
                { content: localeText.chartConfiguration.option.auto, value: 'auto' },
                { content: localeText.chartConfiguration.option.top, value: 'top' },
                { content: localeText.chartConfiguration.option.bottom, value: 'bottom' },
                { content: localeText.chartConfiguration.option.left, value: 'left' },
                { content: localeText.chartConfiguration.option.right, value: 'right' },
              ],
            },
            pieTooltipTrigger: {
              label: localeText.chartConfiguration.pieTooltipTrigger,
              type: 'select',
              default: 'item',
              options: [
                { content: localeText.chartConfiguration.option.none, value: 'none' },
                { content: localeText.chartConfiguration.option.item, value: 'item' },
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
