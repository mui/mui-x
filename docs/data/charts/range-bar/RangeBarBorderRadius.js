import * as React from 'react';
import Stack from '@mui/material/Stack';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

export default function RangeBarBorderRadius() {
  const [layout, setLayout] = React.useState('vertical');
  const [radius, setRadius] = React.useState(10);

  return (
    <Stack direction="column" spacing={1} sx={{ width: '100%', maxWidth: 600 }}>
      <Stack direction="row" spacing={4}>
        <Stack direction="column" spacing={1} flex={1}>
          <Typography gutterBottom>Border Radius</Typography>
          <Slider
            value={radius}
            onChange={(event, value) => setRadius(value)}
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
      <BarChartPro
        series={[
          {
            type: 'rangeBar',
            datasetKeys: { start: 'low', end: 'high' },
            label: 'High',
            layout,
          },
        ]}
        margin={{ left: 0 }}
        {...(layout === 'vertical' ? chartSettingsV : chartSettingsH)}
        borderRadius={radius}
      />
      <HighlightedCode
        code={`<BarChartPro
  // ...
  borderRadius={${radius}}
/>`}
        language="jsx"
        copyButtonHidden
      />
    </Stack>
  );
}

const dataset = [
  [3, -7, '1st'],
  [0, -5, '2nd'],
  [10, 0, '3rd'],
  [9, 6, '4th'],
].map(([high, low, order]) => ({
  high,
  low,
  order,
}));
const chartSettingsH = {
  dataset,
  height: 300,
  yAxis: [{ scaleType: 'band', dataKey: 'order' }],
  slotProps: {
    legend: {
      direction: 'horizontal',
      position: { vertical: 'bottom', horizontal: 'center' },
    },
  },
};
const chartSettingsV = {
  ...chartSettingsH,
  xAxis: [{ dataKey: 'order' }],
  yAxis: undefined,
};
