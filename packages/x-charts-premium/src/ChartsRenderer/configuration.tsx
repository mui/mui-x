import * as React from 'react';
import type {
  GridChartsConfigurationOptions,
  GridChartsConfigurationSection,
} from '@mui/x-internals/types';
import {
  bluePalette,
  cheerfulFiestaPalette,
  cyanPalette,
  greenPalette,
  mangoFusionPalette,
  orangePalette,
  pinkPalette,
  purplePalette,
  rainbowSurgePalette,
  redPalette,
  strawberrySkyPalette,
  yellowPalette,
  blueberryTwilightPalette,
} from '@mui/x-charts/colorPalettes';
import { DEFAULT_LOCALE, ChartsLocaleText } from '@mui/x-charts/locales';
import { PaletteOption } from './components/PaletteOption';

import {
  GridBarChartIcon,
  GridColumnChartIcon,
  GridLineChartIcon,
  GridPieChartIcon,
  GridAreaChartIcon,
} from './icons';

const getColorOptions = (localeText: ChartsLocaleText) => ({
  label: localeText.chartPaletteLabel,
  type: 'select' as const,
  default: 'rainbowSurgePalette',
  options: [
    {
      content: (
        <PaletteOption palette={rainbowSurgePalette}>
          {localeText.chartPaletteNameRainbowSurge}
        </PaletteOption>
      ),
      value: 'rainbowSurgePalette',
    },
    {
      content: (
        <PaletteOption palette={blueberryTwilightPalette}>
          {localeText.chartPaletteNameBlueberryTwilight}
        </PaletteOption>
      ),
      value: 'blueberryTwilightPalette',
    },
    {
      content: (
        <PaletteOption palette={mangoFusionPalette}>
          {localeText.chartPaletteNameMangoFusion}
        </PaletteOption>
      ),
      value: 'mangoFusionPalette',
    },
    {
      content: (
        <PaletteOption palette={cheerfulFiestaPalette}>
          {localeText.chartPaletteNameCheerfulFiesta}
        </PaletteOption>
      ),
      value: 'cheerfulFiestaPalette',
    },
    {
      content: (
        <PaletteOption palette={strawberrySkyPalette}>
          {localeText.chartPaletteNameStrawberrySky}
        </PaletteOption>
      ),
      value: 'strawberrySkyPalette',
    },
    {
      content: (
        <PaletteOption palette={bluePalette}>{localeText.chartPaletteNameBlue}</PaletteOption>
      ),
      value: 'bluePalette',
    },
    {
      content: (
        <PaletteOption palette={greenPalette}>{localeText.chartPaletteNameGreen}</PaletteOption>
      ),
      value: 'greenPalette',
    },
    {
      content: (
        <PaletteOption palette={purplePalette}>{localeText.chartPaletteNamePurple}</PaletteOption>
      ),
      value: 'purplePalette',
    },
    {
      content: <PaletteOption palette={redPalette}>{localeText.chartPaletteNameRed}</PaletteOption>,
      value: 'redPalette',
    },
    {
      content: (
        <PaletteOption palette={orangePalette}>{localeText.chartPaletteNameOrange}</PaletteOption>
      ),
      value: 'orangePalette',
    },
    {
      content: (
        <PaletteOption palette={yellowPalette}>{localeText.chartPaletteNameYellow}</PaletteOption>
      ),
      value: 'yellowPalette',
    },
    {
      content: (
        <PaletteOption palette={cyanPalette}>{localeText.chartPaletteNameCyan}</PaletteOption>
      ),
      value: 'cyanPalette',
    },
    {
      content: (
        <PaletteOption palette={pinkPalette}>{localeText.chartPaletteNamePink}</PaletteOption>
      ),
      value: 'pinkPalette',
    },
  ],
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
      maxCategories: 1, // TODO: remove this when https://github.com/mui/mui-x/pull/18766 is merged
      customization: getBarColumnCustomization('column', localeText),
    },
    bar: {
      label: localeText.chartTypeBar,
      icon: GridBarChartIcon,
      maxCategories: 1, // TODO: remove this when https://github.com/mui/mui-x/pull/18766 is merged
      customization: getBarColumnCustomization('bar', localeText),
    },
    line: {
      label: localeText.chartTypeLine,
      icon: GridLineChartIcon,
      maxCategories: 1, // TODO: remove this when https://github.com/mui/mui-x/pull/18766 is merged
      customization: getLineAreaCustomization('line', localeText),
    },
    area: {
      label: localeText.chartTypeArea,
      icon: GridAreaChartIcon,
      maxCategories: 1, // TODO: remove this when https://github.com/mui/mui-x/pull/18766 is merged
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
