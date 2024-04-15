import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
// @ts-ignore
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';

import { Chance } from 'chance';

const chance = new Chance(42);

export default function ColorScaleNoSnap() {
  const [colorX, setColorX] = React.useState('piecewise');
  const [colorY, setColorY] = React.useState('None');

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
      />
      <HighlightedCode
        code={[
          `<ScatterChart`,
          '  /* ... */',
          // ColorX
          ...(colorX === 'None' ? ['  xAxis={[{}]}'] : []),
          ...(colorX === 'continuous'
            ? [
                '  xAxis={[',
                `    {`,
                `      type: 'continuous',`,
                `      min: -2,`,
                `      max: 2,`,
                `      color: ['green', 'orange']`,
                `    }`,
                '  ]}',
              ]
            : []),
          ...(colorX === 'piecewise'
            ? [
                '  xAxis={[{',
                `    type: 'piecewise',`,
                `    thresholds: [-1.5, 0, 1.5],`,
                `    colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],`,
                '  }]}',
              ]
            : []),
          // ColorY
          ...(colorY === 'None' ? ['  yAxis={[{}]}'] : []),
          ...(colorY === 'continuous'
            ? [
                '  yAxis={[',
                `    {`,
                `      type: 'continuous',`,
                `      min: -2,`,
                `      max: 2,`,
                `      color: ['blue', 'red']`,
                `    }`,
                '  ]}',
              ]
            : []),
          ...(colorY === 'piecewise'
            ? [
                '  yAxis={[{',
                `    type: 'piecewise',`,
                `    thresholds: [-1.5, 0, 1.5],`,
                `    colors: ['lightblue', 'blue', 'orange', 'red'],`,
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

const series = [{ data: getGaussianSeriesData([0, 0], [1, 1], 200) }].map((s) => ({
  ...s,
  valueFormatter: (v) => `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`,
}));

function getGaussianSeriesData(mean, stdev = [0.3, 0.4], N = 50) {
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
