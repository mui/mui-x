import Box from '@mui/material/Box';
import { LineChart, MarkElementProps } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
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

function CustomMark(props: MarkElementProps) {
  const { x, y, color } = props;

  return (
    <g>
      <circle cx={x} cy={y} r={4} fill={color || 'currentColor'} />
      <text
        x={x}
        y={Number(y) - 12}
        style={{
          textAnchor: 'middle',
          dominantBaseline: 'auto',
          fill: color || 'currentColor',
          fontWeight: 'bold',
          fontSize: 12,
        }}
      >
        {pData[props.dataIndex].toString()}
      </text>
    </g>
  );
}

export default function CustomLabelChart() {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <LineChart
        series={[{ data: pData, label: 'pv', showMark: true }]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        yAxis={[{ width: 50 }]}
        margin={margin}
        slots={{
          mark: CustomMark,
        }}
      />
    </Box>
  );
}
