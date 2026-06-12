import type {
  GridChartsConfiguration,
  GridChartsConfigurationOptions,
  GridChartsConfigurationSection,
} from '@mui/x-internals/types';
import { DEFAULT_LOCALE, type ChartsLocaleText } from '@mui/x-charts/locales';
import capitalize from '@mui/utils/capitalize';
import { PaletteOption } from './components/PaletteOption';
import { colorPaletteLookup } from './colors';
import {
  GridBarChartIcon,
  GridColumnChartIcon,
  GridLineChartIcon,
  GridPieChartIcon,
  GridAreaChartIcon,
} from './icons';

const getLocalizedConfigOptions = (localeText: ChartsLocaleText, keys: Array<string>) =>
  keys.map((key) => ({
    content: localeText[
      `chartConfigurationOption${capitalize(key)}` as keyof ChartsLocaleText
    ] as string,
    value: key,
  }));

const getChartSection = (localeText: ChartsLocaleText): GridChartsConfigurationSection => ({
  id: 'chart',
  label: localeText.chartConfigurationSectionChart,
  controls: {
    showToolbar: {
      label: localeText.chartConfigurationShowToolbar,
      type: 'boolean',
      default: false,
    },
    height: {
      label: localeText.chartConfigurationHeight,
      type: 'number',
      default: 350,
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
      options: getLocalizedConfigOptions(localeText, ['horizontal', 'vertical']),
    },
  },
});

const getColorOptions = (localeText: ChartsLocaleText) => ({
  label: localeText.chartPaletteLabel,
  type: 'select' as const,
  default: 'rainbowSurgePalette',
  options: Array.from(colorPaletteLookup.entries()).map(([key, palette]) => ({
    value: key,
    content: (
      <PaletteOption palette={palette}>
        {
          localeText[
            `chartPaletteName${capitalize(key.replace(/Palette$/, ''))}` as keyof ChartsLocaleText
          ] as string
        }
      </PaletteOption>
    ),
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
            height: {
              label: localeText.chartConfigurationHeight,
              type: 'number',
              default: 350,
            },
            width: {
              label: localeText.chartConfigurationWidth,
              type: 'number',
              default: 350,
            },
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
