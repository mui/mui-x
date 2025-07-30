---
title: Charts - Legend
productId: x-charts
components: ChartsLegend, ChartsText, ContinuousColorLegend, PiecewiseColorLegend
---

# Charts - Legend

Legend is the UI element mapping symbols and colors to the series' label.

## Basic display

In chart components, the legend links series with `label` properties and their color.

```tsx
import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Chance } from 'chance';

const chance = new Chance(42);

const data = Array.from({ length: 50 }, () => ({
  x: chance.floating({ min: -20, max: 20 }),
  y: chance.floating({ min: -20, max: 20 }),
})).map((d, index) => ({ ...d, id: index }));

export default function BasicLegend() {
  return (
    <ScatterChart
      series={[
        { type: 'scatter', label: 'Var A', data: data.slice(0, 25) },
        { type: 'scatter', label: 'Var B', data: data.slice(25) },
      ]}
      height={300}
    />
  );
}

```

## Customization

This section explains how to customize the legend using classes and properties.

### Dimensions

Much of the customization can be done using CSS properties.
There is a main class for the legend container, `.MuiChartsLegend-root`.
Alternatively the `legendClasses` variable can be used if using CSS-in-JS to target the elements.

Each legend item is composed of two main elements: the `mark` and the `label`.

The example below explains how it is possible to customize some parts the legend.
And shows how to use both the `legendClasses` variable and the CSS class directly.

```tsx
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { PieChart } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

const data = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
  { id: 3, value: 10, label: 'Series D' },
  { id: 4, value: 15, label: 'Series E' },
  { id: 5, value: 20, label: 'Series F' },
  { id: 6, value: 10, label: 'Series G' },
  { id: 7, value: 15, label: 'Series H' },
];

const itemsNumber = 8;

export default function LegendDimension() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={
        {
          direction: {
            knob: 'select',
            defaultValue: 'horizontal',
            options: ['horizontal', 'vertical'],
          },
          markSize: { knob: 'number', defaultValue: 15, min: 0 },
          markGap: { knob: 'number', defaultValue: 8, min: 0 },
          itemGap: { knob: 'number', defaultValue: 16, min: 0 },
        } as const
      }
      renderDemo={(props) => (
        <PieChart
          series={[
            {
              data: data.slice(0, itemsNumber),
            },
          ]}
          slotProps={{
            legend: {
              direction: props.direction,
              sx: {
                gap: `${props.itemGap}px`,
                [`.${legendClasses.mark}`]: {
                  height: props.markSize,
                  width: props.markSize,
                },
                [`.${legendClasses.series}`]: {
                  gap: `${props.markGap}px`,
                },
              },
            },
          }}
          height={200}
          width={200}
        />
      )}
      getCode={({ props }) => {
        return `import { PieChart } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

<PieChart
  {/** ... */}
  slotProps={{
    legend: {
      direction: props.direction,
      sx: {
        gap: '${props.itemGap}px',
        // CSS-in-JS
        [\`.\${legendClasses.mark}\`]: {
          height: ${props.markSize},
          width: ${props.markSize},
        },
        // CSS class
        ['.${legendClasses.series}']: {
          gap: '${props.markGap}px',
        },
      },
    },
  }}
/>
`;
      }}
    />
  );
}

```

### Position

The legend can either be displayed in a `'vertical'` or `'horizontal'` layout controlled with the `direction` property.

It can also be moved with the `position: { vertical, horizontal }` property which defines how the legend aligns itself in the parent container.

- `vertical` can be `'top'`, `'middle'`, or `'bottom'`.
- `horizontal` can be `'left'`, `'middle'`, or `'right'`.

By default, the legend is placed above the charts.

:::warning
The `position` property is only available in the `slotProps`, but not in the `<ChartsLegend />` props.
In the second case, you are free to place the legend where you want.
:::

```tsx
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { PieChart } from '@mui/x-charts/PieChart';

const data = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
  { id: 3, value: 10, label: 'Series D' },
  { id: 4, value: 15, label: 'Series E' },
  { id: 5, value: 20, label: 'Series F' },
  { id: 6, value: 10, label: 'Series G' },
  { id: 7, value: 15, label: 'Series H' },
  { id: 8, value: 20, label: 'Series I' },
  { id: 9, value: 10, label: 'Series J' },
  { id: 10, value: 15, label: 'Series K' },
  { id: 11, value: 20, label: 'Series L' },
  { id: 12, value: 10, label: 'Series M' },
  { id: 13, value: 15, label: 'Series N' },
  { id: 14, value: 20, label: 'Series O' },
];

