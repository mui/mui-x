---
title: Charts - Animation
productId: x-charts
---

# Charts - Animation

Animate charts for a better look and feel.

Some elements of charts are animated, such as the bars in a bar chart or the slices in a pie chart.

Charts use CSS animations when possible, but some animations can't be done using CSS only. In those cases, JavaScript is used to animate elements.

The animations of elements that are animated using CSS can be customized by overriding the CSS classes:

```tsx
import * as React from 'react';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';

const data = [
  { id: 0, value: 10, label: 'series A' },
  { id: 1, value: 15, label: 'series B' },
  { id: 2, value: 20, label: 'series C' },
];

export default function CSSAnimationCustomization() {
  return (
    <PieChart
      series={[{ data, arcLabel: (item) => `${item.value}` }]}
      width={200}
      height={200}
      hideLegend
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          filter: 'drop-shadow(1px 1px 2px black)',

          animationName: 'animate-pie-arc-label',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate',

          '@keyframes animate-pie-arc-label': {
            '0%': { fill: 'red' },
            '33%': { fill: 'orange' },
            '66%': { fill: 'violet' },
            '100%': { fill: 'red' },
          },
        },
        [`& .${pieArcLabelClasses.root}.${pieArcLabelClasses.animate}`]: {
          animationDuration: '5s',
        },
      }}
    />
  );
}

```

When it isn't possible to leverage CSS animations, the default components are animated using custom hooks.

If you want to use the default animations in custom components, you can use these hooks.
They are available for each element that is animated using JavaScript and are prefixed with `useAnimate`.
The following hooks are available:

- `useAnimateArea`;
- `useAnimateBar`;
- `useAnimateBarLabel`;
- `useAnimateLine`;
- `useAnimatePieArc`;
- `useAnimatePieArcLabel`.

```tsx
import { BarChart, BarLabelProps } from '@mui/x-charts/BarChart';
import * as React from 'react';
import { useAnimateBarLabel } from '@mui/x-charts/hooks';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export default function JSDefaultAnimation() {
  const [key, animate] = React.useReducer((v) => v + 1, 0);

  return (
    <Stack>
      <BarChart
        key={key}
        xAxis={[{ data: ['A', 'B', 'C'] }]}
        series={[
          {
            type: 'bar',
            data: [5, 17, 11],
          },
          {
            type: 'bar',
            data: [0, 12, 15],
          },
          {
            type: 'bar',
            data: [1, 3, 9],
          },
        ]}
        width={300}
        height={400}
        barLabel="value"
        slots={{ barLabel: AnimatedBarLabel }}
      />
      <Button onClick={() => animate()}>Run Animation</Button>
    </Stack>
  );
}

const Text = styled('text')(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
}));

function AnimatedBarLabel(props: BarLabelProps) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  const animatedProps = useAnimateBarLabel({
    xOrigin,
    x,
    yOrigin,
    y,
    width,
    height,
    layout,
    skipAnimation,
  });

  return (
    <Text
      {...otherProps}
      textAnchor="middle"
      dominantBaseline="central"
      {...animatedProps}
    />
  );
}

```

To customize the animation, you can also use the `useAnimate(props, params)` hook.
It returns a ref and props to pass to the animated element.
Each time the `props` params get updated, the hook creates an interpolation from the previous value to the next one.
On each animation frame, it calls this interpolator to get the intermediate state and applies the result to the animated element.
The attribute update is imperative to bypass the React lifecycle, thus improving performance.
To customize the animation, the `params` allows you to define the following properties:

- `skip`: If `true`, apply the new value immediately;
- `ref`: A ref to merge with the ref returned from this hook;
- `initialProps`: The props used to generate the animation of component creation; if not provided, there will be no initial animation;
- `createInterpolator`: Create an interpolation function from the last to the next props;
- `transformProps`: Optionally transform interpolated props to another format;
- `applyProps`: Apply transformed props to the element.

A more detailed explanation is available in the hook's JSDoc.

In the example below, labels are positioned above the bars they refer to and are animated using the `useAnimation` hook:

```tsx
import { BarChart, BarLabelProps } from '@mui/x-charts/BarChart';
import * as React from 'react';
import { useAnimate } from '@mui/x-charts/hooks';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';

export default function JSAnimationCustomization() {
  const [key, animate] = React.useReducer((v) => v + 1, 0);

  return (
    <Stack>
      <BarChart
        key={key}
        xAxis={[{ data: ['A', 'B', 'C'] }]}
        series={[
          {
            type: 'bar',
            data: [5, 17, 11],
          },
          {
            type: 'bar',
            data: [0, 12, 15],
          },
          {
            type: 'bar',
            data: [1, 3, 9],
          },
        ]}
        width={300}
        height={400}
        barLabel="value"
        slots={{ barLabel: AnimatedBarLabel }}
      />
      <Button onClick={() => animate()}>Run Animation</Button>
    </Stack>
  );
}

function AnimatedBarLabel(props: BarLabelProps) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  const animatedProps = useAnimate(
    { x: x + width / 2, y: y - 2 },
    {
      initialProps: { x: x + width / 2, y: yOrigin },
      createInterpolator: interpolateObject,
      transformProps: (p) => p,
      applyProps: (element: SVGTextElement, p) => {
        element.setAttribute('x', p.x.toString());
        element.setAttribute('y', p.y.toString());
      },
      skip: skipAnimation,
    },
  );

  return (
    <text {...otherProps} fill={color} textAnchor="middle" {...animatedProps} />
  );
}

```

Alternatively, you can use your own animation library to create custom animations, such as React Spring:

```tsx
import { BarChart, BarLabelProps } from '@mui/x-charts/BarChart';
import * as React from 'react';
import { animated, useSpring } from '@react-spring/web';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function ReactSpringAnimationCustomization() {
  const [key, animate] = React.useReducer((v) => v + 1, 0);

  return (
    <Stack>
      <BarChart
        key={key}
        xAxis={[{ data: ['A', 'B', 'C'] }]}
        series={[
          {
            type: 'bar',
            data: [5, 17, 11],
          },
          {
            type: 'bar',
            data: [0, 12, 15],
          },
          {
            type: 'bar',
            data: [1, 3, 9],
          },
        ]}
        width={300}
        height={400}
        barLabel="value"
        slots={{ barLabel: AnimatedBarLabel }}
      />

      <Button onClick={() => animate()}>Run Animation</Button>
    </Stack>
  );
}

function AnimatedBarLabel(props: BarLabelProps) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  const style = useSpring({
    from: { y: yOrigin },
    to: { y: y - 4 },
    config: { tension: 100, friction: 10 },
  });

  return (
    <animated.text
      {...otherProps}
      // @ts-ignore
      fill={color}
      x={xOrigin + x + width / 2}
      width={width}
      height={height}
      style={style}
      textAnchor="middle"
    />
  );
}

```

Note that sometimes JavaScript animation libraries cause performance issues, especially when rendering many data points or when interactions are enabled (for example: zoom, highlight).
