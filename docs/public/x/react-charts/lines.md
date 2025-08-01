---
title: React Line chart
productId: x-charts
components: LineChart, LineChartPro, LineElement, LineHighlightElement, LineHighlightPlot, LinePlot, MarkElement, MarkPlot, AreaElement, AreaPlot, AnimatedLine, AnimatedArea, ChartsGrid
---

# Charts - Lines

Line charts can express qualities about data, such as hierarchy, highlights, and comparisons.

## Basics

### Data format

Line charts series should contain a `data` property containing an array of numbers.
This `data` array corresponds to y-values.

You can specify x-values with the `xAxis` prop.
This axis can have any `scaleType` and its `data` should have the same length as your series.

By default, those y-values will be associated with integers starting from 0 (0, 1, 2, 3, ...).

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function BasicLineChart() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
        },
      ]}
      height={300}
    />
  );
}

```

### Using a dataset

If your data is stored in an array of objects, you can use the `dataset` helper prop.
It accepts an array of objects such as `dataset={[{x: 1, y: 32}, {x: 2, y: 41}, ...]}`.

You can reuse this data when defining the series and axis, thanks to the `dataKey` property.

For example `xAxis={[{ dataKey: 'x'}]}` or `series={[{ dataKey: 'y'}]}`.

Here is a plot of the evolution of world electricity production by source.

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  worldElectricityProduction,
  keyToLabel,
  colors,
} from './worldElectricityProduction';

const stackStrategy = {
  stack: 'total',
  area: true,
  stackOffset: 'none', // To stack 0 on top of others
} as const;

const customize = {
  height: 350,
  hideLegend: true,
};

export default function LineDataset() {
  return (
    <LineChart
      xAxis={[
        {
          dataKey: 'year',
          valueFormatter: (value: number) => value.toString(),
          min: 1985,
          max: 2022,
        },
      ]}
      yAxis={[{ width: 50 }]}
      series={Object.keys(keyToLabel).map((key) => ({
        dataKey: key,
        label: keyToLabel[key],
        color: colors[key],
        showMark: false,
        ...stackStrategy,
      }))}
      dataset={worldElectricityProduction}
      {...customize}
    />
  );
}

```

### Area

You can fill the area of the line by setting the series' `area` property to `true`.

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function BasicArea() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
          area: true,
        },
      ]}
      height={300}
    />
  );
}

```

### Stacking

Each line series can get a `stack` property which expects a string value.
Series with the same `stack` will be stacked on top of each other.

You can use the `stackOffset` and `stackOrder` properties to define how the series will be stacked.
By default, they are stacked in the order you defined them, with positive values stacked above 0 and negative values stacked below 0.

For more information, see [stacking docs](/x/react-charts/stacking/).

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from './GDPperCapita';

export default function StackedAreas() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart
        dataset={dataset}
        xAxis={[
          {
            id: 'Years',
            dataKey: 'date',
            scaleType: 'time',
            valueFormatter: (date) => date.getFullYear().toString(),
          },
        ]}
        yAxis={[{ width: 70 }]}
        series={[
          {
            id: 'France',
            label: 'French GDP per capita',
            dataKey: 'fr',
            stack: 'total',
            area: true,
            showMark: false,
          },
          {
            id: 'Germany',
            label: 'German GDP per capita',
            dataKey: 'dl',
            stack: 'total',
            area: true,
            showMark: false,
          },
          {
            id: 'United Kingdom',
            label: 'UK GDP per capita',
            dataKey: 'gb',
            stack: 'total',
            area: true,
            showMark: false,
          },
        ]}
        experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
        height={300}
      />
    </div>
  );
}

```

### Axis domain

