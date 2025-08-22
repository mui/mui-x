import * as React from 'react';
import type {
  GridChartsConfigurationOptions,
  GridChartsConfigurationSection,
} from '@mui/x-internals/types';
import { DEFAULT_LOCALE, ChartsLocaleText } from '@mui/x-charts/locales';
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
    height: { label: localeText.chartConfigurationHeight, type: 'number', default: 350 },
    grid: {
      label: localeText.chartConfigurationGrid,
      type: 'select',
      default: 'none',
      options: [
        { content: localeText.chartConfigurationGridNone, value: 'none' },
        { content: localeText.chartConfigurationGridHorizontal, value: 'horizontal' },
        { content: localeText.chartConfigurationGridVertical, value: 'vertical' },
        { content: localeText.chartConfigurationGridBoth, value: 'both' },
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
  label: 'Axes',
  controls: {
    categoriesAxisLabel: {
      label: 'Categories axis label',
      type: 'string',
      default: '',
    },
    seriesAxisLabel: {
      label: 'Series axis label',
      type: 'string',
      default: '',
    },
    xAxisPosition: {
      label: 'X-axis position',
      type: 'select',
      default: 'bottom',
      options: [
        { content: 'None', value: 'none' },
        { content: 'Bottom', value: 'bottom' },
        { content: 'Top', value: 'top' },
      ],
    },
    yAxisPosition: {
      label: 'Y-axis position',
      type: 'select',
      default: 'left',
      options: [
        { content: 'None', value: 'none' },
        { content: 'Left', value: 'left' },
        { content: 'Right', value: 'right' },
      ],
    },
    ...(tickOptions
      ? {
          tickPlacement: {
            label: localeText.chartConfigurationTickPlacement,
            type: 'select',
            default: 'extremities',
            options: [
              { content: localeText.chartConfigurationTickPlacementEnd, value: 'end' },
              {
                content: localeText.chartConfigurationTickPlacementExtremities,
                value: 'extremities',
              },
              { content: localeText.chartConfigurationTickPlacementMiddle, value: 'middle' },
              { content: localeText.chartConfigurationTickPlacementStart, value: 'start' },
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
              { content: localeText.chartConfigurationTickLabelPlacementMiddle, value: 'middle' },
              { content: localeText.chartConfigurationTickLabelPlacementTick, value: 'tick' },
            ],
          },
        }
      : {}),
    seriesAxisReverse: {
      label: 'Reverse series axis',
      type: 'boolean',
      default: false,
    },
  },
});

const getTooltipSection = (localeText: ChartsLocaleText): GridChartsConfigurationSection => ({
  id: 'tooltip',
  label: 'Tooltip',
  controls: {
    tooltipPlacement: {
      label: 'Placement',
      type: 'select',
      default: 'auto',
      options: [
        { content: 'Auto', value: 'auto' },
        { content: 'Top', value: 'top' },
        { content: 'Bottom', value: 'bottom' },
        { content: 'Left', value: 'left' },
        { content: 'Right', value: 'right' },
      ],
    },
    tooltipTrigger: {
      label: 'Trigger',
      type: 'select',
      default: 'axis',
      options: [
        { content: 'None', value: 'none' },
        { content: 'Axis', value: 'axis' },
        { content: 'Item', value: 'item' },
      ],
    },
  },
});

