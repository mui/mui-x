import Box from '@mui/material/Box';
import { LineChart, lineClasses } from '@mui/x-charts/LineChart';
import { labelMarkClasses } from '@mui/x-charts/ChartsLabel';

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

export default function StyledLineChart() {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <LineChart
        series={[
          {
            data: pData,
            label: 'pv',
            id: 'pvId',
            showMark: true,
            labelMarkType: 'line',
          },
          {
            data: uData,
            label: 'uv',
            id: 'uvId',
            showMark: true,
            labelMarkType: 'line',
          },
        ]}
        xAxis={[{ id: 'x-axis', scaleType: 'point', data: xLabels, height: 28 }]}
        yAxis={[{ width: 50 }]}
        tooltipAxis={[{ axisId: 'x-axis', dataIndex: 1 }]}
        sx={{
          // Style the chart line, legend mark, and tooltip mark for pvId
          [`& .${lineClasses.line}[data-series="pvId"], [data-series="pvId"] .${labelMarkClasses.fill}`]:
            {
              strokeDasharray: '5 5',
              strokeWidth: 1,
              strokeLinecap: 'square',
            },
          // Style the chart line, legend mark, and tooltip mark for uvId
          [`& .${lineClasses.line}[data-series="uvId"], [data-series="uvId"] .${labelMarkClasses.fill}`]:
            {
              strokeDasharray: '3 4 5 2',
              strokeWidth: 1,
              strokeLinecap: 'square',
            },
        }}
        margin={margin}
      />
    </Box>
  );
}
