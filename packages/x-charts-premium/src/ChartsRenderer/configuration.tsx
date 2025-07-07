import * as React from 'react';
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
} from '@mui/x-charts/colorPalettes';
import { PaletteOption } from './components/PaletteOption';
import type { GridChartsConfigurationOptions, GridChartsConfigurationSection } from './types';
import {
  GridBarChartIcon,
  GridColumnChartIcon,
  GridLineChartIcon,
  GridPieChartIcon,
  GridAreaChartIcon,
} from './icons';

const colorOptions = {
  label: 'Color palette',
  type: 'select' as const,
  default: 'rainbowSurgePalette',
  options: [
    {
      content: 'Blueberry Twilight',
      value: 'blueberryTwilightPalette',
    },
    {
      content: <PaletteOption palette={mangoFusionPalette}>Mango Fusion</PaletteOption>,
      value: 'mangoFusionPalette',
    },
    {
      content: <PaletteOption palette={cheerfulFiestaPalette}>Cheerful Fiesta</PaletteOption>,
      value: 'cheerfulFiestaPalette',
    },
    {
      content: <PaletteOption palette={strawberrySkyPalette}>Strawberry Sky</PaletteOption>,
      value: 'strawberrySkyPalette',
    },
    {
      content: <PaletteOption palette={rainbowSurgePalette}>Rainbow Surge</PaletteOption>,
      value: 'rainbowSurgePalette',
    },
    { content: <PaletteOption palette={bluePalette}>Blue</PaletteOption>, value: 'bluePalette' },
    { content: <PaletteOption palette={greenPalette}>Green</PaletteOption>, value: 'greenPalette' },
    {
      content: <PaletteOption palette={purplePalette}>Purple</PaletteOption>,
      value: 'purplePalette',
    },
    { content: <PaletteOption palette={redPalette}>Red</PaletteOption>, value: 'redPalette' },
    {
      content: <PaletteOption palette={orangePalette}>Orange</PaletteOption>,
      value: 'orangePalette',
    },
    {
      content: <PaletteOption palette={yellowPalette}>Yellow</PaletteOption>,
      value: 'yellowPalette',
    },
    { content: <PaletteOption palette={cyanPalette}>Cyan</PaletteOption>, value: 'cyanPalette' },
    { content: <PaletteOption palette={pinkPalette}>Pink</PaletteOption>, value: 'pinkPalette' },
  ],
};

const getBarColumnCustomization = (type: 'bar' | 'column'): GridChartsConfigurationSection[] => [
  {
    id: type,
    label: `${type.charAt(0).toUpperCase() + type.slice(1)}s`,
    controls: {
      borderRadius: {
        label: 'Border radius',
        type: 'number',
        default: 0,
      },
      colors: colorOptions,
      categoryGapRatio: {
        label: 'Category gap ratio',
        type: 'number',
        default: 0.2,
        htmlAttributes: {
          min: '0',
          max: '1',
          step: '0.1',
        },
      },
      barGapRatio: {
        label: 'Series gap ratio',
        type: 'number',
        default: 0.1,
        htmlAttributes: {
          min: '0',
          max: '1',
          step: '0.1',
        },
      },
      stacked: {
        label: 'Stacked',
        type: 'boolean',
        default: false,
        isDisabled: ({ series }: { series: any[] }) => series.length < 2,
      },
    },
  },
  {
    id: 'chart',
    label: 'Chart',
    controls: {
      height: { label: 'Height', type: 'number', default: 350 },
      grid: {
        label: 'Grid',
        type: 'select',
        default: 'none',
        options: [
          { content: 'None', value: 'none' },
          { content: 'Horizontal', value: 'horizontal' },
          { content: 'Vertical', value: 'vertical' },
          { content: 'Both', value: 'both' },
        ],
      },
      tickPlacement: {
        label: 'Tick placement',
        type: 'select',
        default: 'extremities',
        options: [
          { content: 'End', value: 'end' },
          { content: 'Extremities', value: 'extremities' },
          { content: 'Middle', value: 'middle' },
          { content: 'Start', value: 'start' },
        ],
      },
      tickLabelPlacement: {
        label: 'Tick label placement',
        type: 'select',
        default: 'middle',
        options: [
          { content: 'Middle', value: 'middle' },
          { content: 'Tick', value: 'tick' },
        ],
      },
      hideLegend: { label: 'Hide Legend', type: 'boolean', default: false },
      skipAnimation: { label: 'Skip Animation', type: 'boolean', default: false },
    },
  },
];

const getLineAreaCustomization = (_: 'line' | 'area'): GridChartsConfigurationSection[] => [
  {
    id: 'mainSection',
    label: 'Main Section',
    controls: {
      height: { label: 'Height', type: 'number', default: 350 },
      colors: colorOptions,
      stacked: {
        label: 'Stacked',
        type: 'boolean',
        default: false,
        isDisabled: ({ series }: { series: any[] }) => series.length < 2,
      },
      hideLegend: { label: 'Hide Legend', type: 'boolean', default: false },
      skipAnimation: { label: 'Skip Animation', type: 'boolean', default: false },
    },
  },
];

export const configurationOptions: GridChartsConfigurationOptions = {
  column: {
    label: 'Column',
    icon: GridColumnChartIcon,
    customization: getBarColumnCustomization('column'),
  },
  bar: {
    label: 'Bar',
    icon: GridBarChartIcon,
    customization: getBarColumnCustomization('bar'),
  },
  line: {
    label: 'Line',
    icon: GridLineChartIcon,
    customization: getLineAreaCustomization('line'),
  },
  area: {
    label: 'Area',
    icon: GridAreaChartIcon,
    customization: getLineAreaCustomization('area'),
  },
  pie: {
    label: 'Pie',
    icon: GridPieChartIcon,
    maxCategories: 1,
    customization: [
      {
        id: 'mainSection',
        label: 'Main Section',
        controls: {
          innerRadius: { label: 'Inner Radius', type: 'number', default: 50 },
          outerRadius: { label: 'Outer Radius', type: 'number', default: 150 },
          colors: colorOptions,
          hideLegend: { label: 'Hide Legend', type: 'boolean', default: false },
          height: { label: 'Height', type: 'number', default: 350 },
          width: { label: 'Width', type: 'number', default: 350 },
          seriesGap: {
            label: 'Series gap',
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
