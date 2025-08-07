---
title: Charts - Tooltip
productId: x-charts
components: ChartsTooltip, ChartsAxisTooltipContent, ChartsItemTooltipContent, ChartsTooltipContainer
---

# Charts - Tooltip

Tooltip provides extra data on charts item.

In all charts components, the tooltip is accessible via the slot `tooltip`.
If you are using composition, you can use the `<ChartsTooltip />` component.

## Tooltip trigger

The Tooltip can be triggered by two kinds of events:

- `'item'`—when the user's mouse hovers over an item on the chart, the tooltip displays data about this specific item.
- `'axis'`—the user's mouse position is associated with a value of the x-axis. The tooltip displays data about all series at this specific x value.
- `'none'`—disable the tooltip.

To pass this trigger attribute to the tooltip use `slotProps.tooltip.trigger`.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';

const barChartsParams = {
  xAxis: [{ data: ['page A', 'page B', 'page C', 'page D', 'page E'] }],
  series: [
    { data: [2, 5, 3, 4, 1], stack: '1', label: 'Series x' },
    { data: [10, 3, 1, 2, 10], stack: '1', label: 'Series y' },
    { data: [10, 3, 1, 2, 10], stack: '1', label: 'Series z' },
  ],
  margin: { top: 20, right: 10 },
  height: 200,
  hideLegend: true,
};
export default function Interaction() {
  return (
    <Stack direction="column" sx={{ width: '100%', maxWidth: 400 }}>
      <BarChart {...barChartsParams} slotProps={{ tooltip: { trigger: 'axis' } }} />
      <BarChart {...barChartsParams} slotProps={{ tooltip: { trigger: 'item' } }} />
    </Stack>
  );
}

```

## Formatting

The format of data rendered in the tooltip can be modified thanks to the series `valueFormatter` property.
The same can be applied to axes values when a tooltip is triggered by the `'axis'`.

Here is a demo with:

- The time axis values formatted to only show the year
- The series values are formatted in U.S. Dollars.

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const years = [
  new Date(1990, 0, 1),
  new Date(1991, 0, 1),
  new Date(1992, 0, 1),
  new Date(1993, 0, 1),
  new Date(1994, 0, 1),
  new Date(1995, 0, 1),
  new Date(1996, 0, 1),
  new Date(1997, 0, 1),
  new Date(1998, 0, 1),
  new Date(1999, 0, 1),
  new Date(2000, 0, 1),
  new Date(2001, 0, 1),
  new Date(2002, 0, 1),
  new Date(2003, 0, 1),
  new Date(2004, 0, 1),
  new Date(2005, 0, 1),
  new Date(2006, 0, 1),
  new Date(2007, 0, 1),
  new Date(2008, 0, 1),
  new Date(2009, 0, 1),
  new Date(2010, 0, 1),
  new Date(2011, 0, 1),
  new Date(2012, 0, 1),
  new Date(2013, 0, 1),
  new Date(2014, 0, 1),
  new Date(2015, 0, 1),
  new Date(2016, 0, 1),
  new Date(2017, 0, 1),
  new Date(2018, 0, 1),
];

const FranceGDPperCapita = [
  28129, 28294.264, 28619.805, 28336.16, 28907.977, 29418.863, 29736.645, 30341.807,
  31323.078, 32284.611, 33409.68, 33920.098, 34152.773, 34292.03, 35093.824,
  35495.465, 36166.16, 36845.684, 36761.793, 35534.926, 36086.727, 36691, 36571,
  36632, 36527, 36827, 37124, 37895, 38515.918,
];

const UKGDPperCapita = [
  26189, 25792.014, 25790.186, 26349.342, 27277.543, 27861.215, 28472.248, 29259.764,
  30077.385, 30932.537, 31946.037, 32660.441, 33271.3, 34232.426, 34865.78,
  35623.625, 36214.07, 36816.676, 36264.79, 34402.36, 34754.473, 34971, 35185, 35618,
  36436, 36941, 37334, 37782.83, 38058.086,
];

const GermanyGDPperCapita = [
  25391, 26769.96, 27385.055, 27250.701, 28140.057, 28868.945, 29349.982, 30186.945,
  31129.584, 32087.604, 33367.285, 34260.29, 34590.93, 34716.44, 35528.715,
  36205.574, 38014.137, 39752.207, 40715.434, 38962.938, 41109.582, 43189, 43320,
  43413, 43922, 44293, 44689, 45619.785, 46177.617,
];

const lineChartsParams = {
  series: [
    {
      label: 'French GDP per capita',
      data: FranceGDPperCapita,
      showMark: false,
    },
    {
      label: 'German GDP per capita',
      data: GermanyGDPperCapita,
      showMark: false,
    },
    {
      label: 'UK GDP per capita',
      data: UKGDPperCapita,
      showMark: false,
    },
  ],
  height: 300,
  margin: { left: 0 },
  yAxis: [{ width: 50 }],
};

const yearFormatter = (date: Date) => date.getFullYear().toString();
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format;

export default function Formatting() {
  return (
    <LineChart
      {...lineChartsParams}
      xAxis={[{ data: years, scaleType: 'time', valueFormatter: yearFormatter }]}
      series={lineChartsParams.series.map((series) => ({
        ...series,
        valueFormatter: (v) => (v === null ? '' : currencyFormatter(v)),
      }))}
    />
  );
}

```

