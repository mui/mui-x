import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelBorderRadius() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data: [{ value: 200 }, { value: 180 }, { value: 90 }, { value: 50 }],
            borderRadius: 10,
          },
        ]}
        height={300}
      />
      <FunnelChart
        series={[
          {
            data: [{ value: 200 }, { value: 180 }, { value: 90 }, { value: 50 }],
            borderRadius: 10,
          },
        ]}
        height={300}
        gap={10}
      />
    </Box>
  );
}
