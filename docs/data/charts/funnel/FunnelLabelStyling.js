import Box from '@mui/material/Box';
import { FunnelChart, funnelSectionClasses } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelLabelStyling() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data: [{ value: 200 }, { value: 180 }, { value: 90 }, { value: 50 }],
          },
        ]}
        sx={{
          [`& .${funnelSectionClasses.label}`]: {
            fill: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          },
        }}
        {...funnelProps}
      />
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
};
