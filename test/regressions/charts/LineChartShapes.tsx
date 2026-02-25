import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { LineChart } from '@mui/x-charts/LineChart';
import type { MarkShape } from '@mui/x-charts/models/seriesType/line';

const shapes: MarkShape[] = ['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'];

const xData = [0, 1, 2, 3, 4, 5, 6];
const yData = [2, 5.5, 2, 8.5, 1.5, 5, 3];

export default function LineChartShapes() {
  return (
    <LineChart
      xAxis={[{ id: 'x-axis', data: xData }]}
      series={shapes.map((shape, i) => ({
        id: shape,
        data: yData.map((v) => v + i * 1.5),
        shape,
        showMark: true,
        label: shape,
      }))}
      height={400}
      width={500}
      tooltipItem={{ type: 'line', seriesId: 'diamond', dataIndex: 5 }}
      tooltipAxis={[{ axisId: 'x-axis', dataIndex: 1 }]}
    >
      <ChartsTooltip trigger="item" />
    </LineChart>
  );
}
