---
title: Charts - Line demonstration
productId: x-charts
components: LineChart, LineElement, LineHighlightElement, LineHighlightPlot, LinePlot, MarkElement, MarkPlot
---

# Charts - Line demonstration

This page groups demonstration using line charts.

## SimpleLineChart

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function SimpleLineChart() {
  return (
    <LineChart
      height={300}
      series={[
        { data: pData, label: 'pv' },
        { data: uData, label: 'uv' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ width: 50 }]}
      margin={margin}
    />
  );
}

```

## TinyLineChart

```tsx
import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import {
  LinePlot,
  MarkPlot,
  lineElementClasses,
  markElementClasses,
} from '@mui/x-charts/LineChart';

const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function TinyLineChart() {
  return (
    <ChartContainer
      width={500}
      height={300}
      series={[{ type: 'line', data: pData }]}
      xAxis={[{ scaleType: 'point', data: xLabels, position: 'none' }]}
      yAxis={[{ position: 'none' }]}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          stroke: '#8884d8',
          strokeWidth: 2,
        },
        [`& .${markElementClasses.root}`]: {
          stroke: '#8884d8',
          r: 4, // Modify the circle radius
          fill: '#fff',
          strokeWidth: 2,
        },
      }}
      disableAxisListener
    >
      <LinePlot />
      <MarkPlot />
    </ChartContainer>
  );
}

```

## DashedLineChart

```tsx
import * as React from 'react';
import {
  LineChart,
  lineElementClasses,
  markElementClasses,
} from '@mui/x-charts/LineChart';

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function DashedLineChart() {
  return (
    <LineChart
      height={300}
      series={[
        { data: pData, label: 'pv', id: 'pvId' },
        { data: uData, label: 'uv', id: 'uvId' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ width: 50 }]}
      sx={{
        [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
          strokeWidth: 1,
        },
        [`.${lineElementClasses.root}[data-series="pvId"]`]: {
          strokeDasharray: '5 5',
        },
        [`.${lineElementClasses.root}[data-series="uvId"]`]: {
          strokeDasharray: '3 4 5 2',
        },
        [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]: {
          fill: '#fff',
        },
        [`& .${markElementClasses.highlighted}`]: {
          stroke: 'none',
        },
      }}
      margin={margin}
    />
  );
}

```

## BiaxialLineChart

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function BiaxialLineChart() {
  return (
    <LineChart
      height={300}
      series={[
        { data: pData, label: 'pv', yAxisId: 'leftAxisId' },
        { data: uData, label: 'uv', yAxisId: 'rightAxisId' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[
        { id: 'leftAxisId', width: 50 },
        { id: 'rightAxisId', position: 'right' },
      ]}
    />
  );
}

```

## LineChartWithReferenceLines

```tsx
import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function LineChartWithReferenceLines() {
  return (
    <ChartContainer
      width={500}
      height={300}
      series={[
        { data: pData, label: 'pv', type: 'line' },
        { data: uData, label: 'uv', type: 'line' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ width: 50 }]}
      margin={margin}
    >
      <LinePlot />
      <MarkPlot />
      <ChartsReferenceLine
        x="Page C"
        label="Max PV PAGE"
        lineStyle={{ stroke: 'red' }}
      />
      <ChartsReferenceLine y={9800} label="Max" lineStyle={{ stroke: 'red' }} />
      <ChartsXAxis />
      <ChartsYAxis />
    </ChartContainer>
  );
}

```

## LineChartConnectNulls

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
const data = [4000, 3000, 2000, null, 1890, 2390, 3490];
const xData = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];
export default function LineChartConnectNulls() {
  return (
    <Stack sx={{ width: '100%' }}>
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point' }]}
        series={[{ data }]}
        height={200}
        margin={margin}
      />
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point' }]}
        series={[{ data, connectNulls: true }]}
        height={200}
        margin={margin}
      />
    </Stack>
  );
}

```

## Line chart with live data

```tsx
import * as React from 'react';
import Button from 'node_modules/@mui/material/Button';
import { LineChart } from '@mui/x-charts/LineChart';

const dateFormatter = Intl.DateTimeFormat(undefined, {
  month: '2-digit',
  day: '2-digit',
});
const oneDay = 24 * 60 * 60 * 1000; // in milliseconds

const length = 50;
const initialFirstData = Array.from<number>({ length }).map(
  (_, __, array) => (array.at(-1) ?? 0) + randBetween(-100, 500),
);
const initialSecondData = Array.from<number>({ length }).map(
  (_, __, array) => (array.at(-1) ?? 0) + randBetween(-500, 100),
);

