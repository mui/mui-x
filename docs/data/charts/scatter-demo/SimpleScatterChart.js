import { ScatterChart } from '@mui/x-charts/ScatterChart';
import Box from '@mui/material/Box';

const data = [
  { x: 100, y: 200, id: 1 },
  { x: 120, y: 100, id: 2 },
  { x: 170, y: 300, id: 3 },
  { x: 140, y: 250, id: 4 },
  { x: 150, y: 400, id: 5 },
  { x: 110, y: 280, id: 6 },
];

export default function SimpleScatterChart() {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ScatterChart
        series={[{ data, label: 'pv', id: 'pvId' }]}
        xAxis={[{ min: 0, height: 28 }]}
      />
    </Box>
  );
}
