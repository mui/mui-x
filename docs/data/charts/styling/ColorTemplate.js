import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const Dt = 100;
const series = [...Array(20)].map((_, seriesIndex) => {
  return {
    id: `series_${seriesIndex}`,
    type: 'scatter',
    data: [...Array(Dt)].map((x, i) => {
      const t = seriesIndex * Dt + i;
      return {
        x: t / Dt,
        y: Math.cos(t / Dt),
        id: i,
      };
    }),
  };
});
const categories = {
  Category10: [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
  ],
  Accent: [
    '#7fc97f',
    '#beaed4',
    '#fdc086',
    '#ffff99',
    '#386cb0',
    '#f0027f',
    '#bf5b17',
    '#666666',
  ],
  Dark2: [
    '#1b9e77',
    '#d95f02',
    '#7570b3',
    '#e7298a',
    '#66a61e',
    '#e6ab02',
    '#a6761d',
    '#666666',
  ],
  Paired: [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
    '#b15928',
  ],
  Pastel1: [
    '#fbb4ae',
    '#b3cde3',
    '#ccebc5',
    '#decbe4',
    '#fed9a6',
    '#ffffcc',
    '#e5d8bd',
    '#fddaec',
    '#f2f2f2',
  ],
  Pastel2: [
    '#b3e2cd',
    '#fdcdac',
    '#cbd5e8',
    '#f4cae4',
    '#e6f5c9',
    '#fff2ae',
    '#f1e2cc',
    '#cccccc',
  ],
  Set1: [
    '#e41a1c',
    '#377eb8',
    '#4daf4a',
    '#984ea3',
    '#ff7f00',
    '#ffff33',
    '#a65628',
    '#f781bf',
    '#999999',
  ],
  Set2: [
    '#66c2a5',
    '#fc8d62',
    '#8da0cb',
    '#e78ac3',
    '#a6d854',
    '#ffd92f',
    '#e5c494',
    '#b3b3b3',
  ],
  Set3: [
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd',
    '#ccebc5',
    '#ffed6f',
  ],
  Tableau10: [
    '#4e79a7',
    '#f28e2c',
    '#e15759',
    '#76b7b2',
    '#59a14f',
    '#edc949',
    '#af7aa1',
    '#ff9da7',
    '#9c755f',
    '#bab0ab',
  ],
};

export default function ColorTemplate() {
  const [colorScheme, setColorScheme] = React.useState('Category10');

  return (
    <Stack direction="column" spacing={2}>
      <ScatterChart
        width={600}
        height={400}
        series={series}
        yAxis={[{ min: -1.5, max: 1.5 }]}
        colors={categories[colorScheme]}
      />
      <TextField
        select
        defaultValue="Category10"
        onChange={(event) => setColorScheme(event.target.value)}
      >
        {Object.entries(categories).map(([name, colors]) => (
          <MenuItem key={name} value={name}>
            <Stack direction="row" alignItems="center">
              <Typography sx={{ mr: 2 }}>{name}</Typography>
              <div style={{ width: 200, height: 20 }}>
                {colors.map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: c,
                      display: 'inline-block',
                    }}
                  />
                ))}
              </div>
            </Stack>
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
