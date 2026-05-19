import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Unstable_RadialLineChart as RadialLineChart } from '@mui/x-charts-premium/RadialLineChart';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function ClosedOpenRadialLineChart() {
  const [area, setArea] = React.useState(false);
  const [closePath, setClosePath] = React.useState(true);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2, width: '100%' }}>
        <FormControlLabel
          checked={area}
          control={<Checkbox onChange={(event) => setArea(event.target.checked)} />}
          label="area"
          labelPlacement="end"
        />
        <FormControlLabel
          checked={closePath}
          control={
            <Checkbox onChange={(event) => setClosePath(event.target.checked)} />
          }
          label="closePath"
          labelPlacement="end"
        />
      </Stack>
      <RadialLineChart
        height={300}
        series={[
          {
            data: [3, 5, 7, 10, 12, 15, 18, 16, 13, 9, 6, 4],
            label: 'Temperature',
            area,
            closePath,
          },
        ]}
        rotationAxis={[{ scaleType: 'point', data: months, disableLine: true }]}
        radiusAxis={[{ disableLine: true }]}
        grid={{ rotation: true, radius: true }}
      />
    </Box>
  );
}
