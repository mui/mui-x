import type {
  GridChartsConfiguration,
  GridChartsConfigurationOptions,
  GridChartsConfigurationSection,
} from '@mui/x-internals/types';
import { DEFAULT_LOCALE, type ChartsLocaleText } from '@mui/x-charts/locales';
import capitalize from '@mui/utils/capitalize';
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

const getLocalizedConfigOptions = (localeText: ChartsLocaleText, keys: Array<string>) =>
  keys.map((key) => ({
    content: localeText[`chartConfigurationOption${capitalize(key)}`],
    value: key,
  }));

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
      default: 'none',
      options: getLocalizedConfigOptions(localeText, ['none', 'horizontal', 'vertical', 'both']),
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
      default: 'bottom',
      options: getLocalizedConfigOptions(localeText, ['none', 'bottom', 'top']),
    },
    yAxisPosition: {
      label: localeText.chartConfigurationYAxisPosition,
      type: 'select',
      default: 'left',
      options: getLocalizedConfigOptions(localeText, ['none', 'left', 'right']),
    },
    ...(tickOptions
      ? {
          tickPlacement: {
            label: localeText.chartConfigurationTickPlacement,
            type: 'select',
            default: 'extremities',
            options: getLocalizedConfigOptions(localeText, [
              'end',
              'extremities',
              'middle',
              'start',
            ]),
          },
        }
      : {}),
    ...(tickOptions
      ? {
          tickLabelPlacement: {
            label: localeText.chartConfigurationTickLabelPlacement,
            type: 'select',
            default: 'middle',
            options: getLocalizedConfigOptions(localeText, ['middle', 'tick']),
          },
        }
      : {}),
    ...(tickOptions
      ? {
          tickLabelPlacement: {
            label: localeText.chartConfigurationTickLabelPlacement,
            type: 'select',
            default: 'middle',
            options: getLocalizedConfigOptions(localeText, ['middle', 'tick']),
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
      default: 'auto',
      options: getLocalizedConfigOptions(localeText, ['auto', 'top', 'bottom', 'left', 'right']),
    },
    tooltipTrigger: {
      label: localeText.chartConfigurationTooltipTrigger,
      type: 'select',
      default: 'axis',
      options: getLocalizedConfigOptions(localeText, ['none', 'axis', 'item']),
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
      options: getLocalizedConfigOptions(localeText, [
        'none',
        'topLeft',
        'top',
        'topRight',
        'bottomLeft',
        'bottom',
        'bottomRight',
      ]),
      isHidden: ({ configuration }: { configuration: GridChartsConfiguration }) =>
        configuration[`${keyPrefix}Direction`] === 'vertical' ||
        (configuration[`${keyPrefix}Direction`] === undefined && defaultDirection === 'vertical'),
    },
    [`${keyPrefix}PositionVertical`]: {
      label: localeText.chartConfigurationLegendPosition,
      type: 'select',
      default: 'right',
      options: getLocalizedConfigOptions(localeText, [
        'none',
        'topLeft',
        'left',
        'bottomLeft',
        'topRight',
        'right',
        'bottomRight',
      ]),

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
        default: 'none',
        options: getLocalizedConfigOptions(localeText, ['none', 'value']),
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
        options: getLocalizedConfigOptions(localeText, [
          'monotoneX',
          'monotoneY',
          'catmullRom',
          'linear',
          'natural',
          'step',
          'stepBefore',
          'stepAfter',
          'bumpX',
          'bumpY',
        ]),
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
              default: 'none',
              options: getLocalizedConfigOptions(localeText, ['none', 'value']),
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
              default: 'auto',
              options: getLocalizedConfigOptions(localeText, [
                'auto',
                'top',
                'bottom',
                'left',
                'right',
              ]),
            },
            pieTooltipTrigger: {
              label: localeText.chartConfigurationPieTooltipTrigger,
              type: 'select',
              default: 'item',
              options: getLocalizedConfigOptions(localeText, ['none', 'item']),
            },
          },
        },
        getLegendSection(localeText, 'vertical', 'pieLegend'),
      ],
    },
  };
};

export const configurationOptions = getLocalizedConfigurationOptions();
