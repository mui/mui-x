import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { HighlightedCode } from '@mui/docs/HighlightedCode';

import { Chance } from 'chance';

const POINTS_NUMBER = 50;
const chance = new Chance(42);

export default function ColorScale() {
  const [colorX, setColorX] = React.useState('piecewise');
  const [colorY, setColorY] = React.useState('None');
  const [colorZ, setColorZ] = React.useState('None');

  return (
    <Stack direction="column" spacing={1} sx={{ width: '100%', maxWidth: 600 }}>
      <Stack direction="row" spacing={1}>
        <TextField
          select
          sx={{ minWidth: 150 }}
          label="x-axis colorMap"
          value={colorX}
          onChange={(event) => setColorX(event.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="piecewise">piecewise</MenuItem>
          <MenuItem value="continuous">continuous</MenuItem>
        </TextField>
        <TextField
          select
          sx={{ minWidth: 150 }}
          label="y-axis colorMap"
          value={colorY}
          onChange={(event) => setColorY(event.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="piecewise">piecewise</MenuItem>
          <MenuItem value="continuous">continuous</MenuItem>
        </TextField>
        <TextField
          select
          sx={{ minWidth: 150 }}
          label="z-axis colorMap"
          value={colorZ}
          onChange={(event) => setColorZ(event.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="piecewise">piecewise</MenuItem>
          <MenuItem value="continuous">continuous</MenuItem>
          <MenuItem value="ordinal">ordinal</MenuItem>
        </TextField>
      </Stack>

      <ScatterChart
        height={300}
        grid={{ horizontal: true, vertical: true }}
        series={series}
        margin={{
          top: 10,
          bottom: 20,
        }}
        yAxis={[
          {
            min: -3,
            max: 3,
            tickInterval: [-3, -1.5, 0, 1.5, 3],
            colorMap:
              (colorY === 'continuous' && {
                type: 'continuous',
                min: -2,
                max: 2,
                color: ['blue', 'red'],
              }) ||
              (colorY === 'piecewise' && {
                type: 'piecewise',
                thresholds: [-1.5, 0, 1.5],
                colors: ['lightblue', 'blue', 'orange', 'red'],
              }) ||
              undefined,
          },
        ]}
        xAxis={[
          {
            min: -3,
            max: 3,
            tickInterval: [-3, -1.5, 0, 1.5, 3],
            colorMap:
              (colorX === 'continuous' && {
                type: 'continuous',
                min: -2,
                max: 2,
                color: ['green', 'orange'],
              }) ||
              (colorX === 'piecewise' && {
                type: 'piecewise',
                thresholds: [-1.5, 0, 1.5],
                colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
              }) ||
              undefined,
          },
        ]}
        zAxis={[
          {
            data:
              colorZ === 'ordinal'
                ? [
                    ...[...Array(POINTS_NUMBER)].map(() => 'A'),
                    ...[...Array(POINTS_NUMBER)].map(() => 'B'),
                    ...[...Array(POINTS_NUMBER)].map(() => 'C'),
                    ...[...Array(POINTS_NUMBER)].map(() => 'D'),
                  ]
                : undefined,
            colorMap:
              (colorZ === 'continuous' && {
                type: 'continuous',
                min: -2,
                max: 2,
                color: ['green', 'orange'],
              }) ||
              (colorZ === 'piecewise' && {
                type: 'piecewise',
                thresholds: [-1.5, 0, 1.5],
                colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
              }) ||
              (colorZ === 'ordinal' && {
                type: 'ordinal',
                values: ['A', 'B', 'C', 'D'],
                colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
              }) ||
              undefined,
          },
        ]}
      />
      <HighlightedCode
        code={[
          `<ScatterChart`,
          '  /* ... */',
          '  series={[{ data: data.map(point => ({...point, z: point.x + point.y})) }]}',
          // ColorX
          ...(colorX === 'None' ? ['  xAxis={[{}]}'] : []),
          ...(colorX === 'continuous'
            ? [
                '  xAxis={[{',
                `    colorMap: {`,
                `      type: 'continuous',`,
                `      min: -2,`,
                `      max: 2,`,
                `      color: ['green', 'orange']`,
                `    }`,
                '  }]}',
              ]
            : []),
          ...(colorX === 'piecewise'
            ? [
                '  xAxis={[{',
                `    colorMap: {`,
                `      type: 'piecewise',`,
                `      thresholds: [-1.5, 0, 1.5],`,
                `      colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],`,
                `    }`,
                '  }]}',
              ]
            : []),
          // ColorY
          ...(colorY === 'None' ? ['  yAxis={[{}]}'] : []),
          ...(colorY === 'continuous'
            ? [
                '  yAxis={[{',
                `    colorMap: {`,
                `      type: 'continuous',`,
                `      min: -2,`,
                `      max: 2,`,
                `      color: ['blue', 'red']`,
                `    }`,
                '  }]}',
              ]
            : []),
          ...(colorY === 'piecewise'
            ? [
                '  yAxis={[{',
                `    colorMap: {`,
                `      type: 'piecewise',`,
                `      thresholds: [-1.5, 0, 1.5],`,
                `      colors: ['lightblue', 'blue', 'orange', 'red'],`,
                `    }`,
                '  }]}',
              ]
            : []),
          // ColorZ
          ...(colorZ === 'None' ? ['  zAxis={[{}]}'] : []),
          ...(colorZ === 'continuous'
            ? [
                '  zAxis={[{',
                `    colorMap: {`,
                `      type: 'continuous',`,
                `      min: -2,`,
                `      max: 2,`,
                `      color: ['green', 'orange'],`,
                `    }`,
                '  }]}',
              ]
            : []),
          ...(colorZ === 'piecewise'
            ? [
                '  zAxis={[{',
                `    colorMap: {`,
                `      type: 'piecewise',`,
                `      thresholds: [-1.5, 0, 1.5],`,
                `      colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],`,
                `    }`,
                '  }]}',
              ]
            : []),
          ...(colorZ === 'ordinal'
            ? [
                '  zAxis={[{',
                `    data: ['A', ..., 'B', ..., 'C', ..., 'D', ...],`,
                `    colorMap: {`,
                `      type: 'ordinal',`,
                `      values: ['A', 'B', 'C', 'D'],`,
                `      colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],`,
                `    }`,
                '  }]}',
              ]
            : []),
          `/>`,
        ].join('\n')}
        language="jsx"
        copyButtonHidden
      />
    </Stack>
  );
}

const series = [
  {
    data: [
      ...getGaussianSeriesData([-1, -1]),
      ...getGaussianSeriesData([-1, 1]),
      ...getGaussianSeriesData([1, 1]),
      ...getGaussianSeriesData([1, -1]),
    ],
  },
].map((s) => ({
  ...s,
  valueFormatter: (v) => `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`,
}));

function getGaussianSeriesData(mean, stdev = [0.5, 0.5], N = 50) {
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
    return { x, y, z: x + y, id: i };
  });
}
