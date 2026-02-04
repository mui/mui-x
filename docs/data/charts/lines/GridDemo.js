import { LineChart } from '@mui/x-charts/LineChart';

import {
  dateAxisFormatter,
  percentageFormatter,
  usUnemploymentRate,
} from '../dataset/usUnemploymentRate';

const xAxis = [
  {
    dataKey: 'date',
    scaleType: 'time',
    valueFormatter: dateAxisFormatter,
  },
];

const yAxis = [
  {
    valueFormatter: percentageFormatter,
  },
];

const series = [
  {
    dataKey: 'rate',
    showMark: false,
    valueFormatter: percentageFormatter,
  },
];

export default function GridDemo() {
  return (
    <LineChart
      dataset={usUnemploymentRate}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={300}
      grid={{ vertical: true, horizontal: true }}
    />
  );
}
