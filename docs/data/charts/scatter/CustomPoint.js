import * as React from 'react';
import { Box } from '@mui/material';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import dataset2020 from './big-mac-2020.json';
import dataset2010 from './big-mac-2010.json';

export default function CustomPoint() {
  return (
    <Box sx={{ width: '100%' }}>
      <ScatterChart
        height={300}
        voronoiMaxRadius={10}
        yAxis={[{ label: 'Big Mac price ($)' }]}
        xAxis={[{ label: 'GDP per captia ($)', scaleType: 'log' }]}
        series={[
          {
            label: '2010',
            data: dataset2010.map((v) => ({
              x: v.GDP_dollar,
              y: v.BigMac_dollar,
              id: v.countryCode,
              country: v.countryName,
            })),
            valueFormatter: ({ x, y, id, country }) =>
              `${country}: ${y.toFixed(2)}$`,
            highlightScope: { highlighted: 'item', faded: 'global' },
          },
          {
            label: '2020',
            data: dataset2020.map((v) => ({
              x: v.GDP_dollar,
              y: v.BigMac_dollar,
              id: v.countryCode,
              country: v.countryName,
            })),
            valueFormatter: ({ x, y, id, country }) =>
              `${country}: ${y.toFixed(2)}$`,
            highlightScope: { highlighted: 'item', faded: 'global' },
          },
        ]}
      />
    </Box>
  );
}
