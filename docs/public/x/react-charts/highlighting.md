---
productId: x-charts
components: ChartsAxisHighlight
---

# Charts - Highlighting

Highlighting data offers quick visual feedback for chart users.

It can be used to emphasize a specific data point or series, or to fade out the rest of the chart.
And it can be controlled by the user or synchronized across multiple charts.

## Highlighting axis

You can highlight data based on mouse position.
By default, those highlights are lines, but it can also be a vertical band if your x-axis use `scaleType: 'band'`.

On the chart, to customize this behavior, you can use:

```jsx
axisHighlight={{
  x: 'line', // Or 'none', or 'band'
  y: 'line', // Or 'none'
}}
```

```tsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

const barChartsParams = {
  xAxis: [{ data: ['page A', 'page B', 'page C', 'page D', 'page E'] }],
  series: [
    { data: [2, 5, 3, 4, 1], stack: '1', label: 'Series x' },
    { data: [10, 3, 1, 2, 10], stack: '1', label: 'Series y' },
    { data: [10, 3, 1, 2, 10], stack: '1', label: 'Series z' },
  ],
  margin: { right: 10 },
  sx: {
    [`& .${legendClasses.root}`]: {
      display: 'none',
    },
  },
  height: 300,
};

export default function BandHighlight() {
  const [xHighlight, setXHightlight] = React.useState<'band' | 'none' | 'line'>(
    'band',
  );
  const [yHighlight, setYHightlight] = React.useState<'none' | 'line'>('none');

  const handleChange =
    (direction: 'x' | 'y') => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (direction === 'x') {
        setXHightlight(
          (event.target as HTMLInputElement).value as 'band' | 'none' | 'line',
        );
      }
      if (direction === 'y') {
        setYHightlight((event.target as HTMLInputElement).value as 'none' | 'line');
      }
    };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} sx={{ width: '100%', m: 2 }}>
      <div style={{ flexGrow: 1 }}>
        <BarChart
          {...barChartsParams}
          axisHighlight={{ x: xHighlight, y: yHighlight }}
        />
      </div>
      <Stack
        direction={{ xs: 'row', md: 'column' }}
        justifyContent={{ xs: 'space-around', md: 'flex-start' }}
        spacing={2}
        sx={{ m: 2 }}
      >
        <FormControl>
          <FormLabel id="x-highlight-label">x highlight</FormLabel>
          <RadioGroup
            aria-labelledby="x-highlight-label"
            value={xHighlight}
            onChange={handleChange('x')}
          >
            <FormControlLabel value="none" control={<Radio />} label="None" />
            <FormControlLabel value="line" control={<Radio />} label="Line" />
            <FormControlLabel value="band" control={<Radio />} label="Band" />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel id="y-highlight-label">y highlight</FormLabel>
          <RadioGroup
            aria-labelledby="y-highlight-label"
            value={yHighlight}
            onChange={handleChange('y')}
          >
            <FormControlLabel value="none" control={<Radio />} label="None" />
            <FormControlLabel value="line" control={<Radio />} label="Line" />
          </RadioGroup>
        </FormControl>
      </Stack>
    </Stack>
  );
}

```

## Highlighting series

In parallel with the tooltip, you can highlight and fade elements.

This kind of interaction is controlled by series properties `highlightScope` which contains two options:

- `highlighted` Indicates which item to highlight. Its value can be
  - `'none'` Do nothing (default one).
  - `'item'` Only highlight the item itself.
  - `'series'` Highlight all items of the series.
- `faded` Indicates which item to fade (if they are not already highlighted). Its value can be
  - `'none'` Do nothing (default one).
  - `'series'` Fade all the items of the series.
  - `'global'` Fade all the items of the chart.

:::info
For line chart, you can increase the interaction area by using slots.
Detailed explanations are available in a [dedicated line interaction demonstration](/x/react-charts/line-demo/#larger-interaction-area).
:::

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { BarChart } from '@mui/x-charts/BarChart';
import { AnimatedLineProps, LineChart } from '@mui/x-charts/LineChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { HighlightScope } from '@mui/x-charts/context';

const barChartsParams = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'A' },
    { data: [4, 3, 1, 5, 8], label: 'B' },
    { data: [4, 2, 5, 4, 1], label: 'C' },
  ],
  height: 400,
};
const lineChartsParams = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'A', area: false, stack: 'total' },
    { data: [4, 3, 1, 5, 8], label: 'B', area: false, stack: 'total' },
    { data: [4, 2, 5, 4, 1], label: 'C', area: false, stack: 'total' },
  ],
  xAxis: [{ data: [1, 2, 3, 4, 5], type: 'linear' }],
  height: 400,
};

