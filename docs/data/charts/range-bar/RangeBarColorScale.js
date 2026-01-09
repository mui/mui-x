import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';

const series = [
  {
    type: 'rangeBar',
    data: [
      [-2, 4],
      [4, 10],
      [-1, 3],
      [2, 13],
      [6, 7],
      [8, 12],
    ],
  },
];

export default function RangeBarColorScale() {
  const [colorX, setColorX] = React.useState('piecewise');

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
          <MenuItem value="ordinal">ordinal</MenuItem>
        </TextField>
      </Stack>

      <BarChartPremium
        height={300}
        grid={{ horizontal: true }}
        series={series}
        xAxis={[
          {
            data: [
              new Date(2019, 1, 1),
              new Date(2020, 1, 1),
              new Date(2021, 1, 1),
              new Date(2022, 1, 1),
              new Date(2023, 1, 1),
              new Date(2024, 1, 1),
            ],
            valueFormatter: (value) => value.getFullYear().toString(),
            colorMap:
              (colorX === 'ordinal' && {
                type: 'ordinal',
                colors: [
                  '#ccebc5',
                  '#a8ddb5',
                  '#7bccc4',
                  '#4eb3d3',
                  '#2b8cbe',
                  '#08589e',
                ],
              }) ||
              (colorX === 'continuous' && {
                type: 'continuous',
                min: new Date(2019, 1, 1),
                max: new Date(2024, 1, 1),
                color: ['green', 'orange'],
              }) ||
              (colorX === 'piecewise' && {
                type: 'piecewise',
                thresholds: [new Date(2021, 1, 1), new Date(2023, 1, 1)],
                colors: ['blue', 'red', 'blue'],
              }) ||
              undefined,
          },
        ]}
        margin={{ left: 0 }}
      />
      <HighlightedCode
        code={[
          `<BarChart`,
          '  /* ... */',
          // ColorX
          ...(colorX === 'None' ? ['  xAxis={[{}]}'] : []),
          ...(colorX === 'ordinal'
            ? [
                '  xAxis={[{',
                `    colorMap: {`,
                `      type: 'ordinal',`,
                `      colors: ['#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#08589e']`,
                `    }`,
                '  }]}',
              ]
            : []),
          ...(colorX === 'continuous'
            ? [
                '  xAxis={[{',
                `    colorMap: {`,
                `      type: 'continuous',`,
                `      min: new Date(2019, 1, 1),`,
                `      max: new Date(2024, 1, 1),`,
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
                `      thresholds: [new Date(2021, 1, 1), new Date(2023, 1, 1)],`,
                `      colors: ['blue', 'red', 'blue'],`,
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
