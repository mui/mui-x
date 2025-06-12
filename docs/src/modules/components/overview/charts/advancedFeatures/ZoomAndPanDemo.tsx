import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import DemoWrapper from '../../DemoWrapper';
import dataset from '../data/Goolge-Meta-stoks.json';

const base = {
  google: dataset[0].google!,
  meta: dataset[0].meta!,
};
const formattedDataset = dataset.map((item) => ({
  date: new Date(item.date),
  google: item.google ? (100 * item.google) / base.google : null,
  meta: item.meta ? (100 * item.meta) / base.meta : null,
}));

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}).format;
const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  .format;

function ZoomAndPan() {
  return (
    <LineChartPro
      dataset={formattedDataset}
      series={[
        {
          label: 'Google',
          dataKey: 'google',
          showMark: false,
          valueFormatter: (value: number | null) =>
            value === null ? '' : currencyFormatter(value),
        },
        {
          label: 'Meta',
          dataKey: 'meta',
          showMark: false,
          valueFormatter: (value: number | null) =>
            value === null ? '' : currencyFormatter(value),
        },
      ]}
      xAxis={[
        {
          id: 'x-axis',
          scaleType: 'time',
          dataKey: 'date',
          zoom: { slider: { enabled: true }, filterMode: 'discard' },
          domainLimit: 'strict',
          valueFormatter: (value, context) => {
            if (context.location === 'tick') {
              return context.scale.tickFormat()(value);
            }
            return dateFormatter(value);
          },
        },
      ]}
      yAxis={[{ id: 'y-axis', tickNumber: 5, width: 40 }]}
      slotProps={{ tooltip: { disablePortal: true } }}
    />
  );
}

export default function ZoomAndPanDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  return (
    <DemoWrapper link="/x/react-charts/bar/">
      <Stack
        spacing={1}
        sx={{ width: '100%', padding: 2, minHeight: '600px' }}
        justifyContent="space-between"
      >
        <Box
          sx={{
            height: 352,
            overflow: 'auto',
            minWidth: 260,
            padding: 2,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <ZoomAndPan />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={`
<LinChartPro
  xAxis={[{ scaleType: 'time', dataKey: 'date', zoom: true }]}
  yAxis={[{ zoom: true }]}
/>`}
          language="js"
          sx={{ overflowX: 'hidden' }}
        />
      </Stack>
    </DemoWrapper>
  );
}
