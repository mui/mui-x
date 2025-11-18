import * as React from 'react';
import { XAxis } from '@mui/x-charts/models';
import { BarChartPro, BarChartProProps } from '@mui/x-charts-pro/BarChartPro';
import { shareOfRenewables } from 'docsx/data/charts/dataset/shareOfRenewables';
import { countryData } from 'docsx/data/charts/dataset/countryData';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Stack } from '@mui/material';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const percentageFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 3,
});

const sortedShareOfRenewables = shareOfRenewables.toSorted(
  (a, b) => a.renewablesPercentage - b.renewablesPercentage,
);
const barXAxis = {
  id: 'x',
  data: sortedShareOfRenewables.map((d) => countryData[d.code].country),
  tickLabelStyle: { angle: -45 },
  height: 90,
} satisfies XAxis<'band'>;
const barSettings = {
  series: [
    {
      data: sortedShareOfRenewables.map((d) => d.renewablesPercentage / 100),
      valueFormatter: (v: number | null) => percentageFormatter.format(v!),
    },
  ],
  height: 400,
} satisfies Partial<BarChartProProps>;

export default function ZoomSliderPreview() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Stack width="100%" sx={(theme) => ({ background: theme.palette.background.default })}>
        <BarChartPro
          {...barSettings}
          xAxis={[
            {
              ...barXAxis,
              zoom: { filterMode: 'discard', slider: { enabled: true, preview: true } },
            },
          ]}
          zoomData={[{ axisId: 'x', start: 10, end: 30 }]}
        />
      </Stack>
    </ThemeProvider>
  );
}
