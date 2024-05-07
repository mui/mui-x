import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Stack from '@mui/material/Stack';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

export default function BorderRadius() {
  const [layout, setLayout] = React.useState('vertical');
  const [radius, setRadius] = React.useState(10);

  return (
    <Stack direction="column" spacing={1} sx={{ width: '100%', maxWidth: 600 }}>
      <Stack direction="row" spacing={4}>
        <Stack direction="column" spacing={1} flex={1}>
          <Typography gutterBottom>Border Radius</Typography>
          <Slider
            value={radius}
            onChange={(e, v) => setRadius(v)}
            valueLabelDisplay="auto"
            min={0}
            max={50}
            sx={{ mt: 2 }}
          />
        </Stack>
        <TextField
          select
          sx={{ minWidth: 150 }}
          label="layout"
          value={layout}
          onChange={(event) => setLayout(event.target.value)}
        >
          <MenuItem value="horizontal">Horizontal</MenuItem>
          <MenuItem value="vertical">Vertical</MenuItem>
        </TextField>
      </Stack>
      <BarChart
        series={[
          { dataKey: 'high', label: 'High', layout, stack: 'stack' },
          { dataKey: 'low', label: 'Low', layout, stack: 'stack' },
        ]}
        {...(layout === 'vertical' ? chartSettingsV : chartSettingsH)}
        borderRadius={radius}
      />
      <HighlightedCode
        code={[`<BarChart`, `  /* ... */`, `  borderRadius={${radius}}`, `/>`].join(
          '\n',
        )}
        language="jsx"
        copyButtonHidden
      />
    </Stack>
  );
}

const dataset = [
  [3, -7, 'First'],
  [0, -5, 'Second'],
  [10, 0, 'Third'],
  [9, 6, 'Fourth'],
].map(([high, low, order]) => ({
  high,
  low,
  order,
}));
const chartSettingsH = {
  dataset,
  height: 300,
  yAxis: [{ scaleType: 'band', dataKey: 'order' }],
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
  },
  slotProps: {
    legend: {
      direction: 'row',
      position: { vertical: 'bottom', horizontal: 'middle' },
      padding: -5,
    },
  },
};
const chartSettingsV = {
  ...chartSettingsH,
  xAxis: [{ scaleType: 'band', dataKey: 'order' }],
  yAxis: undefined,
};
