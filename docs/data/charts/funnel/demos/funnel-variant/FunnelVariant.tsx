import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelVariant() {
  // @focus-start @padding 1
  const data = [
    { value: 200, label: 'Leads' },
    { value: 150, label: 'Calls' },
    { value: 90, label: 'Meetings' },
    { value: 40, label: 'Deals' },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data,
            variant: 'outlined',
          },
        ]}
        height={300}
      />
    </Box>
  );
  // @focus-end
}
