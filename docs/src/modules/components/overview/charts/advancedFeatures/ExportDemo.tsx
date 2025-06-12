/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { ChartProApi } from '@mui/x-charts-pro/ChartContainerPro';
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

function Export() {
  const apiRef = React.useRef<ChartProApi<'line'>>(undefined);

  return (
    <Stack alignItems="stretch">
      <LineChartPro
        apiRef={apiRef}
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
            zoom: { filterMode: 'discard' },
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
            overflow: 'auto',
            minWidth: 260,
            padding: 2,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <Export />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={`
const apiRef = React.useRef<ChartProApi<'line'>>(undefined);
<LinChartPro
  apiRef={apiRef}
/>
<Button onClick={
  () => apiRef.current.exportAsImage({type: 'image/jpeg'})
}>
  JPEG
</Button>
`}
          language="js"
          sx={{ overflowX: 'hidden' }}
        />
      </Stack>
    </DemoWrapper>
  );
}
