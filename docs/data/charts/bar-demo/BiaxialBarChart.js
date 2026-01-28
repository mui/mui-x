import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];

const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function BiaxialBarChart() {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <BarChart
        series={[
          {
            data: pData,
            label: 'pv',
            id: 'pvId',
            yAxisId: 'leftAxisId',
          },
          {
            data: uData,
            label: 'uv',
            id: 'uvId',
            yAxisId: 'rightAxisId',
          },
        ]}
        xAxis={[{ data: xLabels, height: 28 }]}
        yAxis={[
          { id: 'leftAxisId', width: 50 },
          { id: 'rightAxisId', position: 'right' },
        ]}
      />
    </Box>
  );
}
