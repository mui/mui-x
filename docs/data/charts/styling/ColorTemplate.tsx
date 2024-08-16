import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ScatterValueType } from '@mui/x-charts/models';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Chance } from 'chance';

const chance = new Chance(42);

function getGaussianSeriesData(
  mean: [number, number],
  stdev: [number, number] = [0.3, 0.4],
  N: number = 50,
) {
  return [...Array(N)].map((_, i) => {
    const x =
      Math.sqrt(-2.0 * Math.log(1 - chance.floating({ min: 0, max: 0.99 }))) *
        Math.cos(2.0 * Math.PI * chance.floating({ min: 0, max: 0.99 })) *
        stdev[0] +
      mean[0];
    const y =
      Math.sqrt(-2.0 * Math.log(1 - chance.floating({ min: 0, max: 0.99 }))) *
        Math.cos(2.0 * Math.PI * chance.floating({ min: 0, max: 0.99 })) *
        stdev[1] +
      mean[1];
    return { x, y, id: i };
  });
}

const legendPlacement = {
  slotProps: {
    legend: {
      position: {
        vertical: 'middle',
        horizontal: 'right',
      },
      direction: 'column',
      itemGap: 2,
    },
  },
  margin: {
    top: 20,
    right: 150,
    left: 20,
  },
} as const;
const series = [
  { label: 'Series 1', data: getGaussianSeriesData([-5, 0]) },
  { label: 'Series 2', data: getGaussianSeriesData([-4, 0]) },
  { label: 'Series 3', data: getGaussianSeriesData([-3, 0]) },
  { label: 'Series 4', data: getGaussianSeriesData([-2, 0]) },
  { label: 'Series 5', data: getGaussianSeriesData([-1, 0]) },
  { label: 'Series 6', data: getGaussianSeriesData([0, 0]) },
  { label: 'Series 7', data: getGaussianSeriesData([1, 0]) },
  { label: 'Series 8', data: getGaussianSeriesData([2, 0]) },
  { label: 'Series 9', data: getGaussianSeriesData([3, 0]) },
  { label: 'Series 10', data: getGaussianSeriesData([4, 0]) },
  { label: 'Series 11', data: getGaussianSeriesData([5, 0]) },
  { label: 'Series 12', data: getGaussianSeriesData([6, 0]) },
  { label: 'Series 13', data: getGaussianSeriesData([7, 0]) },
].map((s) => ({
  ...s,
  valueFormatter: (v: ScatterValueType) => `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`,
}));

const categories: { [key: string]: string[] } = {
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
    <Stack direction="column" spacing={2} sx={{ width: '100%', maxWidth: 600 }}>
      <ScatterChart
        height={400}
        series={series}
        yAxis={[{ min: -1.5, max: 1.5 }]}
        colors={categories[colorScheme]}
        {...legendPlacement}
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
