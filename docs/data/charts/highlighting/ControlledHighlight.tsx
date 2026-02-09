import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { BarItemIdentifier } from '@mui/x-charts/models';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

export default function ControlledHighlight() {
  const [highlightedItem, setHighLightedItem] =
    React.useState<BarItemIdentifier | null>({
      type: 'bar',
      seriesId: 'A',
      dataIndex: 0,
    });
  const [highlight, setHighlight] = React.useState<'none' | 'item' | 'series'>(
    'item',
  );
  const [fade, setFade] = React.useState<'none' | 'series' | 'global'>('global');

  const handleHighLightedSeries = (event: any, newHighLightedSeries: string) => {
    if (newHighLightedSeries !== null) {
      setHighLightedItem((prev) => ({
        type: 'bar' as const,
        dataIndex: 0,
        ...prev,
        seriesId: newHighLightedSeries,
      }));
    }
  };

  const handleHighLightedItem = (event: any) => {
    setHighLightedItem((prev) => ({
      type: 'bar' as const,
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
            value={highlightedItem?.seriesId ?? null}
            exclusive
            onChange={handleHighLightedSeries}
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
              value={highlightedItem?.dataIndex ?? null}
              onChange={handleHighLightedItem}
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
          series={barChartsProps.series.map((series) => ({
            ...series,
            highlightScope: {
              highlight,
              fade,
            },
          }))}
          highlightedItem={highlightedItem}
          onHighlightChange={setHighLightedItem}
        />
      </Box>
      <Stack
        direction={{ xs: 'row', xl: 'column' }}
        spacing={3}
        justifyContent="center"
        flexWrap="wrap"
        useFlexGap
      >
        <TextField
          select
          label="highlighted"
          value={highlight}
          onChange={(event) =>
            setHighlight(event.target.value as 'none' | 'item' | 'series')
          }
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'item'}>item</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
        </TextField>
        <TextField
          select
          label="faded"
          value={fade}
          onChange={(event) =>
            setFade(event.target.value as 'none' | 'series' | 'global')
          }
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
          <MenuItem value={'global'}>global</MenuItem>
        </TextField>
      </Stack>
    </Stack>
  );
}

const barChartsProps: BarChartProps = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'A', id: 'A' },
    { data: [4, 3, 1, 5, 8], label: 'B', id: 'B' },
  ],
  height: 400,
};
