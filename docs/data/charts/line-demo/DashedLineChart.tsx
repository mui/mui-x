import Box from '@mui/material/Box';
import { LineChart, lineClasses, lineClasses } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
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

export default function DashedLineChart() {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <LineChart
        series={[
          { data: pData, label: 'pv', id: 'pvId', showMark: true },
          { data: uData, label: 'uv', id: 'uvId', showMark: true },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels, height: 28 }]}
        yAxis={[{ width: 50 }]}
        sx={{
          [`.${lineClasses.mark}, .${lineClasses.mark}`]: {
            strokeWidth: 1,
          },
          [`.${lineClasses.mark}[data-series="pvId"]`]: {
            strokeDasharray: '5 5',
          },
          [`.${lineClasses.mark}[data-series="uvId"]`]: {
            strokeDasharray: '3 4 5 2',
          },
          [`.${lineClasses.mark}:not(.${lineClasses.highlighted})`]: {
            fill: '#fff',
          },
          [`& .${lineClasses.highlighted}`]: {
            stroke: 'none',
          },
        }}
        margin={margin}
      />
    </Box>
  );
}
