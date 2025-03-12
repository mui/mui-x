import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { RadarSeriesType } from '@mui/x-charts/models';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

export default function DemoRadarAxisHighlight() {
  const [showMark, setShowMark] = React.useState(true);
  const [shape, setShape] = React.useState<'points' | 'slice' | 'default'>(
    'default',
  );

  const withShowMark = (series: RadarSeriesType[]) =>
    series.map((item) => ({ ...item, showMark }));

  const axisHighlightShape = shape === 'default' ? undefined : shape;
  return (
    <div>
      <Stack sx={{ width: '100%', mb: 2 }} direction="row" flexWrap="wrap" gap={2}>
        <FormControlLabel
          checked={showMark}
          control={
            <Checkbox onChange={(event) => setShowMark(event.target.checked)} />
          }
          label="with mark"
          labelPlacement="end"
        />

        <ToggleButtonGroup
          value={shape}
          exclusive
          onChange={(_, newValue) => setShape(newValue)}
          aria-label="axis highlight shape"
          size="small"
        >
          {['default', 'points', 'slice'].map((type) => (
            <ToggleButton key={type} value={type} aria-label={type}>
              {type}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <Stack
        sx={{ width: '100%' }}
        direction="row"
        flexWrap="wrap"
        justifyContent="space-around"
      >
        <Box sx={{ maxWidth: 300 }}>
          <RadarChart
            {...commonSettings}
            axisHighlightShape={axisHighlightShape}
            series={withShowMark([lisaGrades])}
          />
        </Box>
        <Box sx={{ maxWidth: 300 }}>
          <RadarChart
            {...commonSettings}
            axisHighlightShape={axisHighlightShape}
            series={withShowMark([lisaGrades, bartGrades])}
          />
        </Box>
      </Stack>
    </div>
  );
}

const commonSettings = {
  height: 300,
  radar: {
    max: 120,
    metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
  },
};
const lisaGrades: RadarSeriesType = {
  type: 'radar',
  label: 'Lisa',
  data: [120, 98, 86, 99, 85, 65],
  showMark: true,
};
const bartGrades: RadarSeriesType = {
  type: 'radar',
  label: 'Bart',
  data: [25, 34, 51, 16, 90, 20],
  showMark: true,
};