By default axes round their limits to match human readable values.
For example, if your data ranges from 2 to 195, the axis displays values from 0 to 200.
This behavior can be modified by the [axis property `domainLimit`](/x/react-charts/axis/#relative-axis-subdomain).

:::info
The current default behavior can lead to empty space on left/right of the line chart.
To fix that issue, future major version will default the x-axis domain limit to `'strict'`.

To test this behavior, add the `experimentalFeatures` prop to your chart with `preferStrictDomainInLineCharts: true` value.
You can also enable it globally using [theme default props](/material-ui/customization/theme-components/#theme-default-props)

```js
components: {
  MuiChartDataProvider: {
    defaultProps: {
       experimentalFeatures: { preferStrictDomainInLineCharts: true }
    },
  },
}
```

:::

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from './GDPperCapita';

export default function LineDefaultDomainLimit() {
  const [preferStrictDomainInLineCharts, setPreferStrictDomainInLineCharts] =
    React.useState(false);

  return (
    <Stack alignItems="center">
      <FormControlLabel
        checked={preferStrictDomainInLineCharts}
        control={
          <Checkbox
            onChange={(event) =>
              setPreferStrictDomainInLineCharts(event.target.checked)
            }
          />
        }
        label="Strict domain limit"
        labelPlacement="end"
      />

      <div style={{ width: '100%', maxWidth: 450 }}>
        <LineChart
          dataset={dataset.slice(2, dataset.length)}
          experimentalFeatures={{ preferStrictDomainInLineCharts }}
          xAxis={[
            {
              id: 'Years',
              dataKey: 'date',
              scaleType: 'time',
              valueFormatter: (date) => date.getFullYear().toString(),
            },
          ]}
          yAxis={[{ width: 70 }]}
          series={[
            {
              id: 'France',
              label: 'French GDP per capita',
              dataKey: 'fr',
              stack: 'total',
              area: true,
              showMark: false,
            },
            {
              id: 'Germany',
              label: 'German GDP per capita',
              dataKey: 'dl',
              stack: 'total',
              area: true,
              showMark: false,
            },
            {
              id: 'United Kingdom',
              label: 'UK GDP per capita',
              dataKey: 'gb',
              stack: 'total',
              area: true,
              showMark: false,
            },
          ]}
          height={300}
        />
      </div>
    </Stack>
  );
}

```

## Partial data

### Skip missing points

Line series can have fewer data points than the axis.
You can handle lines with partial data or data starting at different points by providing `null` values.

By default, the tooltip does not show series if they have no value.
To override this behavior, use the `valueFormatter` to return a string if the value is `null` or `undefined`.

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function DifferentLength() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15, 16] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
          valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
        },
        {
          data: [null, null, null, null, 5.5, 2, 8.5, 1.5, 5],
        },
        {
          data: [7, 8, 5, 4, null, null, 2, 5.5, 1],
          valueFormatter: (value) => (value == null ? '?' : value.toString()),
        },
      ]}
      height={200}
      margin={{ bottom: 10 }}
    />
  );
}

```

:::info
When series data length is smaller than the axis one, overflowing values are `undefined` and not `null`.

The following code plots a line for x between 2 and 4.

- For x<2, values are set to `null` and then not shown.
- For x>4, values are set to `undefined` and then not shown.

```jsx
<LineChart
  series={[{ data: [null, null, 10, 11, 12] }]}
  xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6] }]}
/>
```

:::

### Connect missing points

Line series accepts a `connectNulls` property which will continue the interpolation across points with a `null` value.
This property can link two sets of points, with `null` data between them.
However, it cannot extrapolate the curve before the first non-null data point or after the last one.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LineChart } from '@mui/x-charts/LineChart';

export default function ConnectNulls() {
  const [connectNulls, setConnectNulls] = React.useState(true);

  return (
    <Stack sx={{ width: '100%' }}>
      <FormControlLabel
        checked={connectNulls}
        control={
          <Checkbox onChange={(event) => setConnectNulls(event.target.checked)} />
        }
        label="connectNulls"
        labelPlacement="end"
      />
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15, 16, 18, 20] }]}
        series={[
          {
            data: [2, 5, 6.5, 3, 8, 10, 9.5, 2.5, 6, 10, 8],
          },
          {
            data: [null, null, 5.5, 2, null, null, 8.5, 1.5, 5],
            connectNulls,
            area: true,
          },
        ]}
        height={200}
        margin={{ bottom: 10 }}
        skipAnimation
      />
    </Stack>
  );
}

```

## Click event

Line charts provides multiple click handlers:

- `onAreaClick` for click on a specific area.
- `onLineClick` for click on a specific line.
- `onMarkClick` for click on a specific mark.
- `onAxisClick` for a click anywhere in the chart

They all provide the following signature.

```js
const clickHandler = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

import { LineChart } from '@mui/x-charts/LineChart';

import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { ChartsAxisData, LineItemIdentifier } from '@mui/x-charts/models';

const lineChartsParams = {
  series: [
    {
      id: 'series-1',
      data: [3, 4, 1, 6, 5],
      label: 'A',
      area: true,
      stack: 'total',
      highlightScope: {
        highlight: 'item',
      },
    },
    {
      id: 'series-2',
      data: [4, 3, 1, 5, 8],
      label: 'B',
      area: true,
      stack: 'total',
      highlightScope: {
        highlight: 'item',
      },
    },
    {
      id: 'series-3',
      data: [4, 2, 5, 4, 1],
      label: 'C',
      area: true,
      stack: 'total',
      highlightScope: {
        highlight: 'item',
      },
    },
  ],
  xAxis: [{ data: [0, 3, 6, 9, 12], scaleType: 'linear', id: 'axis1' }],
  height: 400,
} as const;