### Advanced formatting

The series `valueFormatter` provides a context as its second argument containing a `dataIndex` property which you can use to calculate other data-related values.

In the demo below you can notice we use `dataIndex` to add each team's rank in the tooltip.

```tsx
import * as React from 'react';
import { PieChart, PieChartProps } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

const otherProps: Partial<PieChartProps> = {
  width: 200,
  height: 200,
  sx: {
    [`.${legendClasses.root}`]: {
      transform: 'translate(20px, 0)',
    },
  },
};

const data = [
  { team: 'Amber Ants', rank: 3, points: 31 },
  { team: 'Eagle Warriors', rank: 1, points: 50 },
  { team: 'Elephant Trunk', rank: 4, points: 18 },
  { team: 'Jaguars', rank: 2, points: 37 },
  { team: 'Smooth Pandas', rank: 5, points: 6 },
];

export default function SeriesFormatter() {
  return (
    <PieChart
      series={[
        {
          data: data.map((d) => ({ label: d.team, id: d.team, value: d.points })),
          valueFormatter: (v, { dataIndex }) => {
            const { rank } = data[dataIndex];
            return `has ${v.value} points and is ranked ${rank}.`;
          },
        },
      ]}
      {...otherProps}
    />
  );
}

```

### Axis formatter

To modify how data is displayed in the axis use the `valueFormatter` property.

Its second argument is a context that provides a `location` property with either `'tick'` or `'tooltip'`.

In this demo, you can see:

- The country axis displays only the country code
- The label displays annotated data `Country: name (code)`

```tsx
import * as React from 'react';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';

const dataset = [
  { name: 'Austria', code: 'AT', gdp: 471 },
  { name: 'Belgium', code: 'BE', gdp: 583 },
  { name: 'Bulgaria', code: 'BG', gdp: 90.35 },
  { name: 'Croatia', code: 'HR', gdp: 71.6 },
  { name: 'Czech Republic', code: 'CZ', gdp: 291 },
  { name: 'Denmark', code: 'DK', gdp: 400 },
  { name: 'Finland', code: 'FI', gdp: 283 },
  { name: 'France', code: 'FR', gdp: 2779 },
  { name: 'Germany', code: 'DE', gdp: 4082 },
  { name: 'Greece', code: 'GR', gdp: 218 },
  { name: 'Hungary', code: 'HU', gdp: 177 },
  { name: 'Ireland', code: 'IE', gdp: 533 },
  { name: 'Italy', code: 'IT', gdp: 2050 },
  { name: 'Netherlands', code: 'NL', gdp: 1009 },
  { name: 'Poland', code: 'PL', gdp: 688 },
  { name: 'Portugal', code: 'PT', gdp: 255 },
  { name: 'Romania', code: 'RO', gdp: 301 },
  { name: 'Slovakia', code: 'SK', gdp: 115 },
  { name: 'Spain', code: 'ES', gdp: 1418 },
  { name: 'Sweden', code: 'SE', gdp: 591 },
];

const chartParams: BarChartProps = {
  yAxis: [
    {
      label: 'GDP (million $USD)',
      width: 70,
    },
  ],
  series: [
    {
      label: 'GDP',
      dataKey: 'gdp',
      valueFormatter: (v) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          compactDisplay: 'short',
          notation: 'compact',
        }).format((v || 0) * 1_000_000),
    },
  ],
  margin: { left: 0 },
  hideLegend: true,
  dataset,
  height: 400,
};

export default function AxisFormatter() {
  return (
    <BarChart
      xAxis={[
        {
          scaleType: 'band',
          dataKey: 'code',
          valueFormatter: (code, context) =>
            context.location === 'tick'
              ? code
              : `Country: ${dataset.find((d) => d.code === code)?.name} (${code})`,
        },
      ]}
      {...chartParams}
    />
  );
}

```

### Label formatting

The label text inside the tooltip can also be formatted conditionally by providing a function to the series `label` property.

Here is an example of how to shorten series label in the tooltip but not the legend.

```jsx
<LineChart
  // ...
  series={[
    {
      data: [ ... ],
      label: (location) => location === 'tooltip' ? 'BR' : 'Brazil'
    }
  ]}
/>
```

