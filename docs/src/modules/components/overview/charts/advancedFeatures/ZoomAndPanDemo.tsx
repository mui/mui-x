import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import dataset from '../data/Goolge-Meta-stoks.json';
import ChartDemoWrapper from '../ChartDemoWrapper';
import { shortMonthYearFormatter } from '../shortMonthYearFormatter';

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
    <Stack height="100%">
      <Typography align="center">Google vs Meta stock price</Typography>
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
            tickNumber: 3,
            valueFormatter: (value, context) => {
              if (context.location === 'tick') {
                return shortMonthYearFormatter(value);
              }
              return dateFormatter(value);
            },
          },
        ]}
        yAxis={[{ id: 'y-axis', tickNumber: 5, width: 40 }]}
        initialZoom={[{ axisId: 'x-axis', start: 60, end: 100 }]}
        slotProps={{ tooltip: { disablePortal: true } }}
        showToolbar
      />
    </Stack>
  );
}

export default function ZoomAndPanDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/zoom-and-pan/">
      <ZoomAndPan />
    </ChartDemoWrapper>
  );
}