export default function LegendPosition() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={
        {
          direction: {
            knob: 'select',
            defaultValue: 'vertical',
            options: ['horizontal', 'vertical'],
          },
          vertical: {
            knob: 'select',
            defaultValue: 'middle',
            options: ['top', 'middle', 'bottom'],
          },
          horizontal: {
            knob: 'select',
            defaultValue: 'center',
            options: ['start', 'center', 'end'],
          },
          itemsNumber: {
            knob: 'number',
            defaultValue: 3,
            min: 1,
            max: data.length,
          },
        } as const
      }
      renderDemo={(props) => (
        <PieChart
          series={[
            {
              data: data.slice(0, props.itemsNumber),
            },
          ]}
          height={200}
          width={200}
          slotProps={{
            legend: {
              direction: props.direction,
              position: { vertical: props.vertical, horizontal: props.horizontal },
            },
          }}
        />
      )}
      getCode={({ props }) => {
        return `import { PieChart } from '@mui/x-charts/PieChart';

<PieChart
  {/** ... */}
  slotProps={{
    legend: {
      direction: '${props.direction}',
      position: { 
        vertical: '${props.vertical}',
        horizontal: '${props.horizontal}'
      }
    }
  }}
/>
`;
      }}
    />
  );
}

```

### Hiding

You can hide the legend with the `hideLegend` prop of the Chart.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { PieChart } from '@mui/x-charts/PieChart';

const series = [
  {
    data: [
      { id: 0, value: 10, label: 'series A' },
      { id: 1, value: 15, label: 'series B' },
      { id: 2, value: 20, label: 'series C' },
    ],
  },
];

export default function HiddenLegend() {
  const [isHidden, setIsHidden] = React.useState(false);

  const Toggle = (
    <FormControlLabel
      checked={isHidden}
      control={<Checkbox onChange={(event) => setIsHidden(event.target.checked)} />}
      label="hide the legend"
      labelPlacement="end"
      sx={{ margin: 'auto' }}
    />
  );

  return (
    <Stack>
      {Toggle}
      <PieChart series={series} hideLegend={isHidden} width={200} height={200} />
    </Stack>
  );
}

```

### Label styling

Changing the `label` style can be done by targeting the root component's font properties.

To change the `mark` color or shape, the `fill` class is used instead.
Keep in mind that the `mark` is an SVG element, so the `fill` property is used to change its color.

```tsx
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { PieChart } from '@mui/x-charts/PieChart';
import { labelMarkClasses } from '@mui/x-charts/ChartsLabel';

const data = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
  { id: 3, value: 10, label: 'Series D' },
];

export default function LegendTextStyling() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={{
        fontSize: { knob: 'number', defaultValue: 14 },
        color: {
          knob: 'select',
          defaultValue: 'blue',
          options: ['blue', 'red', 'green'],
        },
        markColor: {
          knob: 'select',
          defaultValue: 'blue',
          options: ['blue', 'red', 'green'],
        },
      }}
      renderDemo={(props) => (
        <PieChart
          series={[
            {
              data,
            },
          ]}
          height={200}
          width={200}
          slotProps={{
            legend: {
              sx: {
                fontSize: props.fontSize,
                color: props.color,
                [`.${labelMarkClasses.fill}`]: {
                  fill: props.markColor,
                },
              },
            },
          }}
        />
      )}
      getCode={({ props }) => {
        return `import { PieChart } from '@mui/x-charts/PieChart';
import { labelMarkClasses } from '@mui/x-charts/ChartsLabel';

<PieChart
  {/** ... */}
  slotProps={{
    legend: {
      sx: {
        fontSize: ${props.fontSize},
        color: ${props.color},
        [\`.\${labelMarkClasses.fill}\`]: {
          fill: ${props.markColor},
        },
      },
    },
  }}
/>
`;
      }}
    />
  );
}

```

### Change mark shape

To change the mark shape, you can use the `labelMarkType` property of the series item.
For the `pie` series, the `labelMarkType` property is available for each of the pie slices too.

```tsx
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';

const seriesConfig = [
  { id: 0, data: [10], label: 'Series A' },
  { id: 1, data: [15], label: 'Series B' },
  { id: 2, data: [20], label: 'Series C' },
  { id: 3, data: [10], label: 'Series D' },
];

export default function LegendMarkType() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={
        {
          markType: {
            knob: 'select',
            defaultValue: 'square',
            options: ['square', 'circle', 'line'],
          },
        } as const
      }
      renderDemo={(props) => (
        <BarChart
          series={seriesConfig.map((seriesItem) => ({
            ...seriesItem,
            labelMarkType: props.markType,
          }))}
          xAxis={[{ data: ['A'] }]}
          height={200}
        />
      )}
      getCode={({ props }) => {
        return `import { BarChart } from '@mui/x-charts/BarChart';

<BarChart
  {/** ... */}
  series={
    seriesConfig.map((seriesItem) => ({
      ...seriesItem,
      labelMarkType: '${props.markType}',
    }))
  }
/>
`;
      }}
    />
  );
}