:::info
See [Label—Conditional formatting](/x/react-charts/label/#conditional-formatting) for more details.
:::

## Hiding values

### Axis

You can hide the axis value with `hideTooltip` in the axis props.
It removes the header showing the x-axis value from the tooltip.

```jsx
<LineChart
  // ...
  xAxis={[{ data: [ ... ], hideTooltip: true }]}
/>
```

### Series

To hide a series, the formatted value should be `null`.
To display the series with a blank space, return an empty string.

## Style modification

The tooltip can be styled using CSS classes, similar to other elements.
However, there is one caveat regarding using [portal](https://react.dev/reference/react-dom/createPortal).

The tooltip renders as a child of the document's body element.
From a DOM perspective, it's not inside the chart.
So using the chart's `sx` prop as follow does not work.

```tsx
import { chartsTooltipClasses } from '@mui/x-charts';

<LineChart
  sx={{
    [`& .${chartsTooltipClasses.root} .${chartsTooltipClasses.valueCell}`]: {
      color: 'red',
    },
  }}
/>;
```

To apply the same style as above, use the `sx` prop of the tooltip itself, which should be set in `slotProps.tooltip`.

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { chartsTooltipClasses } from '@mui/x-charts/ChartsTooltip';

const params = {
  xAxis: [{ data: [1, 2, 3, 5, 8, 10] }],
  series: [{ data: [2, 5.5, 2, 8.5, 1.5, 5] }],
  height: 300,
  axisHighlight: { x: 'line' },
} as const;

export default function TooltipStyle() {
  return (
    <LineChart
      {...params}
      slotProps={{
        tooltip: {
          sx: {
            [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.valueCell}`]: {
              color: 'red',
            },
          },
        },
      }}
    />
  );
}

```

Another option is to disable the portal by setting `slotProps.tooltip.disablePortal` to `true`.
In that case, the tooltip renders as a child of the chart, and CSS rules apply as expected.

## Using a custom tooltip

For advanced use cases, it can be necessary to create your own tooltip.
You can replace the default tooltip in single component charts by using slots.

```jsx
<LineChart slots={{ tooltip: CustomItemTooltip }} />
```

With composition, you can use your component inside the container.

```jsx
<ChartContainer>
  // ...
  <CustomItemTooltip />
</ChartContainer>
```

:::warning
If your custom tooltip is an HTML element and does not use portal, it cannot render inside the ChartContainer.
Otherwise it would render an HTML element inside an SVG.

The solution is to render your tooltip as a descendant the ChartDataProvider so it can access the chart data, but outside ChartSurface so it isn't rendered inside an SVG element.

```jsx
<ChartDataProvider>
  <ChartSurface>{/* ... */}</ChartSurface>
  <CustomItemTooltip disablePortal />
</ChartDataProvider>
```

:::

## Creating a tooltip

To create your custom tooltip, the library exports some helpers which are explained in the following sections:

- `<ChartsTooltipContainer />` a wrapper providing the open/close state and the position of the tooltip.
- `<ChartsItemTooltipContent />` renders the content of the default item tooltip.
- `<ChartsAxisTooltipContent />` renders the content of the default axis tooltip.
- `useItemTooltip()` provides all basic information associated to the current item tooltip.
- `useAxesTooltip()` provides all basic information associated to the current axes tooltip.

### Modifying the position

To override the tooltip position, you can create a wrapper that manages the position.

```jsx
function CustomTooltipPopper(props){
  // ... (event management) ...

  return <NoSsr>
      <Popper {/* position */}>
        {props.children}
      </Popper>
    </NoSsr>
}
```

Then you can either render built-in content (with `<ChartsItemTooltipContent />` or `<ChartsAxisTooltipContent />`) or your own component.

```jsx
<CustomTooltipPopper>
  <ChartsItemTooltipContent />
</CustomTooltipPopper>
```

The following demo shows how to use additional hooks such as `useXAxis()` and `useDrawingArea()` to customize the tooltip position.

```tsx
import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import {
  ChartsTooltipContainer,
  ChartsItemTooltipContent,
} from '@mui/x-charts/ChartsTooltip';
import { ItemTooltip } from './ItemTooltip';
import { ItemTooltipFixedY } from './ItemTooltipFixedY';
import { ItemTooltipTopElement } from './ItemTooltipTopElement';
import { dataset, valueFormatter } from '../dataset/weather';

export default function CustomTooltipPosition() {
  const [tooltipType, setTootltipType] = React.useState<
    'mouse' | 'fixedY' | 'itemTop'
  >('itemTop');

  const id = React.useId();
  const clipPathId = `${id}-clip-path`;

  // Pick one of the custom tooltip wrapper according to the state.
  const TooltipPlacement =
    (tooltipType === 'mouse' && ItemTooltip) ||
    (tooltipType === 'fixedY' && ItemTooltipFixedY) ||
    (tooltipType === 'itemTop' && ItemTooltipTopElement) ||
    ChartsTooltipContainer;

  return (
    <div style={{ width: '100%' }}>
      <FormControl>
        <FormLabel id="tooltip-placement-radio-buttons-group-label">
          tooltip placement
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="tooltip-placement-radio-buttons-group-label"
          name="tooltip-placement"
          value={tooltipType}
          onChange={(event) =>
            setTootltipType(event.target.value as 'mouse' | 'fixedY' | 'itemTop')
          }
        >
          <FormControlLabel value="mouse" control={<Radio />} label="mouse" />
          <FormControlLabel
            value="fixedY"
            control={<Radio />}
            label="top of chart"
          />
          <FormControlLabel value="itemTop" control={<Radio />} label="top of bar" />
        </RadioGroup>
      </FormControl>
      <ChartContainer
        height={300}
        dataset={dataset}
        series={[
          { type: 'bar', dataKey: 'seoul', label: 'Seoul', valueFormatter },
          { type: 'bar', dataKey: 'paris', label: 'Paris', valueFormatter },
        ]}
        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      >
        <g clipPath={`url(#${clipPathId})`}>
          <BarPlot />
        </g>
        <ChartsXAxis />
        <ChartsYAxis />

        {/* Our custom tooltip wrapper with the default item content. */}
        <TooltipPlacement>
          <ChartsItemTooltipContent />
        </TooltipPlacement>

        <ChartsClipPath id={clipPathId} />
      </ChartContainer>
    </div>
  );
}

```

#### Modifying the content

To keep the default placement, use the `<ChartsTooltipContainer />` wrapper.
It accepts a prop `trigger = 'item' | 'axis'` that defines when the Popper should open.

##### Item content

The `useItemTooltip()` hook provides the information about the current item the user is interacting with.
It contains:

- `identifier`: An object that identify the item. Which often contains its series type, series id, and data index.
- `color`: The color used to display the item. This includes the impact of [color map](/x/react-charts/styling/#values-color).
- `label`, `value`, `formattedValue`: Values computed to simplify the tooltip creation.

```tsx
import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltipContainer } from '@mui/x-charts/ChartsTooltip';
import { CustomItemTooltip } from './CustomItemTooltip';
import { dataset, valueFormatter } from '../dataset/weather';

export default function CustomTooltipContent() {
  const id = React.useId();
  const clipPathId = `${id}-clip-path`;
  return (
    <div style={{ width: '100%' }}>
      <ChartContainer
        height={300}
        dataset={dataset}
        series={[
          { type: 'bar', dataKey: 'seoul', label: 'Seoul', valueFormatter },
          { type: 'bar', dataKey: 'paris', label: 'Paris', valueFormatter },
        ]}
        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      >
        <ChartsClipPath id={clipPathId} />
        <g clipPath={`url(#${clipPathId})`}>
          <BarPlot />
        </g>
        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsTooltipContainer trigger="item">
          <CustomItemTooltip />
        </ChartsTooltipContainer>
      </ChartContainer>
    </div>
  );
}

```

#### Axis content

The `useAxesTooltip()` hook returns the information about the current axes user is interacting with and the relevant series.
For each axis, it contains:

- `identifier`: An object that identify the axis. Which often contains its series type, series id, and data index.
- `color`: The color used to display the item. This includes the impact of [color map](/x/react-charts/styling/#values-color).
- `label`, `value`, `formattedValue`: Values computed to simplify the tooltip creation.

```tsx
import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltipContainer } from '@mui/x-charts/ChartsTooltip';
import { CustomAxisTooltip } from './CustomAxisTooltip';
import { dataset, valueFormatter } from '../dataset/weather';

export default function CustomAxisTooltipContent() {
  const id = React.useId();
  const clipPathId = `${id}-clip-path`;
  return (
    <div style={{ width: '100%' }}>
      <ChartContainer
        height={300}
        dataset={dataset}
        series={[
          { type: 'bar', dataKey: 'seoul', label: 'Seoul', valueFormatter },
          { type: 'bar', dataKey: 'paris', label: 'Paris', valueFormatter },
        ]}
        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      >
        <ChartsClipPath id={clipPathId} />
        <g clipPath={`url(#${clipPathId})`}>
          <BarPlot />
        </g>
        <ChartsXAxis />
        <ChartsYAxis />

        <ChartsTooltipContainer trigger="axis">
          <CustomAxisTooltip />
        </ChartsTooltipContainer>
      </ChartContainer>
    </div>
  );
}

```
