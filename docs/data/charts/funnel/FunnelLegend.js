import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function FunnelLegend() {
  const [hideLegend, setHideLegend] = React.useState(false);

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Controls hideLegend={hideLegend} setHideLegend={setHideLegend} />
      <FunnelChart
        series={[
          {
            data: [
              { value: 200, label: 'A' },
              { value: 180, label: 'B' },
              { value: 90, label: 'C' },
              { value: 50, label: 'D' },
            ],
          },
        ]}
        hideLegend={hideLegend}
        {...funnelProps}
      />
    </Box>
  );
}

const funnelProps = {
  height: 300,
  slotProps: { legend: { position: { vertical: 'bottom' } } },
};

function Controls({ hideLegend, setHideLegend }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={hideLegend}
          onChange={() => setHideLegend((prev) => !prev)}
        />
      }
      label="Hide legend"
    />
  );
}
