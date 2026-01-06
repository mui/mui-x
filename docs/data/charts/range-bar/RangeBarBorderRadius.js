import * as React from 'react';
import Stack from '@mui/material/Stack';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function RangeBarBorderRadius() {
  const [layout, setLayout] = React.useState('vertical');
  const [radius, setRadius] = React.useState(10);
  const [reverse, setReverse] = React.useState(false);

  return (
    <Stack direction="column" spacing={1} sx={{ width: '100%', maxWidth: 600 }}>
      <Stack direction="row" spacing={4} flexWrap="wrap" justifyContent="center">
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

        <FormControlLabel
          checked={reverse}
          control={
            <Checkbox onChange={(event) => setReverse(event.target.checked)} />
          }
          label="Reverse"
          labelPlacement="end"
        />
      </Stack>
      <BarChartPremium
        series={[
          {
            type: 'rangeBar',
            datasetKeys: { start: 'low', end: 'high' },
            layout,
          },
        ]}
        margin={{ left: 0 }}
        {...getChartSettings(layout, reverse)}
        borderRadius={radius}
      />
      <HighlightedCode
        code={`<BarChartPremium
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

function getChartSettings(layout, reverse) {
  return {
    dataset,
    height: 300,
    xAxis: layout === 'horizontal' ? [{ reverse }] : [{ dataKey: 'order' }],
    yAxis:
      layout === 'horizontal'
        ? [{ scaleType: 'band', dataKey: 'order' }]
        : [{ reverse }],
    slotProps: {
      legend: {
        direction: 'horizontal',
        position: { vertical: 'bottom', horizontal: 'center' },
      },
    },
  };
}
