import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { AxisValueFormatterContext, ScatterValueType } from '@mui/x-charts/models';
import { earthquakeData } from '../dataset/earthquakeData';

const settings = {
  height: 400,
  grid: { horizontal: true },
};
const data = Object.entries(earthquakeData).reduce<ScatterValueType[]>(
  (acc, [magnitude, events]) => {
    acc.push({ x: Number.parseFloat(magnitude), y: events });

    return acc;
  },
  [],
);

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function valueFormatterIgnoreEmpty(value: any, context: AxisValueFormatterContext) {
  if (context.location === 'tick' && context.defaultTickLabel === '') {
    return '';
  }

  return formatter.format(value);
}

function valueFormatterShowAll(value: any) {
  return formatter.format(value);
}

export default function TicksWithoutLabels() {
  const [tickFormatter, setTickFormatter] = React.useState(
    () => valueFormatterIgnoreEmpty,
  );

  return (
    <Stack width="100%" direction={{ md: 'row' }} alignItems="center" rowGap={2}>
      <Stack width="100%">
        <Typography variant="h6" textAlign="center">
          Worldwide Earthquake Count and Magnitude, 2020-2024
        </Typography>
        <ScatterChart
          {...settings}
          xAxis={[{ height: 48, label: 'Magnitude' }]}
          yAxis={[
            {
              scaleType: 'log',
              valueFormatter: tickFormatter,
              label: 'Number of events (Log scale)',
              width: 50,
            },
          ]}
          series={[{ data }]}
        />
        <Typography variant="caption">Source: US Geological Survey</Typography>
      </Stack>
      <FormControl sx={{ flexShrink: 0 }}>
        <FormLabel id="tick-format-label">Tick Format</FormLabel>
        <RadioGroup
          aria-labelledby="tick-format-label"
          name="tick-format"
          value={tickFormatter === valueFormatterIgnoreEmpty ? 'empty' : 'all'}
          onChange={(event) =>
            setTickFormatter(() =>
              event.target.value === 'empty'
                ? valueFormatterIgnoreEmpty
                : valueFormatterShowAll,
            )
          }
        >
          <FormControlLabel
            value="empty"
            control={<Radio />}
            label="Ignore empty ticks"
          />
          <FormControlLabel
            value="all"
            control={<Radio />}
            label="Show all values"
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}