```

#### Custom shapes

For more advanced use cases, you can also provide a component to the `labelMarkType` property of each series to fully customize the mark.

```tsx
import { BarChart } from '@mui/x-charts/BarChart';
import * as React from 'react';
import { ChartsLabelCustomMarkProps } from '@mui/x-charts/ChartsLabel';

function HTMLCircle({ className, color }: ChartsLabelCustomMarkProps) {
  return (
    <div className={className} style={{ borderRadius: '100%', background: color }} />
  );
}

function SVGDiamond({ className, color }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path
        className={className}
        d="M0,-7.423L4.285,0L0,7.423L-4.285,0Z"
        fill={color}
      />
    </svg>
  );
}

export default function LegendCustomLabelMark() {
  return (
    <BarChart
      series={[
        { id: 0, data: [10, 15], label: 'Series A', labelMarkType: HTMLCircle },
        { id: 1, data: [15, 20], label: 'Series B', labelMarkType: 'line' },
        { id: 2, data: [20, 25], label: 'Series C' },
        { id: 3, data: [10, 15], label: 'Series D', labelMarkType: SVGDiamond },
      ]}
      xAxis={[{ data: ['Category 1', 'Category 2'] }]}
      height={200}
    />
  );
}

```

Passing a component to `labelMarkType` affects not only the legend but other places where the label mark is shown, such as tooltips.

Customizing the mark shape of a pie chart depending on the series is slightly different. You can find how to do it in [this example](/x/react-charts/pie-demo/#pie-chart-with-custom-mark-in-legend-and-tooltip).

To ensure compatibility with [gradients and patterns](/x/react-charts/styling/#gradients-and-patterns), consider using SVG instead of HTML in the `labelMarkType`.

### Scrollable legend

The legend can be made scrollable by setting the `overflowY` for vertical legends or `overflowX` for horizontal legends.
Make sure that the legend container has a fixed height or width to enable scrolling.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { PieChart } from '@mui/x-charts/PieChart';

const series = [
  {
    data: [
      { id: 0, value: 10, label: 'Series A' },
      { id: 1, value: 15, label: 'Series B' },
      { id: 2, value: 20, label: 'Series C' },
      { id: 3, value: 10, label: 'Series D' },
      { id: 4, value: 15, label: 'Series E' },
      { id: 5, value: 20, label: 'Series F' },
      { id: 6, value: 10, label: 'Series G' },
      { id: 7, value: 15, label: 'Series H' },
      { id: 8, value: 20, label: 'Series I' },
      { id: 9, value: 10, label: 'Series J' },
      { id: 10, value: 15, label: 'Series K' },
      { id: 11, value: 20, label: 'Series L' },
      { id: 12, value: 10, label: 'Series M' },
      { id: 13, value: 15, label: 'Series N' },
      { id: 14, value: 20, label: 'Series O' },
    ],
  },
];

export default function ScrollableLegend() {
  return (
    <Stack height={200} width={200}>
      <PieChart
        series={series}
        sx={{
          height: '100%',
        }}
        slotProps={{
          legend: {
            sx: {
              overflowY: 'scroll',
              flexWrap: 'nowrap',
              height: '100%',
            },
          },
        }}
      />
    </Stack>
  );
}

```

### Series styling

You can use CSS to style the series in the legend.
Each legend item has a `data-series` attribute where its value is the ID of the series it represents.

