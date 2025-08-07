---
title: React Radar chart
productId: x-charts
components: RadarChart, RadarChartPro, RadarGrid, RadarSeriesArea, RadarSeriesMarks, RadarSeriesPlot, RadarMetricLabels, RadarAxisHighlight
---

# Charts - Radar

Radar allows to compare multivariate data in a 2D chart.

## Basics

Radar charts series should contain a `data` property containing an array of values.

Radar charts also require a `radar` prop with a `metrics` property containing an array of string or objects.
Each item of this array define a metric of the radar.

```tsx
import * as React from 'react';
import { RadarChart } from '@mui/x-charts/RadarChart';

export default function BasicRadar() {
  return (
    <RadarChart
      height={300}
      series={[{ label: 'Lisa', data: [120, 98, 86, 99, 85, 65] }]}
      radar={{
        max: 120,
        metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
      }}
    />
  );
}

```

## Multi-series

You can plot multiple series on the same radar chart.

```tsx
import * as React from 'react';
import { RadarChart } from '@mui/x-charts/RadarChart';

// Data from https://ourworldindata.org/emissions-by-fuel

function valueFormatter(v: number | null) {
  if (v === null) {
    return 'NaN';
  }
  return `${v.toLocaleString()}t CO2eq/pers`;
}

export default function MultiSeriesRadar() {
  return (
    <RadarChart
      height={300}
      series={[
        { label: 'USA', data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12], valueFormatter },
        {
          label: 'Australia',
          data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
          valueFormatter,
        },
        {
          label: 'United Kingdom',
          data: [2.26, 0.29, 2.03, 0.05, 0.04, 0.06],
          valueFormatter,
        },
      ]}
      radar={{
        metrics: ['Oil', 'Coal', 'Gas', 'Flaring', 'Other\nindustry', 'Cement'],
      }}
    />
  );
}

```

## Series options

Radar series support `hideMark` and `fillArea` parameter to modify the rendering of the series.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RadarChart, RadarSeries } from '@mui/x-charts/RadarChart';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function DemoRadarVisualisation() {
  const [hideMark, setHideMark] = React.useState(false);
  const [fillArea, setFillArea] = React.useState(false);

  const withOptions = (series: RadarSeries[]) =>
    series.map((item) => ({ ...item, hideMark, fillArea }));

  return (
    <Box sx={{ width: '100%' }}>
      <Stack sx={{ width: '100%', mb: 2 }} direction="row" flexWrap="wrap" gap={2}>
        <FormControlLabel
          checked={!hideMark}
          control={
            <Checkbox onChange={(event) => setHideMark(!event.target.checked)} />
          }
          label="with mark"
          labelPlacement="end"
        />
        <FormControlLabel
          checked={fillArea}
          control={
            <Checkbox onChange={(event) => setFillArea(event.target.checked)} />
          }
          label="fill area"
          labelPlacement="end"
        />
      </Stack>
      <Stack
        sx={{ width: '100%' }}
        direction="row"
        flexWrap="wrap"
        justifyContent="space-around"
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <RadarChart
            {...commonSettings}
            series={withOptions([lisaGrades, bartGrades])}
          />
        </Box>
      </Stack>
    </Box>
  );
}

const commonSettings = {
  height: 300,
  radar: {
    max: 120,
    metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
  },
};
const lisaGrades = {
  label: 'Lisa',
  data: [120, 98, 86, 99, 85, 65],
  hideMark: false,
} satisfies RadarSeries;
const bartGrades = {
  label: 'Bart',
  data: [25, 34, 51, 16, 90, 20],
  hideMark: false,
} satisfies RadarSeries;

```

## Metrics

The `metrics` property of `radar` takes an array with one item per corner of the radar.
This item can either be:

- A string used as the axis label. The other properties are populated from the data.
- An object with the following properties:
  - `name`: The label associated to the axis.
  - `min`: The minimum value along this direction (by default 0).
  - `max`: The maximum value along this direction (by default the maximum value along this direction).

```tsx
import * as React from 'react';
import { RadarChart } from '@mui/x-charts/RadarChart';

