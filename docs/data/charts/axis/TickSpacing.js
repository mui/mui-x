import * as React from 'react';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import data from '../dataset/sp500-intraday.json';

const tickLabelDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

export default function TickSpacing() {
  const [tickSpacing, setTickSpacing] = React.useState(50);

  return (
    <Stack direction="column" gap={4} width="100%">
      <Stack
        direction="column"
        spacing={1}
        flex={1}
        width="100%"
        maxWidth={400}
        alignSelf="center"
      >
        <Typography gutterBottom id="tickSpacing">
          Tick Spacing
        </Typography>
        <Slider
          value={tickSpacing}
          onChange={(event, value) => setTickSpacing(value)}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          step={5}
          sx={{ mt: 2 }}
          aria-labelledby="tickSpacing"
        />
      </Stack>
      <BarChartPro
        xAxis={[
          {
            data: data.map((d) => new Date(Date.parse(d.date))),
            valueFormatter: (v) => tickLabelDateFormatter.format(v),
            tickSpacing,
            tickPlacement: 'middle',
            zoom: true,
          },
        ]}
        series={[{ data: data.map((d) => d.close), label: 'Close' }]}
        height={300}
      />
    </Stack>
  );
}
