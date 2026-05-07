import { type BarChartProProps } from '@mui/x-charts-pro/BarChartPro';
import { type BarSeries } from '@mui/x-charts/BarChart';
import { ConfigSection, defineProperty } from '../configuration.type';

const p = defineProperty<BarChartProProps>();

export const config: ConfigSection<BarChartProProps>[] = [
  {
    title: 'Series',
    properties: [
      p.radio({
        title: 'layout',
        key: 'series[*].layout',
        input: 'buttonGroup',
        values: ['horizontal', 'vertical'],
        default: 'vertical',
        setProperty(props, value): BarChartProProps {
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
          } as BarChartProProps;
        },
      }),
    ],
  },
  {
    title: 'X Axis',
    properties: [
      p.radio({
        title: 'position',
        key: 'xAxis[0].position',
        input: 'buttonGroup',
        values: ['bottom', 'top', 'none'],
        default: 'bottom',
        setProperty(props, value) {
          return { ...props, xAxis: [{ ...props.xAxis?.[0], position: value }] };
        },
      }),
      p.number({
        title: 'tickNumber',
        key: 'xAxis[0].tickNumber',
        min: 0,
        max: 20,
        default: 5,
        setProperty(props, value) {
          return { ...props, xAxis: [{ ...props.xAxis?.[0], tickNumber: value }] };
        },
        disabled(state) {
          return state['series[*].layout'] !== 'horizontal';
        },
      }),
      p.radio({
        title: 'height',
        key: 'xAxis[0].height',
        input: 'buttonGroup',
        values: ['number', 'auto'],
        extraFields: {
          number: {
            title: 'height',
            key: 'xAxis[0].height_number',
            type: 'number',
            input: 'slider',
            min: 0,
            max: 100,
            default: 40,
            step: 5,
          },
        },
        default: 'number',
        setProperty(props, value, state) {
          if (value === 'auto') {
            return { ...props, xAxis: [{ ...props.xAxis?.[0], height: 'auto' }] };
          }
          const height = state['xAxis[0].height_number'] ?? 40;
          return { ...props, xAxis: [{ ...props.xAxis?.[0], height }] };
        },
      }),
      p.boolean({
        title: 'reverse',
        key: 'xAxis[0].reverse',
        default: false,
        setProperty(props, value) {
          return { ...props, xAxis: [{ ...props.xAxis?.[0], reverse: value }] };
        },
      }),
    ],
  },
  {
    title: 'Y Axis',
    properties: [
      p.radio({
        title: 'position',
        key: 'yAxis[0].position',
        input: 'buttonGroup',
        values: ['left', 'right', 'none'],
        default: 'left',
        setProperty(props, value) {
          return { ...props, yAxis: [{ ...props.yAxis?.[0], position: value }] };
        },
      }),
      p.number({
        title: 'tickNumber',
        key: 'yAxis[0].tickNumber',
        min: 0,
        max: 20,
        default: 5,
        setProperty(props, value) {
          return { ...props, yAxis: [{ ...props.yAxis?.[0], tickNumber: value }] };
        },
        disabled(state) {
          return state['series[*].layout'] === 'horizontal';
        },
      }),
      p.number({
        title: 'width',
        key: 'yAxis[0].width',
        input: 'slider',
        min: 0,
        max: 100,
        default: 40,
        step: 5,
        setProperty(props, value) {
          return { ...props, yAxis: [{ ...props.yAxis?.[0], width: value }] };
        },
      }),
      p.boolean({
        title: 'reverse',
        key: 'yAxis[0].reverse',
        default: false,
        setProperty(props, value) {
          return { ...props, yAxis: [{ ...props.yAxis?.[0], reverse: value }] };
        },
      }),
    ],
  },
  {
    title: 'Grid',
    properties: [
      p.boolean({
        title: 'vertical',
        key: 'grid.vertical',
        default: true,
        setProperty(props, value) {
          return { ...props, grid: { ...props.grid, vertical: value } };
        },
      }),
      p.boolean({
        title: 'horizontal',
        key: 'grid.horizontal',
        default: true,
        setProperty(props, value) {
          return { ...props, grid: { ...props.grid, horizontal: value } };
        },
      }),
    ],
  },
];