export default function RadarAxis() {
  return (
    <RadarChart
      height={300}
      series={[{ label: 'Lisa', data: [120, 98, 86, 99, 85, 65] }]}
      radar={{
        metrics: [
          { name: 'Math', max: 120 },
          { name: 'Chinese', max: 120 },
          { name: 'English', max: 120 },
          { name: 'Geography', max: 120 },
          { name: 'Physics', max: 120 },
          { name: 'History', max: 120 },
        ],
      }}
    />
  );
}

```

## Grid

The radar chart displays a grid behind the series that can be configured with:

- `startAngle` The rotation angle of the entire chart in degrees.
- `divisions` The number of divisions of the grid.
- `shape` The grid shape that can be `circular` or `sharp`.
- `stripeColor` The callback that defines stripe colors. Set it to `null` to remove stripes.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { RadarChart } from '@mui/x-charts/RadarChart';

export default function DemoRadar() {
  const theme = useTheme();

  const stripeColorFunction = {
    default: undefined,
    'two-tones':
      theme.palette.mode === 'dark'
        ? (index: number) =>
            index % 2 === 0
              ? (theme.vars || theme).palette.primary.dark
              : (theme.vars || theme).palette.grey[300]
        : (index: number) =>
            index % 2 === 0
              ? (theme.vars || theme).palette.primary.light
              : (theme.vars || theme).palette.grey[800],
    null: null,
  };
  const stripeColorLines = {
    default: [],
    'two-tones':
      theme.palette.mode === 'dark'
        ? [
            `  stripeColor={(index:number) => index % 2 === 0 ? theme.palette.primary.dark : theme.palette.grey[300]}`,
          ]
        : [
            `  stripeColor={(index:number) => index % 2 === 0 ? theme.palette.primary.light : theme.palette.grey[800]}`,
          ],
    null: [`  stripeColor={null}`],
  };

  return (
    <ChartsUsageDemo
      componentName="RadarChart"
      data={{
        startAngle: {
          knob: 'number',
          defaultValue: 30,
          min: -180,
          max: 180,
        },
        divisions: {
          knob: 'number',
          defaultValue: 10,
          min: 0,
          max: 20,
        },
        shape: {
          knob: 'radio',
          options: ['sharp', 'circular'] as const,
          defaultValue: 'circular',
        },
        stripe: {
          knob: 'select',
          options: ['default', 'two-tones', 'null'] as const,
          defaultValue: 'default',
        },
      }}
      renderDemo={(props) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <RadarChart
            height={250}
            margin={{ top: 20 }}
            series={[{ data: [120, 98, 86, 99, 85, 65] }]}
            divisions={props.divisions}
            stripeColor={stripeColorFunction[props.stripe]}
            shape={props.shape}
            radar={{
              max: 120,
              startAngle: props.startAngle,
              metrics: [
                'Math',
                'Chinese',
                'English',
                'Geography',
                'Physics',
                'History',
              ],
            }}
          />
        </Box>
      )}
      getCode={({ props }) =>
        [
          `import { RadarChart } from '@mui/x-charts/RadarChart';`,
          '',
          `<RadarChart`,
          '  {/** ... */}',
          `  shape="${props.shape}"`,
          `  divisions={${props.divisions}}`,
          ...stripeColorLines[props.stripe],
          `  radar={{`,
          `    startAngle: ${props.startAngle},`,
          `    metrics: [...],`,
          '  }}',
          '/>',
        ].join('\n')
      }
    />
  );
}

```

## Highlight

### Axis highlight

By default the radar highlight values of a same axis.
With composition you can add this behavior with the `<RadarAxisHighlight />` component.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RadarChart, RadarSeries } from '@mui/x-charts/RadarChart';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function DemoRadarAxisHighlight() {
  const [hideMark, setHideMark] = React.useState(true);

  const withHideMark = (series: RadarSeries[]) =>
    series.map((item) => ({ ...item, hideMark }));

  return (
    <Box sx={{ width: '100%' }}>
      <Stack sx={{ width: '100%', mb: 2 }} direction="row" flexWrap="wrap" gap={2}>
        <FormControlLabel
          checked={!hideMark}
          control={
            <Checkbox onChange={(event) => setHideMark(!event.target.checked)} />
          }
          label="with mark"
          labelPlacement="end"
        />
      </Stack>
      <Stack
        sx={{ width: '100%' }}
        direction="row"
        flexWrap="wrap"
        justifyContent="space-around"
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <RadarChart
            {...commonSettings}
            series={withHideMark([lisaGrades, bartGrades])}
          />
        </Box>
      </Stack>
    </Box>
  );
}

const commonSettings = {
  height: 300,
  radar: {
    max: 120,
    metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
  },
};
const lisaGrades = {
  label: 'Lisa',
  data: [120, 98, 86, 99, 85, 65],
  hideMark: false,
} satisfies RadarSeries;
const bartGrades = {
  label: 'Bart',
  data: [25, 34, 51, 16, 90, 20],
  hideMark: false,
} satisfies RadarSeries;

```

### Series highlight

To set the highlight on series, use the `highlight` prop with `'series'` value.
This highlight can be controlled with `highlightedItem` value and `onHighlightChange` callback.

With composition you can pass those props to the `RadarDataProvider`.

This demo shows a controlled highlight.
Notice the impact of the series order in the highlight interaction.
The UK series is the last item of the `series` prop.
Such that its area renders on top of the others.
Otherwise, the other area would catch the pointer event, making it impossible to highlight it.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { RadarChart, RadarSeries } from '@mui/x-charts/RadarChart';
import { HighlightItemData } from '@mui/x-charts/context';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function valueFormatter(v: number | null) {
  if (v === null) {
    return 'NaN';
  }
  return `${v.toLocaleString()}t CO2eq/pers`;
}

export default function DemoRadarSeriesHighlight() {
  const [highlightedItem, setHighlightedItem] =
    React.useState<HighlightItemData | null>(null);
  const [fillArea, setFillArea] = React.useState(false);

  const withOptions = (series: RadarSeries[]) =>
    series.map((item) => ({
      ...item,
      fillArea,
      type: 'radar' as const,
    }));

  const handleHighLightedSeries = (event: any, newHighLightedSeries: string) => {
    if (newHighLightedSeries !== null) {
      setHighlightedItem((prev) => ({
        ...prev,
        seriesId: newHighLightedSeries,
      }));
    }
  };
  return (
    <Stack sx={{ width: '100%' }} spacing={2} alignItems={'center'}>
      <ToggleButtonGroup
        value={highlightedItem?.seriesId ?? null}
        exclusive
        onChange={handleHighLightedSeries}
        aria-label="highlighted series"
        fullWidth
        size="small"
      >
        {series.map((item) => (
          <ToggleButton
            key={item.id}
            value={item.id}
            aria-label={`series ${item.label}`}
          >
            {item.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Box sx={{ width: '100%' }}>
        <RadarChart
          height={300}
          highlight="series"
          highlightedItem={highlightedItem}
          onHighlightChange={setHighlightedItem}
          slotProps={{ tooltip: { trigger: 'none' } }}
          series={withOptions(series)}
          radar={radar}
        />
      </Box>
      <FormControlLabel
        checked={fillArea}
        control={
          <Checkbox onChange={(event) => setFillArea(event.target.checked)} />
        }
        label="fill area"
        labelPlacement="end"
      />
    </Stack>
  );
}

// Data from https://ourworldindata.org/emissions-by-fuel
const series = [
  {
    id: 'usa',
    label: 'USA',
    data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12],
    valueFormatter,
  },
  {
    id: 'australia',
    label: 'Australia',
    data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
    valueFormatter,
  },
  {
    id: 'united-kingdom',
    label: 'United Kingdom',
    data: [2.26, 0.29, 2.03, 0.05, 0.04, 0.06],
    valueFormatter,
  },
];
const radar = {
  metrics: ['Oil', 'Coal', 'Gas', 'Flaring', 'Other\nindustry', 'Cement'],
};

```

### Disabling highlight

To remove highlight, set the `highlight` prop to `'none'`.

## Tooltip

Like other charts, the radar chart [tooltip](/x/react-charts/tooltip/) can be customized with slots.
The `trigger` prop of the `tooltip` slot accepts the following values:

- `'axis'`—the user's mouse position is associated with a metric. The tooltip displays data about all series along this specific metric.
- `'item'`—when the user's mouse hovers over a radar area, the tooltip displays data about this series.
- `'none'`—disable the tooltip.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RadarChart } from '@mui/x-charts/RadarChart';
import Typography from '@mui/material/Typography';