```tsx
import * as React from 'react';
import {
  LineChart,
  LineChartProps,
  lineElementClasses,
  markElementClasses,
} from '@mui/x-charts/LineChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import {
  ChartsLabelCustomMarkProps,
  labelMarkClasses,
} from '@mui/x-charts/ChartsLabel';

const monthlySalesData = [
  { month: 'Jan', productA: 120, productB: 90 },
  { month: 'Feb', productA: 130, productB: 100 },
  { month: 'Mar', productA: 125, productB: 110 },
  { month: 'Apr', productA: 150, productB: 95 },
  { month: 'May', productA: 160, productB: 105 },
  { month: 'Jun', productA: 170, productB: 115 },
  { month: 'Jul', productA: 165, productB: 120 },
  { month: 'Aug', productA: 175, productB: 130 },
  { month: 'Sep', productA: 180, productB: 125 },
  { month: 'Oct', productA: 190, productB: 135 },
  { month: 'Nov', productA: 200, productB: 140 },
  { month: 'Dec', productA: 210, productB: 145 },
];

const settings = {
  series: [
    {
      data: monthlySalesData.map((d) => d.productA),
      label: 'Product A',
      id: 'a',
      labelMarkType: Line,
    },
    {
      data: monthlySalesData.map((d) => d.productB),
      label: 'Product B',
      id: 'b',
      labelMarkType: Line,
    },
  ],
  xAxis: [
    {
      scaleType: 'point',
      data: monthlySalesData.map((d) => d.month),
    },
  ],
  yAxis: [{ width: 50, label: 'Sales' }],
  height: 300,
  margin: { right: 24 },
} satisfies LineChartProps;

export default function LegendStyleSeries() {
  return (
    <LineChart
      {...settings}
      sx={{
        [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
          strokeWidth: 1,
        },
        [`.${lineElementClasses.root}[data-series="a"], .${legendClasses.item}[data-series="a"] .${labelMarkClasses.fill}`]:
          {
            strokeDasharray: '5 5',
          },
        [`.${lineElementClasses.root}[data-series="b"], .${legendClasses.item}[data-series="b"] .${labelMarkClasses.fill}`]:
          {
            strokeDasharray: '3 4 5 2',
          },
        [`.${legendClasses.mark}`]: {
          width: 24,
        },
      }}
    />
  );
}

function Line({ className, color }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="0 0 24 4">
      <line
        className={className}
        x1={0}
        y1={2}
        x2={24}
        y2={2}
        stroke={color}
        strokeWidth={2}
      />
    </svg>
  );
}

```

### Custom component

For advanced customization, you can create your own legend with `useLegend`.
This hook returns the items that the default legend would plot.
Allowing you to focus on the rendering.

This demo also shows how to use `labelMarkType` together with a custom legend to create a legend with custom shapes.

This approach uses slots to render the legend items.
Another demo in [HTML components docs](/x/react-charts/components/#html-components) shows how to use it with composition.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useLegend } from '@mui/x-charts/hooks';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import {
  ChartsLabelCustomMarkProps,
  ChartsLabelMark,
} from '@mui/x-charts/ChartsLabel';

function LineWithMark({ color, className }: ChartsLabelCustomMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      fill="none"
      className={className}
    >
      <path d="M 1 12.5 L 7 12.5 M 17 12.5 L 23 12.5" />
      <circle cx={12} cy={12.5} r={5} />
    </svg>
  );
}

function DashedLine({ color, className }: ChartsLabelCustomMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth={3}
      fill="none"
      className={className}
    >
      <path d="M 1 12.5 L 23 12.5" strokeDasharray="5 3" />
    </svg>
  );
}

function MyCustomLegend() {
  const { items } = useLegend();
  return (
    <Stack direction="column" alignSelf={'flex-start'} marginLeft={9}>
      {items.map((item) => {
        const { label, id, color, seriesId, markType } = item;
        return (
          <Box
            key={id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor:
                seriesId === 'avg' ? 'rgba(156,40,40,0.5)' : 'transparent',
              padding: 1,
            }}
          >
            <ChartsLabelMark type={markType} color={color} />
            <Typography sx={{ display: 'inline-block' }}>{`${label}`}</Typography>
          </Box>
        );
      })}
    </Stack>
  );
}

const dataset = [
  { month: 'Jan', '1991_2020_avg': 4.1, 2023: 3.9 },
  { month: 'Fev', '1991_2020_avg': 4.7, 2023: 8.9 },
  { month: 'Mar', '1991_2020_avg': 7.5, 2023: 9.5 },
  { month: 'Apr', '1991_2020_avg': 10.6, 2023: 11.5 },
  { month: 'May', '1991_2020_avg': 13.8, 2023: 15.5 },
  { month: 'Jun', '1991_2020_avg': 16.7, 2023: 16.4 },
  { month: 'Jul', '1991_2020_avg': 18.9, 2023: 19.5 },
  { month: 'Aug', '1991_2020_avg': 18.8, 2023: 20.5 },
  { month: 'Sep', '1991_2020_avg': 15.8, 2023: 16.4 },
  { month: 'Oct', '1991_2020_avg': 11.9, 2023: 13.2 },
  { month: 'Nov', '1991_2020_avg': 7.6, 2023: 8.1 },
  { month: 'Dec', '1991_2020_avg': 4.7, 2023: 6.1 },
];

