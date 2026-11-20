import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function Pyramid() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      {/* @focus-start */}
      <FunnelChart
        series={[
          {
            curve: 'pyramid',
            data: [{ value: 10 }, { value: 100 }, { value: 1000 }, { value: 10000 }],
          },
        ]}
        height={300}
      />
      {/* @focus-end */}
    </Box>
  );
}
