import { GridChartsConfigurationOptions, GridChartsConfigurationSection } from './types';
import {
  GridBarChartIcon,
  GridColumnChartIcon,
  GridLineChartIcon,
  GridPieChartIcon,
  GridAreaChartIcon,
} from './icons';

const colorOptions = {
  label: 'Color palette',
  type: 'select',
  default: 'rainbowSurgePalette',
  options: [
    { label: 'Blueberry Twilight', value: 'blueberryTwilightPalette' },
    { label: 'Mango Fusion', value: 'mangoFusionPalette' },
    { label: 'Cheerful Fiesta', value: 'cheerfulFiestaPalette' },
    { label: 'Strawberry Sky', value: 'strawberrySkyPalette' },
    { label: 'Rainbow Surge', value: 'rainbowSurgePalette' },
    { label: 'Blue', value: 'bluePalette' },
    { label: 'Green', value: 'greenPalette' },
    { label: 'Purple', value: 'purplePalette' },
    { label: 'Red', value: 'redPalette' },
    { label: 'Orange', value: 'orangePalette' },
    { label: 'Yellow', value: 'yellowPalette' },
    { label: 'Cyan', value: 'cyanPalette' },
    { label: 'Pink', value: 'pinkPalette' },
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
          { label: 'None', value: 'none' },
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
          { label: 'Both', value: 'both' },
        ],
      },
      tickPlacement: {
        label: 'Tick placement',
        type: 'select',
        default: 'extremities',
        options: [
          { label: 'End', value: 'end' },
          { label: 'Extremities', value: 'extremities' },
          { label: 'Middle', value: 'middle' },
          { label: 'Start', value: 'start' },
        ],
      },
      tickLabelPlacement: {
        label: 'Tick label placement',
        type: 'select',
        default: 'middle',
        options: [
          { label: 'Middle', value: 'middle' },
          { label: 'Tick', value: 'tick' },
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
