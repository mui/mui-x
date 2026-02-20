import { LineChart } from '@mui/x-charts/LineChart';
import { XAxis } from '@mui/x-charts/models';
import {
  dateAxisFormatter,
  percentageFormatter,
  usUnemploymentRate,
} from '../dataset/usUnemploymentRate';

const xAxis: XAxis<'time'>[] = [
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