export default function RadarTooltip() {
  return (
    <Stack
      sx={{ width: '100%' }}
      direction="row"
      flexWrap="wrap"
      justifyContent="space-around"
    >
      <Box sx={{ maxWidth: 300 }}>
        <Typography sx={{ textAlign: 'center' }}>Axis</Typography>
        <RadarChart
          {...radarChartsParams}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        />
      </Box>
      <Box sx={{ maxWidth: 300 }}>
        <Typography sx={{ textAlign: 'center' }}>Item</Typography>
        <RadarChart
          {...radarChartsParams}
          highlight="series"
          slotProps={{ tooltip: { trigger: 'item' } }}
        />
      </Box>
    </Stack>
  );
}

// Data from https://ourworldindata.org/emissions-by-fuel
const series = [
  {
    id: 'usa',
    label: 'USA',
    data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12],
  },
  {
    id: 'australia',
    label: 'Australia',
    data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
  },
  {
    id: 'united-kingdom',
    label: 'United Kingdom',
    data: [2.26, 0.29, 2.03, 0.05, 0.04, 0.06],
  },
];
const radar = {
  metrics: ['Oil', 'Coal', 'Gas', 'Flaring', 'Other\nindustry', 'Cement'],
};

const radarChartsParams = {
  hideLegend: true,
  height: 300,
  series,
  radar,
};