export default function LiveLineChartNoSnap() {
  const [running, setRunning] = React.useState(false);
  const [date, setDate] = React.useState(new Date(2000, 0, 0));
  const [firstData, setFirstData] = React.useState(initialFirstData);
  const [secondData, setSecondData] = React.useState(initialSecondData);

  React.useEffect(() => {
    if (!running) {
      return undefined;
    }
    const intervalId = setInterval(() => {
      setDate((prev) => new Date(prev.getTime() + oneDay));
      setFirstData((prev) => [
        ...prev.slice(1),
        prev.at(-1)! + randBetween(-500, 500),
      ]);
      setSecondData((prev) => [
        ...prev.slice(1),
        prev.at(-1)! + randBetween(-500, 500),
      ]);
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [running]);

  return (
    <div style={{ width: '100%' }}>
      <LineChart
        height={300}
        skipAnimation
        series={[
          { data: secondData, showMark: false },
          { data: firstData, showMark: false },
        ]}
        xAxis={[
          {
            scaleType: 'point',
            data: Array.from({ length }).map(
              (_, i) => new Date(date.getTime() + i * oneDay),
            ),
            valueFormatter: (value: Date) => dateFormatter.format(value),
          },
        ]}
        yAxis={[{ width: 50 }]}
        margin={{ right: 24 }}
      />
      <Button size="small" variant="contained" onClick={() => setRunning((p) => !p)}>
        {running ? 'stop' : 'start'}
      </Button>
      <Button
        size="small"
        variant="outlined"
        sx={{ marginLeft: 1.5 }}
        onClick={() => {
          setFirstData(initialFirstData);
          setSecondData(initialSecondData);
        }}
      >
        reset
      </Button>
    </div>
  );
}

function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

```

## Line with forecast

To show that parts of the data have different meanings, you can render stylised lines for each of them.

In the following example, the chart shows a dotted line to exemplify that the data is estimated.
To do so, the `slots.line` is set with a custom component that render the default line twice.

- The first one is clipped to show known values (from the left of the chart to the limit).
- The second one is clipped to show predictions (from the limit to the right of the chart) with dash styling.

Additionally, an uncertainty area is shown to represent the uncertainty of the forecast.

```tsx
import * as React from 'react';
import {
  AnimatedLine,
  AnimatedLineProps,
  LinePlot,
  MarkPlot,
} from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import {
  useChartId,
  useDrawingArea,
  useLineSeries,
  useXAxis,
  useXScale,
  useYScale,
} from '@mui/x-charts/hooks';
import * as d3Shape from '@mui/x-charts-vendor/d3-shape';
import { SxProps } from '@mui/system';
import { useTheme, Theme } from '@mui/material/styles';

interface CustomAnimatedLineProps extends AnimatedLineProps {
  limit?: number;
  sxBefore?: SxProps<Theme>;
  sxAfter?: SxProps<Theme>;
}

function CustomAnimatedLine(props: CustomAnimatedLineProps) {
  const { limit, sxBefore, sxAfter, ...other } = props;
  const { top, bottom, height, left, width } = useDrawingArea();
  const scale = useXScale();
  const chartId = useChartId();

  if (limit === undefined) {
    return <AnimatedLine {...other} />;
  }

  const limitPosition = scale(limit); // Convert value to x coordinate.

  if (limitPosition === undefined) {
    return <AnimatedLine {...other} />;
  }

  const clipIdleft = `${chartId}-${props.ownerState.id}-line-limit-${limit}-1`;
  const clipIdRight = `${chartId}-${props.ownerState.id}-line-limit-${limit}-2`;
  return (
    <React.Fragment>
      {/* Clip to show the line before the limit */}
      <clipPath id={clipIdleft}>
        <rect
          x={left}
          y={0}
          width={limitPosition - left}
          height={top + height + bottom}
        />
      </clipPath>
      {/* Clip to show the line after the limit */}
      <clipPath id={clipIdRight}>
        <rect
          x={limitPosition}
          y={0}
          width={left + width - limitPosition}
          height={top + height + bottom}
        />
      </clipPath>
      <g clipPath={`url(#${clipIdleft})`} className="line-before">
        <AnimatedLine {...other} />
      </g>
      <g clipPath={`url(#${clipIdRight})`} className="line-after">
        <AnimatedLine {...other} />
      </g>
    </React.Fragment>
  );
}

function ForecastArea({
  limit,
  forecast,
}: {
  limit: number;
  forecast: { y0: number; y1: number }[];
}) {
  const lineSeries = useLineSeries();
  const xAxis = useXAxis();
  const xScale = useXScale();
  const yScale = useYScale();

  const xAxisData: number[] = xAxis.data?.slice(limit) ?? [];

  if (!yScale) {
    return null;
  }

  return (
    <React.Fragment>
      {lineSeries.map((series) => {
        const data = xAxisData.map((v, i) => ({
          x: v,
          y0: forecast[i].y0,
          y1: forecast[i].y1,
        }));

        const path = d3Shape
          .area<(typeof data)[number]>()
          .x((d) => xScale(d.x)!)
          .y0((d) => yScale(d.y0)!)
          .y1((d) => yScale(d.y1)!)(data)!;

        return <path key={`forecast-area-${series.id}`} d={path} fill="#0000ff44" />;
      })}
    </React.Fragment>
  );
}

function ShadedBackground({ limit }: { limit: number }) {
  const { top, bottom, height, left, width } = useDrawingArea();
  const scale = useXScale();
  const limitPosition = scale(limit)!;
  const theme = useTheme();
  const fill =
    theme.palette.mode === 'dark'
      ? theme.palette.grey[900]
      : theme.palette.grey[400];

  return (
    <rect
      x={limitPosition}
      y={0}
      width={left + width - limitPosition}
      height={top + height + bottom}
      fill={fill}
      opacity={0.4}
    />
  );
}

export default function LineWithUncertaintyArea() {
  const id = React.useId();
  const clipPathId = `${id}-clip-path`;

  return (
    <ChartContainer
      series={[
        {
          type: 'line',
          data: [1, 2, 3, 4, 1, 2, 3, 4, 5],
          valueFormatter: (v, i) => `${v}${i.dataIndex > 5 ? ' (estimated)' : ''}`,
        },
      ]}
      xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6, 7, 8] }]}
      height={200}
      sx={{ '& .line-after path': { strokeDasharray: '10 5' } }}
    >
      <ChartsXAxis />
      <ChartsYAxis />

      <g clipPath={`url(#${clipPathId})`}>
        <ShadedBackground limit={5} />
        <LinePlot
          slots={{ line: CustomAnimatedLine }}
          slotProps={{ line: { limit: 5 } as any }}
        />
        <ForecastArea
          limit={5}
          forecast={[
            { y0: 2, y1: 2 },
            { y0: 2.3, y1: 4 },
            { y0: 3, y1: 5 },
            { y0: 4.4, y1: 5.8 },
          ]}
        />
      </g>
      <g data-drawing-container>
        <MarkPlot />
      </g>
      <ChartsTooltip />
      <ChartsClipPath id={clipPathId} />
    </ChartContainer>
  );
}