export default function LineClick() {
  const [itemData, setItemData] = React.useState<LineItemIdentifier>();
  const [axisData, setAxisData] = React.useState<ChartsAxisData | null>();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <LineChart
          {...lineChartsParams}
          onAreaClick={(event, d) => setItemData(d)}
          onMarkClick={(event, d) => setItemData(d)}
          onLineClick={(event, d) => setItemData(d)}
          onAxisClick={(event, d) => setAxisData(d)}
        />
      </Box>

      <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography>Click on the chart</Typography>
          <IconButton
            aria-label="reset"
            size="small"
            onClick={() => {
              setItemData(undefined);
              setAxisData(null);
            }}
          >
            <UndoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <HighlightedCode
          code={`// Data from item click
${itemData ? JSON.stringify(itemData, null, 2) : '// The data will appear here'}

// Data from axis click
${axisData ? JSON.stringify(axisData, null, 2) : '// The data will appear here'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}

```

:::info
Their is a slight difference between the `event` of `onAxisClick` and the others:

- For `onAxisClick` it's a native mouse event emitted by the svg component.
- For others, it's a React synthetic mouse event emitted by the area, line, or mark component.

:::

### Composition

If you're using composition, you can get those click event as follow.
Notice that the `onAxisClick` will handle both bar and line series if you mix them.

```jsx
<ChartContainer onAxisClick={onAxisClick}>
  {/* ... */}
  <LinePlot onItemClick={onLineClick} />
  <AreaPlot onItemClick={onAreaClick} />
</ChartContainer>
```

## Styling

### Grid

You can add a grid in the background of the chart with the `grid` prop.

See [Axis—Grid](/x/react-charts/axis/#grid) documentation for more information.

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from './basicDataset';

export default function GridDemo() {
  return (
    <LineChart
      dataset={dataset}
      xAxis={[{ dataKey: 'x' }]}
      series={[{ dataKey: 'y' }]}
      height={300}
      grid={{ vertical: true, horizontal: true }}
    />
  );
}

```

### Color scale

As with other charts, you can modify the [series color](/x/react-charts/styling/#colors) either directly, or with the color palette.

You can also modify the color by using axes `colorMap` which maps values to colors.
The line charts use by priority:

1. The y-axis color
2. The x-axis color
3. The series color

Learn more about the `colorMap` properties in the [Styling docs](/x/react-charts/styling/#values-color).

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { HighlightedCode } from '@mui/docs/HighlightedCode';

export default function ColorScale() {
  const [colorX, setColorX] = React.useState<
    'None' | 'piecewise' | 'continuous' | 'ordinal'
  >('None');
  const [colorY, setColorY] = React.useState<'None' | 'piecewise' | 'continuous'>(
    'piecewise',
  );

  return (
    <Stack direction="column" spacing={1} sx={{ width: '100%', maxWidth: 600 }}>
      <Stack direction="row" spacing={1}>
        <TextField
          select
          sx={{ minWidth: 150 }}
          label="x-axis colorMap"
          value={colorX}
          onChange={(event) =>
            setColorX(event.target.value as 'None' | 'piecewise' | 'continuous')
          }
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
          onChange={(event) =>
            setColorY(event.target.value as 'None' | 'piecewise' | 'continuous')
          }
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="piecewise">piecewise</MenuItem>
          <MenuItem value="continuous">continuous</MenuItem>
        </TextField>
      </Stack>

      <LineChart
        height={300}
        grid={{ horizontal: true }}
        series={[
          {
            data: [-2, -9, 12, 11, 6, -4],
            area: true,
          },
        ]}
        yAxis={[
          {
            colorMap:
              (colorY === 'continuous' && {
                type: 'continuous',
                min: -10,
                max: 10,
                color: ['red', 'green'],
              }) ||
              (colorY === 'piecewise' && {
                type: 'piecewise',
                thresholds: [0, 10],
                colors: ['red', 'green', 'blue'],
              }) ||
              undefined,
          },
        ]}
        xAxis={[
          {
            scaleType: 'time',
            data: [
              new Date(2019, 0, 1),
              new Date(2020, 0, 1),
              new Date(2021, 0, 1),
              new Date(2022, 0, 1),
              new Date(2023, 0, 1),
              new Date(2024, 0, 1),
            ],
            valueFormatter: (value) => value.getFullYear().toString(),
            colorMap:
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
      />
      <HighlightedCode
        code={[
          `<ScatterChart`,
          '  /* ... */',
          // ColorX
          ...(colorX === 'None' ? ['  xAxis={[{}]}'] : []),
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

          // ColorY
          ...(colorY === 'None' ? ['  yAxis={[{}]}'] : []),
          ...(colorY === 'continuous'
            ? [
                '  yAxis={[{',
                `    colorMap: {`,
                `      type: 'continuous',`,
                `      min: -10,`,
                `      max: 10,`,
                `      color: ['red', 'green'],`,
                `    }`,
                '  }]}',
              ]
            : []),
          ...(colorY === 'piecewise'
            ? [
                '  yAxis={[{',
                `    colorMap: {`,
                `      type: 'piecewise',`,
                `      thresholds: [0, 10],`,
                `      colors: ['red', 'green', 'blue'],`,
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

```

:::warning
For now, ordinal config is not supported for line chart.
:::

### Interpolation

The interpolation between data points can be customized by the `curve` property.
This property expects one of the following string values, corresponding to the interpolation method: `'catmullRom'`, `'linear'`, `'monotoneX'`, `'monotoneY'`, `'natural'`, `'step'`, `'stepBefore'`, `'stepAfter'`, `'bumpX'` and `'bumpY'`.

This series property adds the option to control the interpolation of a series.
Different series could even have different interpolations.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LineChart } from '@mui/x-charts/LineChart';

import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { CurveType } from '@mui/x-charts/models';

const curveTypes: CurveType[] = [
  'linear',
  'catmullRom',
  'monotoneX',
  'monotoneY',
  'natural',
  'step',
  'stepBefore',
  'stepAfter',
];

function getExample(curveType: CurveType) {
  return `<LineChart
  series={[
    { curve: "${curveType}", data: [1, 5, 2, 6, 3, 9.3] },
    { curve: "${curveType}", data: [6, 3, 7, 9.5, 4, 2] },
  ]}
  {/* ... */}
/>`;
}

export default function InterpolationDemo() {
  const [curveType, setCurveType] = React.useState(curveTypes[0]);

  return (
    <Box sx={{ p: 2, width: 1, maxWidth: 600 }}>
      <TextField
        select
        label="interpolation method"
        value={curveType}
        sx={{ minWidth: 200, mb: 2 }}
        onChange={(event) => setCurveType(event.target.value as CurveType)}
      >
        {curveTypes.map((curve) => (
          <MenuItem key={curve} value={curve}>
            {curve}
          </MenuItem>
        ))}
      </TextField>
      <LineChart
        xAxis={[{ data: [1, 3, 5, 6, 7, 9], min: 0, max: 10 }]}
        series={[
          { curve: curveType, data: [1, 5, 2, 6, 3, 9.3] },
          { curve: curveType, data: [6, 3, 7, 9.5, 4, 2] },
        ]}
        height={300}
        skipAnimation
      />
      <HighlightedCode code={getExample(curveType)} language="tsx" />
    </Box>
  );
}

```

#### Expanding steps

To simplify the composition of line and chart, the step interpolations (when `curve` property is `'step'`, `'stepBefore'`, or `'stepAfter'`) expand to cover the full band width.

You can disable this behavior with `strictStepCurve` series property.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';

const weekDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const stepCurves = ['step', 'stepBefore', 'stepAfter'];
type StepCurve = 'step' | 'stepBefore' | 'stepAfter';

export default function ExpandingStep() {
  const [strictStepCurve, setStrictStepCurve] = React.useState(false);
  const [connectNulls, setConnectNulls] = React.useState(false);
  const [curve, setCurve] = React.useState<StepCurve>('step');

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <FormControlLabel
            checked={connectNulls}
            control={
              <Checkbox
                onChange={(event) => setConnectNulls(event.target.checked)}
              />
            }
            label="connectNulls"
            labelPlacement="end"
          />
          <FormControlLabel
            checked={strictStepCurve}
            control={
              <Checkbox
                onChange={(event) => setStrictStepCurve(event.target.checked)}
              />
            }
            label="strictStepCurve"
            labelPlacement="end"
          />
        </Stack>
        <TextField
          select
          label="curve"
          value={curve}
          sx={{ minWidth: 100, mb: 2 }}
          onChange={(event) => setCurve(event.target.value as StepCurve)}
        >
          {stepCurves.map((curveType) => (
            <MenuItem key={curveType} value={curveType}>
              {curveType}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <ChartContainer
        xAxis={[{ scaleType: 'band', data: weekDay }]}
        series={[
          {
            type: 'line',
            curve,
            connectNulls,
            strictStepCurve,
            data: [5, 10, 16, 9, null, 6],
            showMark: true,
            color: 'blue',
          },
          {
            type: 'line',
            curve,
            connectNulls,
            strictStepCurve,
            data: [null, 15, 9, 6, 8, 3, 10],
            showMark: true,
            color: 'red',
          },
          {
            data: [1, 2, 3, 4, 3, 2, 1],
            type: 'bar',
          },
        ]}
        height={250}
        margin={{ bottom: 10 }}
        skipAnimation
      >
        <ChartsAxisHighlight x="band" />
        <BarPlot />
        <LinePlot />
        <MarkPlot />
        <ChartsXAxis />
        <ChartsYAxis />
      </ChartContainer>
    </Stack>
  );
}

```

### Baseline

The area chart draws a `baseline` on the Y axis `0`.
This is useful as a base value, but customized visualizations may require a different baseline.

To get the area filling the space above or below the line, set `baseline` to `"min"` or `"max"`.
It is also possible to provide a `number` value to fix the baseline at the desired position.

:::warning
The `baseline` should not be used with stacked areas, as it will not work as expected.
:::

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function AreaBaseline() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, -5.5, 2, -7.5, 1.5, 6],
          area: true,
          baseline: 'min',
        },
      ]}
      height={300}
    />
  );
}

