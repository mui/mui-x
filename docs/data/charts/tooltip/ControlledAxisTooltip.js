import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

export default function ControlledAxisTooltip() {
  const [tooltipAxis, setTooltipAxis] = React.useState([
    {
      axisId: 'x-axis',
      dataIndex: 0,
    },
  ]);

  const handleTooltipAxis = (event) => {
    setTooltipAxis([
      {
        axisId: 'x-axis',
        dataIndex: Number(event.target.value),
      },
    ]);
  };

  return (
    <Stack
      direction={{ xs: 'column', xl: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Stack spacing={2} alignItems={'center'}>
          <FormControl>
            <FormLabel id="item-id-radio-group">Item ID</FormLabel>
            <RadioGroup
              aria-labelledby="item-id-radio-group"
              name="radio-buttons-group"
              value={tooltipAxis?.[0]?.dataIndex ?? null}
              onChange={handleTooltipAxis}
              row
            >
              <FormControlLabel value="0" control={<Radio />} label="0" />
              <FormControlLabel value="1" control={<Radio />} label="1" />
              <FormControlLabel value="2" control={<Radio />} label="2" />
              <FormControlLabel value="3" control={<Radio />} label="3" />
              <FormControlLabel value="4" control={<Radio />} label="4" />
            </RadioGroup>
          </FormControl>
        </Stack>
        <BarChart
          {...barChartsProps}
          slotProps={{ tooltip: { trigger: 'axis' } }}
          tooltipAxis={tooltipAxis}
          onTooltipAxisChange={setTooltipAxis}
        />
      </Box>
    </Stack>
  );
}

const barChartsProps = {
  series: [
    {
      data: [3, 4, 1, 6, 5],
      label: 'A',
      id: 'A',
      highlightScope: { highlight: 'item', fade: 'global' },
    },
    {
      data: [4, 3, 1, 5, 8],
      label: 'B',
      id: 'B',
      highlightScope: { highlight: 'item', fade: 'global' },
    },
  ],
  xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B', 'C', 'D', 'E'] }],
  height: 400,
};