```

## Click event

Radar charts provides multiple click handlers:

- `onAreaClick` for click on a specific area.
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
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import {
  ChartsAxisData,
  RadarItemIdentifier,
  RadarSeriesType,
} from '@mui/x-charts/models';
import { RadarChart } from '@mui/x-charts/RadarChart';
import { HighlightedCode } from '@mui/docs/HighlightedCode';

export default function RadarClick() {
  const [itemData, setItemData] = React.useState<RadarItemIdentifier>();
  const [axisData, setAxisData] = React.useState<ChartsAxisData | null>();
  const [itemClick, setItemClick] = React.useState<'mark' | 'area' | null>('mark');

  const handleItemClick = (
    event: React.MouseEvent<HTMLElement>,
    newItem: 'mark' | 'area' | null,
  ) => {
    setItemClick(newItem);
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <RadarChart
          {...commonSettings}
          series={[lisaGrades, bartGrades]}
          onAreaClick={
            itemClick === 'area' ? (event, d) => setItemData(d) : undefined
          }
          onMarkClick={
            itemClick === 'mark' ? (event, d) => setItemData(d) : undefined
          }
          onAxisClick={(event, d) => setAxisData(d)}
        />
      </Box>

      <Stack
        direction="column"
        sx={{ width: { xs: '100%', md: '40%' } }}
        spacing={2}
      >
        <Stack
          spacing={1}
          direction={{ xs: 'row', md: 'column' }}
          alignItems={{ xs: 'center', md: 'start' }}
        >
          <Typography>Item click listener</Typography>
          <ToggleButtonGroup
            value={itemClick}
            exclusive
            onChange={handleItemClick}
            aria-label="text alignment"
            size="small"
          >
            <ToggleButton value="mark">Mark</ToggleButton>
            <ToggleButton value="area">Area</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <div>
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
        </div>
      </Stack>
    </Stack>
  );
}

const commonSettings = {
  height: 300,
  radar: {
    max: 120,
    metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
  },
};
const lisaGrades: RadarSeriesType = {
  type: 'radar',
  label: 'Lisa',
  id: 'lisa-grade-series',
  data: [120, 98, 86, 99, 85, 65],
  hideMark: false,
};
const bartGrades: RadarSeriesType = {
  type: 'radar',
  label: 'Bart',
  id: 'bar-grade-series',
  data: [25, 34, 51, 16, 90, 20],
  hideMark: false,
};

```