const getLegendSection = (localeText: ChartsLocaleText): GridChartsConfigurationSection => ({
  id: 'legend',
  label: 'Legend',
  controls: {
    legendPosition: {
      label: 'Position',
      type: 'select',
      default: 'top',
      options: [
        { content: 'None', value: 'none' },
        { content: 'Top', value: 'top' },
        { content: 'Bottom', value: 'bottom' },
        { content: 'Left', value: 'left' },
        { content: 'Right', value: 'right' },
      ],
    },
    legendDirection: {
      label: 'Direction',
      type: 'select',
      default: 'horizontal',
      options: [
        { content: 'Horizontal', value: 'horizontal' },
        { content: 'Vertical', value: 'vertical' },
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
        isDisabled: ({ series }: { series: any[] }) => series.length < 2,
      },
      itemLabel: {
        label: type === 'bar' ? 'Bar labels' : 'Column labels',
        type: 'select',
        default: 'none',
        options: [
          { content: 'None', value: 'none' },
          { content: 'Value', value: 'value' },
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
    label: type === 'line' ? 'Lines' : 'Areas',
    controls: {
      interpolation: {
        label: 'Interpolation',
        type: 'select',
        default: 'monotoneX',
        options: [
          { content: 'Monotone X', value: 'monotoneX' },
          { content: 'Monotone Y', value: 'monotoneY' },
          { content: 'Catmull-Rom', value: 'catmullRom' },
          { content: 'Linear', value: 'linear' },
          { content: 'Natural', value: 'natural' },
          { content: 'Step', value: 'step' },
          { content: 'Step Before', value: 'stepBefore' },
          { content: 'Step After', value: 'stepAfter' },
          { content: 'Bump X', value: 'bumpX' },
          { content: 'Bump Y', value: 'bumpY' },
        ],
      },
      colors: getColorOptions(localeText),
      stacked: {
        label: localeText.chartConfigurationStacked,
        type: 'boolean',
        default: false,
        isDisabled: ({ series }: { series: any[] }) => series.length < 2,
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
      maxCategories: 1,
      customization: [
        {
          id: 'data',
          label: 'Arcs',
          controls: {
            colors: getColorOptions(localeText),
            seriesGap: {
              label: localeText.chartConfigurationSeriesGap,
              type: 'number',
              default: 10,
              isDisabled: ({ series }: { series: any[] }) => series.length < 2,
              htmlAttributes: {
                min: '0',
              },
            },
            paddingAngle: {
              label: 'Padding angle',
              type: 'number',
              default: 0,
            },
            cornerRadius: {
              label: 'Corner radius',
              type: 'number',
              default: 0,
            },
            itemLabel: {
              label: 'Arc labels',
              type: 'select',
              default: 'none',
              options: [
                { content: 'None', value: 'none' },
                { content: 'Value', value: 'value' },
              ],
            },
          },
        },
        {
          id: 'chart',
          label: localeText.chartConfigurationSectionChart,
          controls: {
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
              label: 'Start angle',
              type: 'number',
              default: 0,
            },
            endAngle: {
              label: 'End angle',
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
          label: 'Tooltip',
          controls: {
            tooltipPlacement: {
              label: 'Placement',
              type: 'select',
              default: 'auto',
              options: [
                { content: 'Auto', value: 'auto' },
                { content: 'Top', value: 'top' },
                { content: 'Bottom', value: 'bottom' },
                { content: 'Left', value: 'left' },
                { content: 'Right', value: 'right' },
              ],
            },
            pieTooltipTrigger: {
              label: 'Trigger',
              type: 'select',
              default: 'item',
              options: [
                { content: 'None', value: 'none' },
                { content: 'Item', value: 'item' },
              ],
            },
          },
        },
        {
          id: 'legend',
          label: 'Legend',
          controls: {
            pieLegendPosition: {
              label: 'Position',
              type: 'select',
              default: 'right',
              options: [
                { content: 'None', value: 'none' },
                { content: 'Top', value: 'top' },
                { content: 'Bottom', value: 'bottom' },
                { content: 'Left', value: 'left' },
                { content: 'Right', value: 'right' },
              ],
            },
            pieLegendDirection: {
              label: 'Direction',
              type: 'select',
              default: 'vertical',
              options: [
                { content: 'Horizontal', value: 'horizontal' },
                { content: 'Vertical', value: 'vertical' },
              ],
            },
          },
        },
      ],
    },
  };
};

export const configurationOptions = getLocalizedConfigurationOptions();
