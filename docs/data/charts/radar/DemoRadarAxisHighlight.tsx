import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RadarChart, RadarSeries } from '@mui/x-charts/RadarChart';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function DemoRadarAxisHighlight() {
  const [hideMark, setHideMark] = React.useState(true);

  const withHideMark = (series: RadarSeries[]) =>
    series.map((item) => ({ ...item, hideMark }));

  return (
    <Box sx={{ width: '100%' }}>
      <Stack sx={{ width: '100%', mb: 2 }} direction="row" flexWrap="wrap" gap={2}>
        <FormControlLabel
          checked={!hideMark}
          control={
            <Checkbox onChange={(event) => setHideMark(!event.target.checked)} />
          }
          label="with mark"
          labelPlacement="end"
        />
      </Stack>
      <Stack
        sx={{ width: '100%' }}
        direction="row"
        flexWrap="wrap"
        justifyContent="space-around"
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <RadarChart
            {...commonSettings}
            series={withHideMark([lisaGrades, bartGrades])}
          />
        </Box>
      </Stack>
    </Box>
  );
}

const commonSettings = {
  height: 300,
  radar: {
    max: 120,
    metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
  },
};
const lisaGrades = {
  label: 'Lisa',
  data: [120, 98, 86, 99, 85, 65],
  hideMark: false,
} satisfies RadarSeries;
const bartGrades = {
  label: 'Bart',
  data: [25, 34, 51, 16, 90, 20],
  hideMark: false,
} satisfies RadarSeries;
