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
    id: type,
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
    },
  },
  {
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
      tickPlacement: {
        label: localeText.chartConfigurationTickPlacement,
        type: 'select',
        default: 'extremities',
        options: [
          { content: localeText.chartConfigurationTickPlacementEnd, value: 'end' },
          { content: localeText.chartConfigurationTickPlacementExtremities, value: 'extremities' },
          { content: localeText.chartConfigurationTickPlacementMiddle, value: 'middle' },
          { content: localeText.chartConfigurationTickPlacementStart, value: 'start' },
        ],
      },
      tickLabelPlacement: {
        label: localeText.chartConfigurationTickLabelPlacement,
        type: 'select',
        default: 'middle',
        options: [
          { content: localeText.chartConfigurationTickLabelPlacementMiddle, value: 'middle' },
          { content: localeText.chartConfigurationTickLabelPlacementTick, value: 'tick' },
        ],
      },
      hideLegend: {
        label: localeText.chartConfigurationHideLegend,
        type: 'boolean',
        default: false,
      },
      skipAnimation: {
        label: localeText.chartConfigurationSkipAnimation,
        type: 'boolean',
        default: false,
      },
    },
  },
];

const getLineAreaCustomization = (
  type: 'line' | 'area',
  localeText: ChartsLocaleText,
): GridChartsConfigurationSection[] => [
  {
    id: 'mainSection',
    label: localeText.chartConfigurationSectionMain,
    controls: {
      height: { label: localeText.chartConfigurationHeight, type: 'number', default: 350 },
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
      hideLegend: {
        label: localeText.chartConfigurationHideLegend,
        type: 'boolean',
        default: false,
      },
      skipAnimation: {
        label: localeText.chartConfigurationSkipAnimation,
        type: 'boolean',
        default: false,
      },
    },
  },
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
          id: 'mainSection',
          label: localeText.chartConfigurationSectionMain,
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
            colors: getColorOptions(localeText),
            hideLegend: {
              label: localeText.chartConfigurationHideLegend,
              type: 'boolean',
              default: false,
            },
            height: { label: localeText.chartConfigurationHeight, type: 'number', default: 350 },
            width: { label: localeText.chartConfigurationWidth, type: 'number', default: 350 },
            seriesGap: {
              label: localeText.chartConfigurationSeriesGap,
              type: 'number',
              default: 10,
              isDisabled: ({ series }: { series: any[] }) => series.length < 2,
              htmlAttributes: {
                min: '0',
              },
            },
          },
        },
      ],
    },
  };
};

export const configurationOptions = getLocalizedConfigurationOptions();
