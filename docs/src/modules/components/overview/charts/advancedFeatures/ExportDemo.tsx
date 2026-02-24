import * as React from 'react';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ChartProApi } from '@mui/x-charts-pro/ChartContainerPro';
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

function Export() {
  const apiRef = React.useRef<ChartProApi<'line'>>(undefined);

  return (
    <Stack height="100%" spacing={3} alignItems="center">
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <Typography align="center">Google vs Meta stock price</Typography>
        <LineChartPro
          apiRef={apiRef}
          dataset={formattedDataset}
          series={[
            {
              label: 'Google',
              dataKey: 'google',
              valueFormatter: (value: number | null) =>
                value === null ? '' : currencyFormatter(value),
            },
            {
              label: 'Meta',
              dataKey: 'meta',
              valueFormatter: (value: number | null) =>
                value === null ? '' : currencyFormatter(value),
            },
          ]}
          xAxis={[
            {
              id: 'x-axis',
              scaleType: 'time',
              dataKey: 'date',
              zoom: { filterMode: 'discard' },
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
          slotProps={{ tooltip: { disablePortal: true } }}
        />
      </div>
      <ButtonGroup variant="outlined" aria-label="Charts export options" sx={{ mx: 'auto' }}>
        <Button onClick={() => apiRef.current?.exportAsPrint()}>PDF print</Button>
        <Button onClick={() => apiRef.current?.exportAsImage({ type: 'image/png' })}>PNG</Button>
        <Button onClick={() => apiRef.current?.exportAsImage({ type: 'image/jpeg' })}>JPEG</Button>
        <Button onClick={() => apiRef.current?.exportAsImage({ type: 'image/webp' })}>WebP</Button>
      </ButtonGroup>
    </Stack>
  );
}

export default function ExportDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/export/">
      <Export />
    </ChartDemoWrapper>
  );
}