const scatterChartsParams = {
  series: [
    {
      data: [
        { x: 6.5e-2, y: -1.3, id: 0 },
        { x: -2.1, y: -7.0e-1, id: 1 },
        { x: -7.6e-1, y: -6.7e-1, id: 2 },
        { x: -1.5e-2, y: -2.0e-1, id: 3 },
        { x: -1.4, y: -9.9e-1, id: 4 },
        { x: -1.1, y: -1.5, id: 5 },
        { x: -7.0e-1, y: -2.7e-1, id: 6 },
        { x: -5.1e-1, y: -8.8e-1, id: 7 },
        { x: -4.0e-3, y: -1.4, id: 8 },
        { x: -1.3, y: -2.2, id: 9 },
      ],
      label: 'A',
    },
    {
      data: [
        { x: 1.8, y: -1.7e-2, id: 0 },
        { x: 7.1e-1, y: 2.6e-1, id: 1 },
        { x: -1.2, y: 9.8e-1, id: 2 },
        { x: 2.0, y: -2.0e-1, id: 3 },
        { x: 9.4e-1, y: -2.7e-1, id: 4 },
        { x: -4.8e-1, y: -1.6e-1, id: 5 },
        { x: -1.5, y: 1.1, id: 6 },
        { x: 1.3, y: 3.4e-1, id: 7 },
        { x: -4.2e-1, y: 1.0e-1, id: 8 },
        { x: 5.4e-2, y: 4.0e-1, id: 9 },
      ],
      label: 'B',
    },
  ],
  height: 400,
};

const pieChartsParams = {
  series: [
    {
      data: [{ value: 5 }, { value: 10 }, { value: 15 }],
      label: 'Series 1',
      outerRadius: 80,
      highlight: { additionalRadius: 10 },
    },
    {
      data: [{ value: 5 }, { value: 10 }, { value: 15 }],
      label: 'Series 1',
      innerRadius: 90,
      highlight: { additionalRadius: 10 },
    },
  ],
  height: 400,
  margin: { top: 50, bottom: 50 },
};

function CustomLine(props: AnimatedLineProps) {
  const { d, ownerState, className, ...other } = props;

  return (
    <React.Fragment>
      <path
        d={d}
        stroke={
          ownerState.gradientId ? `url(#${ownerState.gradientId})` : ownerState.color
        }
        strokeWidth={ownerState.isHighlighted ? 4 : 2}
        strokeLinejoin="round"
        fill="none"
        filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
        opacity={ownerState.isFaded ? 0.3 : 1}
        className={className}
      />
      <path d={d} stroke="transparent" strokeWidth={25} fill="none" {...other} />
    </React.Fragment>
  );
}