```

### Optimization

To show mark elements, use `showMark` series property.
It accepts a boolean or a callback.
The next example shows how to use it to display only one mark every two data points.

When a value is highlighted, a mark is rendered for that given value.
If the charts already have some marks (due to `showMark=true`) the highlight one will be on top of others.

This behavior can be removed with the `disableHighlight` series property or at the root of the line chart with a `disableLineItemHighlight` prop.

In this example, you have one mark for every value with an even index.
The highlighted data has a mark regardless if it has an even or odd index.

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function MarkOptimization() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
      series={[
        {
          data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8],
          showMark: ({ index }) => index % 2 === 0,
        },
      ]}
      height={300}
    />
  );
}

```

### CSS

Line plots are made of three elements named `LineElement`, `AreaElement`, and `MarkElement`.
Each element can be selected with the CSS class name `.MuiLineElement-root`, `.MuiAreaElement-root`, or `.MuiMarkElement-root`.

If you want to select the element of a given series, you can use the `data-series` attribute.

In the next example, each line style is customized with dashes, and marks are removed.
The area of Germany's GDP also gets a custom gradient color.
The definition of `myGradient` is passed as a children of the chart component.

```jsx
<LineChart
  sx={{
    '& .MuiLineElement-root': {
      strokeDasharray: '10 5',
      strokeWidth: 4,
    },
    '& .MuiAreaElement-root[data-series="Germany"]': {
      fill: "url('#myGradient')",
    },
  }}
/>
```

