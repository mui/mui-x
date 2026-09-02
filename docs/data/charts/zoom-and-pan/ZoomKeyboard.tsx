import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { randomData } from './randomData';

export default function ZoomKeyboard() {
  return (
    <LineChartPro
      height={300}
      xAxis={[{ data: randomData.map((v, i) => i), zoom: true }]}
      yAxis={[{ zoom: true, width: 50 }]}
      series={series}
    />
  );
}

const series = [
  {
    label: 'Series A',
    data: randomData.map((v) => v.y1),
  },
  {
    label: 'Series B',
    data: randomData.map((v) => v.y2),
  },
];
