import * as React from 'react';
import Stack from '@mui/material/Stack';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import data from '../dataset/sp500-intraday.json';

const tickLabelDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

export default function BarBatchRenderer() {
  const [renderer, setRenderer] = React.useState<'svg-single' | 'svg-batch'>(
    'svg-batch',
  );

  return (
    <Stack width="100%">
      <FormControl fullWidth>
        <FormLabel id="bar-chart-renderer-label">Rendering Strategy</FormLabel>
        <RadioGroup
          row
          aria-labelledby="bar-chart-renderer-label"
          value={renderer}
          onChange={(event) =>
            setRenderer(event.target.value as 'svg-single' | 'svg-batch')
          }
        >
          <FormControlLabel
            value="svg-single"
            control={<Radio />}
            label="Individual Bars (default)"
          />
          <FormControlLabel
            value="svg-batch"
            control={<Radio />}
            label="Batch Bar Rendering"
          />
        </RadioGroup>
      </FormControl>

      <BarChartPro
        xAxis={[
          {
            data: data.map((d) => new Date(d.date)),
            valueFormatter: (v: Date) => tickLabelDateFormatter.format(v),
            zoom: true,
            ordinalTimeTicks: [
              'years',
              'quarterly',
              'months',
              'biweekly',
              'weeks',
              'days',
            ],
          },
        ]}
        series={[
          {
            data: data.map((d) => d.close),
            label: 'Close',
            highlightScope: { highlight: 'item', fade: 'global' },
          },
          {
            data: data.map((d) => d.open),
            label: 'Open',
            highlightScope: { highlight: 'item', fade: 'global' },
          },
        ]}
        height={300}
        renderer={renderer}
      />
    </Stack>
  );
}