```tsx
import * as React from 'react';
import {
  areaElementClasses,
  LineChart,
  lineElementClasses,
} from '@mui/x-charts/LineChart';
import { dataset } from './GDPperCapita';

export default function CSSCustomization() {
  return (
    <LineChart
      dataset={dataset}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          strokeDasharray: '10 5',
          strokeWidth: 4,
        },
        [`& .${areaElementClasses.root}[data-series="Germany"]`]: {
          fill: "url('#myGradient')",
          filter: 'none', // Remove the default filtering
        },
      }}
      xAxis={[
        {
          id: 'Years',
          dataKey: 'date',
          scaleType: 'time',
          valueFormatter: (date) => date.getFullYear().toString(),
        },
      ]}
      yAxis={[
        {
          width: 60,
        },
      ]}
      series={[
        {
          id: 'France',
          dataKey: 'fr',
          stack: 'total',
          area: true,
          showMark: false,
        },
        {
          id: 'Germany',
          dataKey: 'dl',
          stack: 'total',
          area: true,
          showMark: false,
        },
        {
          id: 'United Kingdom',
          dataKey: 'gb',
          stack: 'total',
          area: true,
          showMark: false,
        },
      ]}
      experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
      height={300}
    >
      <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(90)">
          <stop offset="5%" stopColor="gold" />
          <stop offset="95%" stopColor="red" />
        </linearGradient>
      </defs>
    </LineChart>
  );
}

```