export default function CustomLegend() {
  const theme = useTheme();

  return (
    <Box
      sx={{ height: 300, width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <LineChart
        dataset={dataset}
        series={[
          {
            id: 'avg',
            label: 'temp. avg. 1991-2020 (°C)',
            dataKey: '1991_2020_avg',
            showMark: false,
            color: theme.palette.text.primary,
            labelMarkType: DashedLine,
          },
          {
            id: '2023-temp',
            label: 'temp. 2023 (°C)',
            dataKey: '2023',
            color: theme.palette.primary.main,
            labelMarkType: LineWithMark,
          },
        ]}
        xAxis={[{ dataKey: 'month', scaleType: 'band', id: 'x-axis' }]}
        sx={{
          [`& .${lineElementClasses.root}[data-series="avg"]`]: {
            strokeDasharray: '10 5',
          },
        }}
        slots={{ legend: MyCustomLegend }}
      />
    </Box>
  );
}

```

## Color legend

To display legend associated to a [colorMap](https://mui.com/x/react-charts/styling/#values-color), you can use:

- `<ContinuousColorLegend />` if you're using `colorMap.type='continuous'`
- `<PiecewiseColorLegend />` if you're using `colorMap.type='piecewise'`.

Then it is possible to override the `legend` slot to display the wanted legend, or use the [composition API](https://mui.com/x/react-charts/composition/) to add as many legends as needed.

```tsx
import * as React from 'react';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import Stack from '@mui/material/Stack';
import { dataset } from './tempAnomaly';

const data: LineChartProps = {
  dataset,
  series: [
    {
      label: 'Global temperature anomaly relative to 1961-1990',
      dataKey: 'anomaly',
      showMark: false,
      valueFormatter: (value) => `${value?.toFixed(2)}°`,
    },
  ],
  xAxis: [
    {
      scaleType: 'time',
      dataKey: 'year',
      disableLine: true,
      valueFormatter: (value) => value.getFullYear().toString(),
      colorMap: {
        type: 'piecewise',
        thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
        colors: ['blue', 'gray', 'red'],
      },
    },
  ],
  yAxis: [
    {
      disableLine: true,
      disableTicks: true,
      valueFormatter: (value: number) => `${value}°`,
    },
  ],
  grid: { horizontal: true },
  height: 300,
  margin: { top: 20, right: 20 },
};

export default function VeryBasicColorLegend() {
  return (
    <Stack width={'100%'}>
      <LineChart
        {...data}
        xAxis={[
          {
            ...data.xAxis![0],
            colorMap: {
              type: 'piecewise',
              thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
              colors: ['blue', 'gray', 'red'],
            },
          },
        ]}
        slots={{ legend: PiecewiseColorLegend }}
        slotProps={{ legend: { axisDirection: 'x' } }}
      />
    </Stack>
  );
}

```

### Select data

To select the color mapping to represent, use the following props:

- `axisDirection` can be `'x'`, `'y'`, or `'z'`. It indicates which axis contain the `colorMap` definition.
- `axisId` The id of the axis to use in case the selected direction contains multiple ones.

```tsx
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import Stack from '@mui/material/Stack';
import { dataset } from './tempAnomaly';

export default function BasicColorLegend() {
  return (
    <Stack width="100%">
      <Typography variant="body1">
        Global temperature anomaly relative to 1961-1990 average
      </Typography>
      <LineChart
        dataset={dataset}
        series={[
          {
            label: 'Global temperature anomaly relative to 1961-1990',
            dataKey: 'anomaly',
            showMark: false,
            valueFormatter: (value) => `${value?.toFixed(2)}°`,
          },
        ]}
        xAxis={[
          {
            scaleType: 'time',
            dataKey: 'year',
            disableLine: true,
            valueFormatter: (value) => value.getFullYear().toString(),
            colorMap: {
              type: 'piecewise',
              thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
              colors: ['blue', 'gray', 'red'],
            },
          },
        ]}
        yAxis={[
          {
            disableLine: true,
            disableTicks: true,
            valueFormatter: (value: number) => `${value}°`,
          },
        ]}
        grid={{ horizontal: true }}
        height={300}
        slotProps={{
          legend: {
            axisDirection: 'x',
            direction: 'vertical',
          },
        }}
        slots={{
          legend: PiecewiseColorLegend,
        }}
      >
        <ChartsReferenceLine y={0} />
      </LineChart>
    </Stack>
  );
}

```

### Position

This component position is done exactly the same way as the [legend for series](#position).

### Label position

The labels can be positioned in relation to the marks or gradient with the `labelPosition` prop.
The values accepted are `'start'`, `'end'` or `'extremes'`.

- With `direction='horizontal'`, using `'start'` places the labels above the visual marker, while `end` places them below.
- When `direction='vertical'`, is `'start'` or `'end'` the labels are positioned `left` and `right` of the visual markers, respectively.
- With the `'extremes'` value, the labels are positioned at both the beginning and end of the visual marker.

```tsx
import * as React from 'react';
import { interpolateRdYlBu } from 'd3-scale-chromatic';
import {
  ContinuousColorLegend,
  piecewiseColorDefaultLabelFormatter,
  PiecewiseColorLegend,
  PiecewiseLabelFormatterParams,
} from '@mui/x-charts/ChartsLegend';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsAxesGradients } from '@mui/x-charts/internals';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export default function LegendLabelPositions() {
  const piecewiseFormatter = (params: PiecewiseLabelFormatterParams) =>
    params.index === 0 || params.index === params.length
      ? piecewiseColorDefaultLabelFormatter(params)
      : '';

  return (
    <ChartDataProvider
      series={[]}
      width={200}
      height={200}
      yAxis={[
        {
          valueFormatter: (value: number) => `${value}°`,
          colorMap: {
            type: 'continuous',
            min: -0.5,
            max: 1.5,
            color: (t) => interpolateRdYlBu(1 - t),
          },
        },
      ]}
      xAxis={[
        {
          valueFormatter: (value: number) => `${value}°`,
          colorMap: {
            type: 'piecewise',
            thresholds: [0, 1.5],
            colors: [
              interpolateRdYlBu(0.9),
              interpolateRdYlBu(0.5),
              interpolateRdYlBu(0.1),
            ],
          },
        },
      ]}
    >
      <Stack direction="column" width="100%" height="100%" gap={4} spacing={2}>
        <Stack direction="column" width="100%" height="100%" gap={2}>
          <Typography variant="h4">Continuous</Typography>
          <Typography variant="h5">Horizontal</Typography>
          <Stack direction="row" gap={2} sx={{ '&>div': { flex: 1 } }}>
            <div>
              <Typography>start</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="horizontal"
                labelPosition="start"
              />
            </div>
            <div>
              <Typography>end</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="horizontal"
                labelPosition="end"
              />
            </div>
            <div>
              <Typography>extremes</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="horizontal"
                labelPosition="extremes"
              />
            </div>
          </Stack>
          <Divider />
          <Typography variant="h5">Vertical</Typography>
          <Stack
            direction="row"
            height={150}
            gap={2}
            sx={{
              '&>div': {
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
              '& .MuiContinuousColorLegend-root': { flex: 1 },
            }}
          >
            <div>
              <Typography>start</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="vertical"
                labelPosition="start"
              />
            </div>
            <div>
              <Typography>end</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="vertical"
                labelPosition="end"
              />
            </div>
            <div>
              <Typography>extremes</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="vertical"
                labelPosition="extremes"
              />
            </div>
          </Stack>
        </Stack>
        <Stack direction="column" width="100%" height="100%" gap={2}>
          <Typography variant="h4">Piecewise</Typography>
          <Typography variant="h5">Horizontal</Typography>
          <Stack direction="row" gap={2} sx={{ '&>div': { flex: 1 } }}>
            <div>
              <Typography>start</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="horizontal"
                labelPosition="start"
                labelFormatter={piecewiseFormatter}
              />
            </div>
            <div>
              <Typography>end</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="horizontal"
                labelPosition="end"
                labelFormatter={piecewiseFormatter}
              />
            </div>
            <div>
              <Typography>extremes</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="horizontal"
                labelPosition="extremes"
                labelFormatter={piecewiseFormatter}
              />
            </div>
          </Stack>
          <Divider />
          <Typography variant="h5">Vertical</Typography>
          <Stack
            direction="row"
            height={150}
            gap={2}
            sx={{
              '&>div': {
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
            }}
          >
            <div>
              <Typography>start</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="vertical"
                labelPosition="start"
              />
            </div>
            <div>
              <Typography>end</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="vertical"
                labelPosition="end"
              />
            </div>
            <div>
              <Typography>extremes</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="vertical"
                labelPosition="extremes"
                labelFormatter={piecewiseFormatter}
              />
            </div>
          </Stack>
        </Stack>
      </Stack>
      <svg width={0} height={0}>
        <ChartsAxesGradients />
      </svg>
    </ChartDataProvider>
  );
}

```

### Continuous color mapping

To modify the shape of the gradient, use the `length` and `thickness` props.
The `length` can either be a number (in px) or a percentage string. The `"100%"` corresponds to the parent dimension.

To format labels use the `minLabel`/`maxLabel`.
They accept either a string to display.
Or a function `({value, formattedValue}) => string`.

It is also possible to reverse the gradient with the `reverse` prop.

```tsx
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { interpolateRdYlBu } from 'd3-scale-chromatic';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { ContinuousColorLegend } from '@mui/x-charts/ChartsLegend';
import { dataset } from './tempAnomaly';

export default function ContinuousInteractiveDemo() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={
        {
          direction: {
            knob: 'select',
            defaultValue: 'horizontal',
            options: ['horizontal', 'vertical'],
          },
          labelPosition: {
            knob: 'select',
            defaultValue: 'end',
            options: ['start', 'end', 'extremes'],
          },
          length: {
            knob: 'number',
            defaultValue: 50,
            min: 10,
          },
          thickness: {
            knob: 'number',
            defaultValue: 12,
            min: 1,
            max: 20,
          },
          reverse: {
            knob: 'switch',
            defaultValue: false,
          },
        } as const
      }
      renderDemo={(props) => (
        <LineChart
          dataset={dataset}
          series={[
            {
              label: 'Global temperature anomaly relative to 1961-1990',
              dataKey: 'anomaly',
              showMark: false,
              valueFormatter: (value) => `${value?.toFixed(2)}°`,
            },
          ]}
          xAxis={[
            {
              scaleType: 'time',
              dataKey: 'year',
              disableLine: true,
              valueFormatter: (value) => value.getFullYear().toString(),
            },
          ]}
          yAxis={[
            {
              disableLine: true,
              disableTicks: true,
              valueFormatter: (value: number) => `${value}°`,
              colorMap: {
                type: 'continuous',
                min: -0.5,
                max: 1.5,
                color: (t) => interpolateRdYlBu(1 - t),
              },
            },
          ]}
          grid={{ horizontal: true }}
          height={300}
          slots={{ legend: ContinuousColorLegend }}
          slotProps={{
            legend: {
              axisDirection: 'y',
              direction: props.direction,
              thickness: props.thickness,
              labelPosition: props.labelPosition,
              reverse: props.reverse,
              sx: {
                [props.direction === 'horizontal' ? 'width' : 'height']:
                  `${props.length}${props.direction === 'horizontal' ? '%' : 'px'}`,
              },
            },
          }}
        >
          <ChartsReferenceLine y={0} />
        </LineChart>
      )}
      getCode={({ props }) => {
        return `import { ContinuousColorLegend } from '@mui/x-charts/ChartsLegend';

<LineChart
  {/** ... */}
  slots={{ legend: ContinuousColorLegend }}
  slotProps={{
    legend: {
      axisDirection: 'y',
      direction: '${props.direction}',
      thickness: ${props.thickness},
      labelPosition: '${props.labelPosition}',
      reverse: ${props.reverse},
      sx: { ${props.direction === 'horizontal' ? 'width' : 'height'}: '${props.length}${props.direction === 'horizontal' ? '%' : 'px'}' },
    },
  }}
/>
`;
      }}
    />
  );
}

```

### Piecewise color mapping

The piecewise Legend is quite similar to the series legend.
It accepts the same props for [customization](#dimensions).

To override labels generated by default, provide a `labelFormatter` prop.
It takes the min/max of the piece and returns the label.

Values can be `null` for the first and last pieces.
And returning `null` removes the piece from the legend.
Returning an empty string removes any label, but still display the `mark`.

```ts
labelFormatter = ({ index, length, min, max, formattedMin, formattedMax }) =>
  string | null;
```

The `markType` can be changed with the `markType` prop.
Since the color values are based on the axis, and not the series, the `markType` has to be set directly on the legend.

```tsx
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  piecewiseColorDefaultLabelFormatter,
  PiecewiseColorLegend,
} from '@mui/x-charts/ChartsLegend';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { dataset } from './tempAnomaly';

