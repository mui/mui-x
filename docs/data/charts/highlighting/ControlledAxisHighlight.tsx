import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { AxisItemIdentifier } from '@mui/x-charts/models';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';

export default function ControlledAxisHighlight() {
  const [highlightedAxis, setHighlightedAxis] = React.useState<AxisItemIdentifier[]>(
    [
      {
        axisId: 'x-axis',
        dataIndex: 2,
      },
    ],
  );

  const handleAxisHighlight = (event: any) => {
    setHighlightedAxis([
      {
        axisId: 'x-axis',
        dataIndex: Number(event.target.value),
      },
    ]);
  };

  return (
    <Stack spacing={2} alignItems={'center'} sx={{ width: '100%' }}>
      <FormControl>
        <FormLabel id="axis-index-radio-group">Highlighted index</FormLabel>
        <RadioGroup
          aria-labelledby="axis-index-radio-group"
          name="radio-buttons-group"
          value={highlightedAxis[0]?.dataIndex ?? null}
          onChange={handleAxisHighlight}
          row
        >
          <FormControlLabel value="0" control={<Radio />} label="0" />
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
          <FormControlLabel value="3" control={<Radio />} label="3" />
          <FormControlLabel value="4" control={<Radio />} label="4" />
        </RadioGroup>
      </FormControl>
      <Box sx={{ width: '100%' }}>
        <BarChart
          {...barChartsProps}
          highlightedAxis={highlightedAxis}
          tooltipAxis={highlightedAxis}
          onHighlightedAxisChange={(newState) => setHighlightedAxis(newState)}
          layout="horizontal"
        />
        <LineChart
          {...lineChartsProps}
          highlightedAxis={highlightedAxis}
          tooltipAxis={highlightedAxis}
          onHighlightedAxisChange={(newState) => setHighlightedAxis(newState)}
        />
      </Box>
    </Stack>
  );
}

const barChartsProps: BarChartProps = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'series A', id: 'A' },
    { data: [4, 3, 1, 5, 8], label: 'series B', id: 'B' },
  ],
  yAxis: [{ id: 'x-axis', scaleType: 'band', data: [0, 2, 5, 10, 20] }],
  height: 300,
};

const lineChartsProps: LineChartProps = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'series A', id: 'A' },
    { data: [4, 3, 1, 5, 8], label: 'series B', id: 'B' },
  ],
  xAxis: [{ id: 'x-axis', scaleType: 'linear', data: [0, 2, 5, 10, 20] }],
  height: 300,
};
