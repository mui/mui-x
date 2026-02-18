import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { AxisValueFormatterContext, YAxis } from '@mui/x-charts/models';
import { sxColors } from '../colors';
import dataset from '../../data/Goolge-Meta-stoks.json';
import { shortMonthYearFormatter } from '../../shortMonthYearFormatter';

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

export default function ZoomAndPan() {
  return (
    <Stack spacing={1} sx={sxColors} direction={{ xs: 'column-reverse', xl: 'column' }}>
      <Box
        sx={{
          flexGrow: 1,
          mb: 2,
          width: '100%',
          height: '100%',
        }}
      >
        <LineChartPro
          colors={['var(--palette-color-0)', 'var(--palette-color-4)']}
          dataset={formattedDataset}
          series={[
            { label: 'Google', dataKey: 'google' },
            { label: 'Meta', dataKey: 'meta' },
          ]}
          margin={{ left: 0, right: 0, bottom: 0, top: 20 }}
          xAxis={[
            {
              id: 'x-axis',
              scaleType: 'time',
              dataKey: 'date',
              zoom: true,
              domainLimit: 'strict',
              tickNumber: 3,
              valueFormatter: (value: Date, context: AxisValueFormatterContext<'time'>) => {
                if (context.location === 'tick') {
                  return shortMonthYearFormatter(value);
                }
                return dateFormatter(value);
              },
              tickLabelStyle: { fontWeight: 400 },
            },
          ]}
          yAxis={[
            {
              id: 'y-axis',
              zoom: true,
              width: 40,
              tickNumber: 4,
              min: 80,
              max: 200,
              tickLabelStyle: { fontWeight: 400 },
            } as YAxis,
          ]}
          initialZoom={[
            { axisId: 'x-axis', start: 40, end: 80 },
            { axisId: 'y-axis', start: 20, end: 89 },
          ]}
          slotProps={{ tooltip: { disablePortal: true } }}
          showToolbar
        />
      </Box>
      <div>
        <Typography variant="subtitle2" sx={{ pt: 2 }}>
          Zoom and pan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Explore data with greater detail by zooming in and panning across the chart.
        </Typography>
      </div>
    </Stack>
  );
}