export default function PiecewiseInteractiveDemo() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={
        {
          direction: {
            knob: 'select',
            defaultValue: 'horizontal',
            options: ['horizontal', 'vertical'],
          },
          labelPosition: {
            knob: 'select',
            defaultValue: 'extremes',
            options: ['start', 'end', 'extremes'],
          },
          markType: {
            knob: 'select',
            defaultValue: 'square',
            options: ['square', 'circle', 'line'],
          },
          onlyShowExtremes: {
            knob: 'switch',
            defaultValue: false,
          },
          padding: {
            knob: 'number',
            defaultValue: 0,
          },
        } as const
      }
      renderDemo={(props) => (
        <LineChart
          dataset={dataset}
          series={[
            {
              label: 'Global temperature anomaly relative to 1961-1990',
              dataKey: 'anomaly',
              showMark: false,
              valueFormatter: (value) => `${value?.toFixed(2)}°`,
            },
          ]}
          xAxis={[
            {
              scaleType: 'time',
              dataKey: 'year',
              disableLine: true,
              valueFormatter: (value) => value.getFullYear().toString(),
              colorMap: {
                type: 'piecewise',
                thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
                colors: ['blue', 'gray', 'red'],
              },
            },
          ]}
          yAxis={[
            {
              disableLine: true,
              disableTicks: true,
              valueFormatter: (value: number) => `${value}°`,
            },
          ]}
          grid={{ horizontal: true }}
          height={300}
          slots={{
            legend: PiecewiseColorLegend,
          }}
          slotProps={{
            legend: {
              axisDirection: 'x',
              direction: props.direction,
              markType: props.markType,
              labelPosition: props.labelPosition,
              labelFormatter: props.onlyShowExtremes
                ? (params) =>
                    params.index === 0 || params.index === params.length
                      ? piecewiseColorDefaultLabelFormatter(params)
                      : ''
                : undefined,
              sx: {
                padding: props.padding,
              },
            },
          }}
        >
          <ChartsReferenceLine y={0} />
        </LineChart>
      )}
      getCode={({ props }) => {
        return `import { 
  PiecewiseColorLegend,
  piecewiseColorDefaultLabelFormatter,
} from '@mui/x-charts/ChartsLegend';

<LineChart
  {/** ... */}
  slots={{ legend: PiecewiseColorLegend }}
  slotProps={{
    legend: {
      axisDirection: 'x',
      direction: '${props.direction}',
      markType: '${props.markType}',
      labelPosition: '${props.labelPosition}',
      sx: { padding: ${props.padding} },${props.onlyShowExtremes ? "\n      labelFormatter: (params) =>\n        params.index === 0 || params.index === params.length\n          ? piecewiseColorDefaultLabelFormatter(params) \n          : ''" : ''}
    },
  }}
/>
`;
      }}
    />
  );
}