:::info
There is a slight difference between the `event` of `onAxisClick` and the others:

- For `onAxisClick` it's a native mouse event emitted by the svg component.
- For others, it's a React synthetic mouse event emitted by the area, line, or mark component.

:::

## Composition

Use the `<RadarDataProvider />` to provide `series` and `radar` props for composition.

In addition to the common chart components available for [composition](/x/react-charts/composition/), you can use the following components:

- For axes:
  - `<RadarGrid />` renders the grid and stripes.
  - `<RadarMetricLabels />` renders metric labels around the grid.
- For data:
  - `<RadarSeriesPlot />` renders series (the area and the marks) on top of each other.
  - `<RadarSeriesArea />` renders the series area.
  - `<RadarSeriesMarks />` renders series marks.
- For interaction:
  - `<RadarAxisHighlight />` renders line and marks along the highlighted axis.

:::info
The `<RadarSeriesPlot />` renders all series together, such that the area of the second series is on top of the marks of the first one.

The `<RadarSeriesArea />` and `<RadarSeriesMarks />` components make it possible to render all marks on top of all areas.
You can also use them to render components between the areas and the marks.
:::

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import {
  Unstable_RadarDataProvider as RadarDataProvider,
  RadarGrid,
  RadarSeriesMarks,
  RadarSeriesArea,
  RadarMetricLabels,
  RadarAxisHighlight,
} from '@mui/x-charts/RadarChart';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';

export default function CompositionExample() {
  return (
    <RadarDataProvider height={300} series={series} radar={radar} margin={margin}>
      <Stack direction="column" alignItems="center" gap={1} sx={{ width: '100%' }}>
        <ChartsLegend />
        <ChartsSurface>
          <RadarGrid divisions={5} />
          <RadarMetricLabels />
          <RadarSeriesArea
            fillOpacity={0.4}
            strokeWidth={1}
            seriesId="australia-id"
          />
          <RadarSeriesArea
            fill="transparent"
            strokeWidth={1}
            seriesId="usa-id"
            strokeDasharray="4, 4"
            strokeLinecap="round"
          />
          <RadarAxisHighlight />
          <RadarSeriesMarks />
        </ChartsSurface>
      </Stack>
    </RadarDataProvider>
  );
}

// Data from https://ourworldindata.org/emissions-by-fuel
const series = [
  {
    id: 'usa-id',
    label: 'USA',
    data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12],
    fillArea: true,
  },
  {
    id: 'australia-id',
    label: 'Australia',
    data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
    fillArea: true,
  },
];
const radar = {
  metrics: ['Oil', 'Coal', 'Gas', 'Flaring', 'Other\nindustry', 'Cement'],
};
const margin = { left: 50, right: 50 };

```

Here's how the Radar Chart is composed:

```jsx
<RadarDataProvider>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      {/* The background of the chart */}
      <RadarGrid />
      <RadarMetricLabels />
      {/* The data with axis highlight on top of area and below marks */}
      <RadarSeriesArea />
      <RadarAxisHighlight />
      <RadarSeriesMarks />
      {/* Other components */}
      <ChartsOverlay />
    </ChartsSurface>
    <ChartsTooltip />
  </ChartsWrapper>
</RadarDataProvider>
```
