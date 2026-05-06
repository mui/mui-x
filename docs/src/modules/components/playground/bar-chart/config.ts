import { type BarChartProProps } from '@mui/x-charts-pro/BarChartPro';
import { type BarSeries } from '@mui/x-charts/BarChart';
import { ConfigSection } from '../configuration.type';

export const config: ConfigSection<BarChartProProps>[] = [
  {
    title: 'Series',
    properties: [
      {
        title: 'layout',
        key: 'series[*].layout',
        value: {
          type: 'radio',
          values: ['horizontal', 'vertical'],
          default: 'vertical',
        },
        setProperty(props, value) {
          if (value === 'vertical') {
            return props;
          }
          const { scaleType, data, ...newXAxis } = props.xAxis?.[0] ?? {};
          return {
            ...props,
            series: props.series.map((s: BarSeries) => ({ ...s, layout: value })),
            xAxis: [newXAxis],
            yAxis: [
              {
                ...props.yAxis?.[0],
                scaleType,
                data,
              },
            ],
          };
        },
      },
    ],
  },
  {
    title: 'X Axis',
    properties: [
      {
        title: 'position',
        key: 'xAxis[0].position',
        value: {
          type: 'radio',
          values: ['bottom', 'top'],
          default: 'bottom',
        },
        setProperty(props, value) {
          return { ...props, xAxis: [{ ...props.xAxis?.[0], position: value }] };
        },
      },
      {
        title: 'tickNumber',
        key: 'xAxis[0].tickNumber',
        value: {
          type: 'number',
          min: 0,
          max: 20,
          default: 5,
        },
        setProperty(props, value) {
          return { ...props, xAxis: [{ ...props.xAxis?.[0], tickNumber: value }] };
        },
        disabled(state) {
          return state['series[*].layout'] !== 'horizontal';
        },
      },
    ],
  },
  {
    title: 'Y Axis',
    properties: [
      {
        title: 'position',
        key: 'yAxis[0].position',
        value: {
          type: 'radio',
          values: ['left', 'right'],
          default: 'left',
        },
        setProperty(props, value) {
          return { ...props, yAxis: [{ ...props.yAxis?.[0], position: value }] };
        },
      },
      {
        title: 'tickNumber',
        key: 'yAxis[0].tickNumber',
        value: {
          type: 'number',
          min: 0,
          max: 20,
          default: 5,
        },
        setProperty(props, value) {
          return { ...props, yAxis: [{ ...props.yAxis?.[0], tickNumber: value }] };
        },
        disabled(state) {
          return state['series[*].layout'] === 'horizontal';
        },
      },
      {
        title: 'width',
        key: 'yAxis[0].width',
        value: {
          type: 'number',
          input: 'slider',
          min: 0,
          max: 100,
          default: 40,
          step: 5,
        },
        setProperty(props, value) {
          return { ...props, yAxis: [{ ...props.yAxis?.[0], width: value }] };
        },
      },
    ],
  },
];
