import * as React from 'react';
import { createSvgIcon } from '@mui/material/utils';
import { GridChartsConfigurationOptions } from './types';

export const GridBarChartIcon = createSvgIcon(
  <g>
    <rect height="11" width="4" x="4" y="9" />
    <rect height="7" width="4" x="16" y="13" />
    <rect height="16" width="4" x="10" y="4" />
  </g>,
  'BarChart',
);

export const GridLineChartIcon = createSvgIcon(
  <path d="M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11c-0.18,0-0.36-0.02-0.52-0.07l-4.55,4.56 C4.98,15.65,5,15.82,5,16c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9 c0-1.1,0.9-2,2-2s2,0.9,2,2c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12c0.18,0,0.36,0.02,0.52,0.07 l3.55-3.56C19.02,8.35,19,8.18,19,8c0-1.1,0.9-2,2-2S23,6.9,23,8z" />,
  'LineChart',
);

export const GridPieChartIcon = createSvgIcon(
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm7.93 9H13V4.07c3.61.45 6.48 3.32 6.93 6.93zM4 12c0-4.07 3.06-7.44 7-7.93v15.86c-3.94-.49-7-3.86-7-7.93zm9 7.93V13h6.93c-.45 3.61-3.32 6.48-6.93 6.93z" />,
  'PieChart',
);

const colorOptions = {
  label: 'Color palette',
  type: 'select',
  default: 'default',
  options: [
    { label: 'Default', value: 'default' },
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

export const configurationOptions: GridChartsConfigurationOptions = {
  bar: {
    label: 'Bar',
    icon: GridBarChartIcon,
    customization: [
      {
        id: 'bars',
        label: 'Bars',
        controls: {
          layout: {
            label: 'Layout',
            type: 'select',
            default: 'vertical',
            options: [
              { label: 'Vertical', value: 'vertical' },
              { label: 'Horizontal', value: 'horizontal' },
            ],
          },
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
    ],
  },
  line: {
    label: 'Line',
    icon: GridLineChartIcon,
    customization: [
      {
        id: 'mainSection',
        label: 'Main Section',
        controls: {
          height: { label: 'Height', type: 'number', default: 350 },
          colors: colorOptions,
          hideLegend: { label: 'Hide Legend', type: 'boolean', default: false },
          skipAnimation: { label: 'Skip Animation', type: 'boolean', default: false },
        },
      },
    ],
  },
  pie: {
    label: 'Pie',
    icon: GridPieChartIcon,
    customization: [
      {
        id: 'mainSection',
        label: 'Main Section',
        controls: {
          height: { label: 'Height', type: 'number', default: 350 },
          width: { label: 'Width', type: 'number', default: 350 },
          colors: colorOptions,
          hideLegend: { label: 'Hide Legend', type: 'boolean', default: false },
          outerRadius: { label: 'Outer Radius', type: 'number', default: 120 },
        },
      },
    ],
  },
};
