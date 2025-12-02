import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function PyramidFunnel() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            curve: 'pyramid',
            data: [{ value: 10 }, { value: 90 }, { value: 180 }, { value: 400 }],
          },
        ]}
        height={300}
      />
    </Box>
  );
}
