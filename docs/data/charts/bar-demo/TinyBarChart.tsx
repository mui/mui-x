import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { BarPlot } from '@mui/x-charts/BarChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function TinyBarChart() {
  return (
    <ChartsContainer
      width={500}
      height={300}
      series={[{ data: uData, label: 'uv', type: 'bar' }]}
      xAxis={[{ scaleType: 'band', data: xLabels }]}
    >
      <BarPlot />
    </ChartsContainer>
  );
}