export default function ElementHighlights() {
  const [chartType, setChartType] = React.useState('bar');
  const [withArea, setWithArea] = React.useState(false);
  const [highlight, setHighlight] = React.useState('item');
  const [fade, setFade] = React.useState('global');

  const handleChartType = (event: any, newChartType: string) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  return (
    <Stack
      direction={{ xs: 'column', xl: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartType}
          aria-label="chart type"
          fullWidth
        >
          {['bar', 'line', 'scatter', 'pie'].map((type) => (
            <ToggleButton key={type} value={type} aria-label="left aligned">
              {type}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {chartType === 'bar' && (
          <BarChart
            {...barChartsParams}
            series={barChartsParams.series.map((series) => ({
              ...series,
              highlightScope: {
                highlight,
                fade,
              } as HighlightScope,
            }))}
          />
        )}

        {chartType === 'line' && (
          <LineChart
            {...lineChartsParams}
            series={lineChartsParams.series.map((series) => ({
              ...series,
              area: withArea,
              highlightScope: {
                highlight,
                fade,
              } as HighlightScope,
            }))}
            slots={withArea ? {} : { line: CustomLine }}
          />
        )}

        {chartType === 'scatter' && (
          <ScatterChart
            {...scatterChartsParams}
            series={scatterChartsParams.series.map((series) => ({
              ...series,
              highlightScope: {
                highlight,
                fade,
              } as HighlightScope,
            }))}
          />
        )}

        {chartType === 'pie' && (
          <PieChart
            {...pieChartsParams}
            series={pieChartsParams.series.map((series) => ({
              ...series,
              highlightScope: {
                highlight,
                fade,
              } as HighlightScope,
            }))}
          />
        )}
      </Box>
      <Stack
        direction={{ xs: 'row', xl: 'column' }}
        spacing={3}
        justifyContent="center"
        flexWrap="wrap"
        useFlexGap
      >
        <TextField
          select
          label="highlight"
          value={highlight}
          onChange={(event) => setHighlight(event.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'item'}>item</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
        </TextField>
        <TextField
          select
          label="fade"
          value={fade}
          onChange={(event) => setFade(event.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
          <MenuItem value={'global'}>global</MenuItem>
        </TextField>
        {chartType === 'line' && (
          <FormControlLabel
            control={
              <Switch
                checked={withArea}
                onChange={(event) => setWithArea(event.target.checked)}
              />
            }
            label="Fill line area"
          />
        )}
      </Stack>
    </Stack>
  );
}

```

## Controlled item highlight

The highlighted item can be controlled by using `highlightedItem` and `onHighlightChange`.

You can set the `highlightedItem` value based on inputs, and sync it when the user hover over an item themselves.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { HighlightItemData, HighlightScope } from '@mui/x-charts/context';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

export default function ControlledHighlight() {
  const [highlightedItem, setHighLightedItem] =
    React.useState<HighlightItemData | null>({
      seriesId: 'A',
      dataIndex: 0,
    });
  const [highlight, setHighlight] = React.useState('item');
  const [fade, setFade] = React.useState('global');

  const handleHighLightedSeries = (event: any, newHighLightedSeries: string) => {
    if (newHighLightedSeries !== null) {
      setHighLightedItem((prev) => ({
        ...prev,
        seriesId: newHighLightedSeries,
      }));
    }
  };

  const handleHighLightedItem = (event: any) => {
    setHighLightedItem((prev) => ({
      seriesId: 'A',
      ...prev,
      dataIndex: Number(event.target.value),
    }));
  };

  return (
    <Stack
      direction={{ xs: 'column', xl: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Stack spacing={2} alignItems={'center'}>
          <ToggleButtonGroup
            value={highlightedItem?.seriesId ?? null}
            exclusive
            onChange={handleHighLightedSeries}
            aria-label="highlighted series"
            fullWidth
          >
            {['A', 'B'].map((type) => (
              <ToggleButton key={type} value={type} aria-label="left aligned">
                Series {type}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <FormControl>
            <FormLabel id="item-id-radio-group">Item ID</FormLabel>
            <RadioGroup
              aria-labelledby="item-id-radio-group"
              name="radio-buttons-group"
              value={highlightedItem?.dataIndex ?? null}
              onChange={handleHighLightedItem}
              row
            >
              <FormControlLabel value="0" control={<Radio />} label="0" />
              <FormControlLabel value="1" control={<Radio />} label="1" />
              <FormControlLabel value="2" control={<Radio />} label="2" />
              <FormControlLabel value="3" control={<Radio />} label="3" />
              <FormControlLabel value="4" control={<Radio />} label="4" />
            </RadioGroup>
          </FormControl>
        </Stack>
        <BarChart
          {...barChartsProps}
          series={barChartsProps.series.map((series) => ({
            ...series,
            highlightScope: {
              highlight,
              fade,
            } as HighlightScope,
          }))}
          highlightedItem={highlightedItem}
          onHighlightChange={setHighLightedItem}
        />
      </Box>
      <Stack
        direction={{ xs: 'row', xl: 'column' }}
        spacing={3}
        justifyContent="center"
        flexWrap="wrap"
        useFlexGap
      >
        <TextField
          select
          label="highlighted"
          value={highlight}
          onChange={(event) => setHighlight(event.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'item'}>item</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
        </TextField>
        <TextField
          select
          label="faded"
          value={fade}
          onChange={(event) => setFade(event.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
          <MenuItem value={'global'}>global</MenuItem>
        </TextField>
      </Stack>
    </Stack>
  );
}

const barChartsProps: BarChartProps = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'A', id: 'A' },
    { data: [4, 3, 1, 5, 8], label: 'B', id: 'B' },
  ],
  height: 400,
};

```

## Controlled axis highlight

The highlighted axis item can be controlled by using `highlightedAxis` prop.
Its value is an array of `{ axisId: string, dataIndex: number }` objects.
An empty array means no highlight.

The `onHighlightedAxisChange` handler is triggered each time the pointer crosses the boundaries between two axis values.
Its parameter is an array of one `{ axisId, dataIndex }` object per axis.
Axes without a `data` property are ignored by the handler.

:::warning
The `onHighlightedAxisChange` can be triggered at a high frequency when the user moves their pointer over the chart.

To avoid performance issues, avoid re-creating objects that are passed to props on every render.
Prefer defining them outside the component, or memoizing them.

This suggestion is especially useful for axes and series which, when updated, impact a lot of computation.

```jsx
// ❌ The chart gets a new axis on each render, leading to useless computation.
const Component = () => <BarChart xAxis={[{ data: [1, 2, 3]}]}>

// ✅ For static settings, define them outside the component.
const quarterAxis = [{ data: ['Q1', 'Q2', 'Q3', 'Q4'] }];
const Component = () => <BarChart xAxis={quarterAxis}>

// ✅ For dynamic settings, memoize them.
const Component = ({ data }) => {
  const axis = React.useMemo(() => [{ data }], [data]);
  return <BarChart xAxis={quarterAxis}>
}
```

:::

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { AxisItemIdentifier } from '@mui/x-charts/models';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';

export default function ControlledAxisHighlight() {
  const [highlightedAxis, setHighlightedAxis] = React.useState<AxisItemIdentifier[]>(
    [
      {
        axisId: 'x-axis',
        dataIndex: 2,
      },
    ],
  );

  const handleAxisHighlight = (event: any) => {
    setHighlightedAxis([
      {
        axisId: 'x-axis',
        dataIndex: Number(event.target.value),
      },
    ]);
  };

  return (
    <Stack spacing={2} alignItems={'center'} sx={{ width: '100%' }}>
      <FormControl>
        <FormLabel id="axis-index-radio-group">Highlighted index</FormLabel>
        <RadioGroup
          aria-labelledby="axis-index-radio-group"
          name="radio-buttons-group"
          value={highlightedAxis[0]?.dataIndex ?? null}
          onChange={handleAxisHighlight}
          row
        >
          <FormControlLabel value="0" control={<Radio />} label="0" />
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
          <FormControlLabel value="3" control={<Radio />} label="3" />
          <FormControlLabel value="4" control={<Radio />} label="4" />
        </RadioGroup>
      </FormControl>
      <Box sx={{ width: '100%' }}>
        <BarChart
          {...barChartsProps}
          highlightedAxis={highlightedAxis}
          onHighlightedAxisChange={(newState) => setHighlightedAxis(newState)}
        />
        <LineChart
          {...lineChartsProps}
          highlightedAxis={highlightedAxis}
          onHighlightedAxisChange={(newState) => setHighlightedAxis(newState)}
        />
      </Box>
    </Stack>
  );
}

const barChartsProps: BarChartProps = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'series A', id: 'A' },
    { data: [4, 3, 1, 5, 8], label: 'series B', id: 'B' },
  ],
  xAxis: [{ id: 'x-axis', scaleType: 'band', data: [0, 2, 5, 10, 20] }],
  height: 300,
};

const lineChartsProps: LineChartProps = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'series A', id: 'A' },
    { data: [4, 3, 1, 5, 8], label: 'series B', id: 'B' },
  ],
  xAxis: [{ id: 'x-axis', scaleType: 'linear', data: [0, 2, 5, 10, 20] }],
  height: 300,
};

```

## Synchronizing highlights

Having a controlled highlight allows you to control it in multiple charts at the same time.
You need to ensure that the `series` has the same `ids` and the data is in the same order.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { HighlightItemData } from '@mui/x-charts/context';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { PieChart, PieChartProps } from '@mui/x-charts/PieChart';

export default function SyncHighlight() {
  const [highlightedItem, setHighLightedItem] =
    React.useState<HighlightItemData | null>(null);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <BarChart
        {...barChartsProps}
        highlightedItem={highlightedItem}
        onHighlightChange={setHighLightedItem}
      />
      <PieChart
        {...pieChartProps}
        highlightedItem={highlightedItem}
        onHighlightChange={setHighLightedItem}
      />
    </Stack>
  );
}

const barChartsProps: BarChartProps = {
  series: [
    {
      data: [3, 4, 1, 6, 5],
      id: 'sync',
      highlightScope: { highlight: 'item', fade: 'global' },
    },
  ],
  xAxis: [{ data: ['A', 'B', 'C', 'D', 'E'] }],
  height: 200,
  hideLegend: true,
};

const pieChartProps: PieChartProps = {
  series: [
    {
      id: 'sync',
      data: [
        { value: 3, label: 'A', id: 'A' },
        { value: 4, label: 'B', id: 'B' },
        { value: 1, label: 'C', id: 'C' },
        { value: 6, label: 'D', id: 'D' },
        { value: 5, label: 'E', id: 'E' },
      ],
      highlightScope: { highlight: 'item', fade: 'global' },
    },
  ],
  height: 150,
  hideLegend: true,
};

```