```

## CustomLineMarks

Notice that using another shape than "circle" renders a `<path />` instead of the `<circle />` for mark elements.
This modification implies a small drop of rendering performances (around +50ms to render 1.000 marks).

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function CustomLineMarks() {
  return (
    <LineChart
      height={300}
      series={[
        {
          data: pData,
          label: 'pv',
          shape: 'cross',
          showMark: ({ index }) => index % 2 === 0,
        },
        {
          data: uData,
          label: 'uv',
          shape: 'diamond',
          showMark: ({ index }) => index % 2 === 0,
        },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ width: 50 }]}
      margin={margin}
    />
  );
}

```

## Larger interaction area

A line is highlighted when a pointer is hovering over it.
Which is a narrow interaction area.
While a permanent solution isn't implemented, it's possible to define a larger interaction area with slots.

The idea is to have two paths:
A small one to display the line, and a larger invisible one that handles the interactions.

This solution has an issue when lines cross over each other, as the highlight is not on the closest line to the pointer, but by the last defined series.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AnimatedLineProps, LineChart } from '@mui/x-charts/LineChart';
import { HighlightScope } from '@mui/x-charts/context';

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

const highlightScope: HighlightScope = {
  highlight: 'item',
  fade: 'global',
};

const settings = {
  height: 300,
  series: [
    { data: pData, label: 'pv', highlightScope },
    { data: uData, label: 'uv', highlightScope },
  ],
  xAxis: [{ scaleType: 'point', data: xLabels }],
  yAxis: [{ width: 50 }],
  margin,
} as const;

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
      <path
        d={d}
        stroke="transparent"
        strokeWidth={25}
        fill="none"
        className="interaction-area"
        {...other}
      />
    </React.Fragment>
  );
}

export default function LargerHighlightLineNoSnap() {
  const [showInteractionArea, setShowInteractionArea] = React.useState(true);

  return (
    <Box
      sx={{
        width: '100%',
        '& .interaction-area': showInteractionArea
          ? {
              stroke: 'lightgray',
              strokeOpacity: 0.3,
            }
          : {},
      }}
    >
      <FormControlLabel
        checked={showInteractionArea}
        control={
          <Checkbox
            onChange={(event) => setShowInteractionArea(event.target.checked)}
          />
        }
        label="Show highlight area"
        labelPlacement="end"
      />
      <LineChart {...settings} slots={{ line: CustomLine }} />
    </Box>
  );
}

```
