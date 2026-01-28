import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { data } from './randomData';

const series = [
  {
    label: 'Series A',
    data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
  },
  {
    label: 'Series B',
    data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
  },
];

export default function ChartsToolbar() {
  return (
    <ScatterChartPro
      xAxis={[{ zoom: true }]}
      yAxis={[{ zoom: true }]}
      height={300}
      series={series}
      showToolbar
    />
  );
}