```

## Click event

You can pass an `onItemClick` function to the `ChartsLegend` or `PiecewiseColorLegend` components to handle click events.
They both provide the following signature.

```js
const clickHandler = (
  event, // The click event.
  context, // An object that identifies the clicked item.
  index, // The index of the clicked item.
) => {};
```

The `context` object contains different properties depending on the legend type.
Click the legend items to see their content.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

import { ChartsLegend, PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';

import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';

const pieSeries = [
  {
    type: 'pie',
    id: 'series-1',
    data: [
      { label: 'Pie A', id: 'P1-A', value: 400 },
      { label: 'Pie B', id: 'P2-B', value: 300 },
    ],
  },
] as const;

const barSeries = [
  {
    type: 'bar',
    id: 'series-1',
    label: 'Series 1',
    data: [0, 1, 2],
  },
  {
    type: 'bar',
    id: 'series-2',
    label: 'Series 2',
    data: [0, 1, 2],
  },
] as const;

const lineSeries = [
  {
    type: 'line',
    id: 'series-1',
    label: 'Series 1',
    data: [0, 1, 2],
  },
  {
    type: 'line',
    id: 'series-2',
    label: 'Series 2',
    data: [0, 1, 2],
  },
] as const;

export default function LegendClick() {
  const [itemData, setItemData] = React.useState<any>();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'start',
        }}
      >
        <Typography>Chart Legend</Typography>
        <ChartDataProvider series={barSeries} width={400} height={60}>
          <ChartsLegend
            direction="horizontal"
            // @ts-ignore
            onItemClick={(event, context, index) => setItemData([context, index])}
          />
        </ChartDataProvider>
        <Typography>Pie Chart Legend</Typography>
        <ChartDataProvider series={pieSeries} width={400} height={60}>
          <ChartsLegend
            direction="horizontal"
            onItemClick={(event, context, index) => setItemData([context, index])}
          />
        </ChartDataProvider>
        <Typography>Piecewise Color Legend</Typography>
        <ChartDataProvider
          // @ts-ignore
          series={lineSeries}
          width={400}
          height={60}
          xAxis={[
            {
              scaleType: 'linear',
              data: [0, 1, 3],
              disableLine: true,
              colorMap: {
                type: 'piecewise',
                thresholds: [0, 2],
                colors: ['blue', 'gray', 'red'],
              },
            },
          ]}
        >
          <PiecewiseColorLegend
            direction="horizontal"
            axisDirection="x"
            // @ts-ignore
            onItemClick={(event, context, index) => setItemData([context, index])}
          />
        </ChartDataProvider>
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
              // @ts-ignore
              setItemData(null);
            }}
          >
            <UndoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <HighlightedCode
          code={`// Index from item click: ${itemData ? itemData[1] : ''}

// Context from item click
${itemData ? JSON.stringify(itemData[0], null, 2) : '// The data will appear here'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}

```