## Animation

Chart containers respect [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion), but you can also disable animations manually by setting the `skipAnimation` prop to `true`.

When `skipAnimation` is enabled, the chart renders without any animations.

:::warning
If you support interactive ways to add or remove series from your chart, you have to provide the series' id.

Otherwise the chart will have no way to know if you are modifying, removing, or adding some series.
This will lead to strange behaviors.
:::

```jsx
// For a single component chart
<LineChart skipAnimation />

// For a composed chart
<ChartContainer>
  <LinePlot skipAnimation />
  <AreaPlot skipAnimation />
</ChartContainer>
```

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LineChart } from '@mui/x-charts/LineChart';
import { mangoFusionPalette } from '@mui/x-charts/colorPalettes';

const defaultSeries = [
  { id: '1', data: [4, 5, 1, 2, 3, 3, 2], area: true, stack: '1' },
  { id: '2', data: [7, 4, 6, 7, 2, 3, 5], area: true, stack: '1' },
  { id: '3', data: [6, 4, 1, 2, 6, 3, 3], area: true, stack: '1' },
  { id: '4', data: [4, 7, 6, 1, 2, 7, 7], area: true, stack: '1' },
  { id: '5', data: [2, 2, 1, 7, 1, 5, 3], area: true, stack: '1' },
  { id: '6', data: [6, 6, 1, 6, 7, 1, 1], area: true, stack: '1' },
  { id: '7', data: [7, 6, 1, 6, 4, 4, 6], area: true, stack: '1' },
  { id: '8', data: [4, 3, 1, 6, 6, 3, 5], area: true, stack: '1' },
  { id: '9', data: [7, 6, 2, 7, 4, 2, 7], area: true, stack: '1' },
].map((item, index) => ({
  ...item,
  color: mangoFusionPalette('light')[index],
}));

export default function LineAnimation() {
  const [series, setSeries] = React.useState(defaultSeries);
  const [nbSeries, setNbSeries] = React.useState(3);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <LineChart
          xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7] }]}
          series={[
            ...series.slice(0, Math.min(nbSeries, 8)),
            ...series.slice(8, 10),
          ]}
          skipAnimation={skipAnimation}
          height={400}
        />
      </div>
      <Stack spacing={1} direction="row" flexWrap="wrap">
        <Button
          variant="outlined"
          onClick={() =>
            setSeries((prev) =>
              prev.map((item) => ({
                ...item,
                data: item.data.map((v) => Math.max(0.5, v - 4 + 8 * Math.random())),
              })),
            )
          }
        >
          randomize
        </Button>
        <Button
          variant="outlined"
          onClick={() => setNbSeries((prev) => prev - 1)}
          disabled={nbSeries === 0}
        >
          remove
        </Button>
        <Button
          variant="outlined"
          onClick={() => setNbSeries((prev) => prev + 1)}
          disabled={nbSeries === 8}
        >
          add
        </Button>
        <FormControlLabel
          checked={skipAnimation}
          control={
            <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
          }
          label="skipAnimation"
          labelPlacement="end"
        />
      </Stack>
    </div>
  );
}

```

## Composition

Use the `<ChartDataProvider />` to provide `series`, `xAxis`, and `yAxis` props for composition.

In addition to the common chart components available for [composition](/x/react-charts/composition/), you can use the following components:

- `<AreaPlot />` renders the series areas.
- `<LinePlot />` renders the series lines.
- `<MarkPlot />` renders the series marks.
- `<LineHighlightPlot />` renders larger mark dots on the highlighted values.

Here's how the Line Chart is composed:

```jsx
<ChartDataProvider>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      <ChartsGrid />
      <g clipPath={`url(#${clipPathId})`}>
        {/* Elements clipped inside the drawing area. */}
        <AreaPlot />
        <LinePlot />
        <ChartsOverlay />
        <ChartsAxisHighlight />
      </g>
      <ChartsAxis />
      <g data-drawing-container>
        {/* Elements able to overflow the drawing area. */}
        <MarkPlot />
      </g>
      <LineHighlightPlot />
      <ChartsClipPath id={clipPathId} />
    </ChartsSurface>
    <ChartsTooltip />
  </ChartsWrapper>
</ChartDataProvider>
```

:::info
The `data-drawing-container` indicates that children of this element should be considered part of the drawing area, even if they overflow.

See [Composition—clipping](/x/react-charts/composition/#clipping) for more info.
:::
