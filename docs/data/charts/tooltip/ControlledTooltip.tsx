import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { BarItemIdentifier } from '@mui/x-charts/models';

export default function ControlledTooltip() {
  const [tooltipItem, setTooltipItem] = React.useState<BarItemIdentifier | null>({
    type: 'bar',
    seriesId: 'A',
    dataIndex: 0,
  });

  const handleTooltipSeries = (event: any, newTooltipSeries: string) => {
    if (newTooltipSeries !== null) {
      setTooltipItem((prev) => ({
        type: 'bar',
        dataIndex: 0,
        ...prev,
        seriesId: newTooltipSeries,
      }));
    }
  };

  const handleTooltipItem = (event: any) => {
    setTooltipItem((prev) => ({
      type: 'bar',
      seriesId: 'A',
      ...prev,
      dataIndex: Number(event.target.value),
    }));
  };

  return (
    <Stack
      direction={{ xs: 'column', xl: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Stack spacing={2} alignItems={'center'}>
          <ToggleButtonGroup
            value={tooltipItem?.seriesId ?? null}
            exclusive
            onChange={handleTooltipSeries}
            aria-label="highlighted series"
            fullWidth
          >
            {['A', 'B'].map((type) => (
              <ToggleButton key={type} value={type}>
                Series {type}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <FormControl>
            <FormLabel id="item-id-radio-group">Item ID</FormLabel>
            <RadioGroup
              aria-labelledby="item-id-radio-group"
              name="radio-buttons-group"
              value={tooltipItem?.dataIndex ?? null}
              onChange={handleTooltipItem}
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
          slotProps={{ tooltip: { trigger: 'item' } }}
          tooltipItem={tooltipItem}
          onTooltipItemChange={setTooltipItem}
        />
      </Box>
    </Stack>
  );
}

const barChartsProps: BarChartProps = {
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
  height: 400,
};
