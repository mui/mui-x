/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { blackAndWhite, colorFull } from '../colors';
import GoolgeStock from './GOOGL.json';
import MetaStock from './META.json';
import { valueFormatter } from 'docsx/data/charts/dataset/weather';

const dataset: { google?: number; meta?: number; date: string }[] = GoolgeStock.map(
  ({ date, close }) => ({ date, google: close }),
);

let datasetIndex = 0;
let metaIndex = 0;

while (datasetIndex < dataset.length && metaIndex < MetaStock.length) {
  const metaItem = MetaStock[metaIndex];
  const dataItem = dataset[datasetIndex];

  if (metaItem.date === dataItem.date) {
    dataset[datasetIndex].meta = metaItem.close;
    datasetIndex += 1;
    metaIndex += 1;
  } else if (metaItem.date < dataItem.date) {
    dataset.splice(datasetIndex, 0, { date: metaItem.date, meta: metaItem.close });
    datasetIndex += 1;
    metaIndex += 1;
  } else {
    datasetIndex += 1;
  }
}

const base = {
  google: dataset[0].google!,
  meta: dataset[0].meta!,
};
const formattedDataset = dataset.map((item) => ({
  date: new Date(item.date),
  google: item.google ? (100 * item.google) / base.google : null,
  meta: item.meta ? (100 * item.meta) / base.meta : null,
}));

export default function ZoomAndPan() {
  return (
    <Stack
      spacing={1}
      sx={{
        '--palette-color-0': blackAndWhite[0],
        '--palette-color-1': blackAndWhite[1],
        '--palette-color-2': blackAndWhite[2],
        '--palette-color-3': blackAndWhite[3],
        '--palette-color-4': blackAndWhite[4],
        '--palette-color-5': blackAndWhite[5],
        '--palette-color-6': blackAndWhite[6],

        '&:hover': {
          '--palette-color-0': colorFull[0],
          '--palette-color-1': colorFull[1],
          '--palette-color-2': colorFull[2],
          '--palette-color-3': colorFull[3],
          '--palette-color-4': colorFull[4],
          '--palette-color-5': colorFull[5],
          '--palette-color-6': colorFull[6],
        },
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          mb: 2,
          width: '100%',
          height: '100%',
        }}
      >
        <LineChartPro
          color={['var(--palette-colo-0)', 'var(--palette-colo-4)']}
          dataset={formattedDataset}
          series={[
            { label: 'Google', dataKey: 'google', showMark: false },
            { label: 'Meta', dataKey: 'meta', showMark: false },
          ]}
          margin={{ left: 0, right: 0, bottom: 0, top: 20 }}
          xAxis={[
            { id: 'x-axis', scaleType: 'time', dataKey: 'date', zoom: true, domainLimit: 'strict' },
          ]}
          yAxis={[{ id: 'y-axis', zoom: true, width: 40, tickNumber: 4, min: 80, max: 200 }]}
          initialZoom={[
            { axisId: 'x-axis', start: 40, end: 80 },
            { axisId: 'y-axis', start: 20, end: 89 },
          ]}
        />
      </Box>
      <Typography variant="subtitle2" sx={{ pt: 2 }}>
        Zoom and pan
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Explore data with greater detail by zooming in and panning across the chart.
      </Typography>
    </Stack>
  );
}
