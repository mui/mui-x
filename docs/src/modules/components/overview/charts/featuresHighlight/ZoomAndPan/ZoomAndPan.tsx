import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { chartsToolbarClasses } from '@mui/x-charts/Toolbar';
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
    <Stack
      spacing={1}
      direction="column"
      sx={[
        {
          height: '100%',
          minHeight: 0,
        },
        ...(Array.isArray(sxColors) ? sxColors : [sxColors]),
      ]}
    >
      <div>
        <Typography variant="subtitle2">Zoom, pan and export</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Find the right frame for your data analysis
        </Typography>
      </div>
      <Box sx={{ flex: '1 1 0', minHeight: { xs: 250, xl: 0 }, width: '100%' }}>
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
          slotProps={{
            legend: {
              direction: 'horizontal',
              position: { horizontal: 'start', vertical: 'bottom' },
            },
            tooltip: { disablePortal: true },
          }}
          showToolbar
          sx={(theme) => ({
            minHeight: 0,
            '&:has(.MuiChartsToolbar-root)': {
              gridTemplateAreas: `"chart chart" "legend toolbar"`,
              gridTemplateColumns: '1fr auto',
              gridTemplateRows: 'minmax(0, 1fr) auto',
              columnGap: theme.spacing(1),
              rowGap: theme.spacing(0.5),
            },
            [`& .${legendClasses.root}`]: {
              alignSelf: 'end',
              justifySelf: 'start',
              m: 0,
              gap: 1.25,
              overflow: 'hidden',
            },
            [`& .${legendClasses.series}`]: {
              gap: 0.75,
            },
            [`& .${legendClasses.label}`]: {
              fontWeight: 600,
            },
            [`& .${chartsToolbarClasses.root}`]: {
              alignSelf: 'end',
              border: 0,
              borderRadius: 0,
              gap: 0.25,
              justifySelf: 'end',
              m: 0,
              minHeight: 30,
              p: 0,
              transform: 'translateY(4px)',
            },
            [`& .${chartsToolbarClasses.root} .MuiButtonBase-root`]: {
              minHeight: 30,
              minWidth: 32,
              p: 0.625,
            },
            [`& .${chartsToolbarClasses.root} .MuiSvgIcon-root`]: {
              fontSize: theme.typography.pxToRem(21),
              transform: 'translateY(4px)',
            },
          })}
        />
      </Box>
    </Stack>
  );
}
