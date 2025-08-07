---
title: React Gauge chart
productId: x-charts
components: Gauge, GaugeContainer
packageName: '@mui/x-charts'
githubLabel: 'scope: charts'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/meter/
---

# Charts - Gauge

Gauge let the user evaluate metrics.

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

## Basics

The Gauge displays a numeric value that varies within a defined range.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';

export default function BasicGauges() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
      <Gauge width={100} height={100} value={60} />
      <Gauge width={100} height={100} value={60} startAngle={-90} endAngle={90} />
    </Stack>
  );
}

```

## Value range

The Gauge's value is provided through the `value` props, which accept a value range between 0 and 100.
To modify it, use the `valueMin` and `valueMax` props.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';

export default function GaugeValueRange() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
      <Gauge width={100} height={100} value={50} />
      <Gauge width={100} height={100} value={50} valueMin={10} valueMax={60} />
    </Stack>
  );
}

```

## Arcs configuration

Modify the arc shape with the following props:

- `startAngle` and `endAngle`: The angle range provided in degrees
- `innerRadius` and `outerRadius`: The arc's radii. It can be a fixed number of pixels or a percentage string, which will be a percent of the maximal available radius
- `cornerRadius`: It can be a fixed number of pixels or a percentage string, which will be a percent of the maximal available radius

```tsx
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Box from '@mui/material/Box';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

export default function ArcPlayground() {
  return (
    <ChartsUsageDemo
      componentName="Gauge"
      data={{
        value: {
          knob: 'number',
          defaultValue: 75,
          step: 1,
          min: 0,
          max: 100,
        },
        startAngle: {
          knob: 'number',
          defaultValue: 0,
          step: 1,
          min: -360,
          max: 360,
        },
        endAngle: {
          knob: 'number',
          defaultValue: 360,
          step: 1,
          min: -360,
          max: 360,
        },
        innerRadius: {
          knob: 'number',
          defaultValue: 80,
          step: 1,
          min: 0,
          max: 100,
        },
        outerRadius: {
          knob: 'number',
          defaultValue: 100,
          step: 1,
          min: 0,
          max: 100,
        },
      }}
      renderDemo={(props) => (
        <Box
          sx={{
            width: '100%',
            height: 200,
            margin: 'auto',
          }}
        >
          <Gauge
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 45,
              },
            }}
            {...props}
            innerRadius={`${props.innerRadius}%`}
            outerRadius={`${props.outerRadius}%`}
          />
        </Box>
      )}
      getCode={({ props }) => {
        const { innerRadius, outerRadius, ...numberProps } = props;
        return `import { Gauge } from '@mui/x-charts/Gauge';

<Gauge
  ${Object.entries(numberProps)
    .map(([name, value]) => `${name}={${value}}`)
    .join('\n  ')}
  ${Object.entries({ innerRadius, outerRadius })
    .map(([name, value]) => `${name}="${value}%"`)
    .join('\n  ')}
  // ...
/>
`;
      }}
    />
  );
}

```

:::success
Notice that the arc position is computed to let the Gauge take as much space as possible in the drawing area.

Use the `cx` and/or `cy` props to fix the coordinate of the arc center.
:::

## Text configuration

By default, the Gauge displays the value in the center of the arc.
To modify it, use the `text` prop.

This prop can be a string, or a formatter.
In the second case, the formatter argument contains the `value`, `valueMin` and `valueMax`.

To modify the text's layout, use the `gaugeClasses.valueText` class name.

```tsx
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Box from '@mui/material/Box';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

export default function TextPlayground() {
  return (
    <ChartsUsageDemo
      componentName="Gauge"
      data={{
        value: {
          knob: 'number',
          defaultValue: 75,
          step: 1,
          min: 0,
          max: 100,
        },
        fontSize: {
          knob: 'number',
          defaultValue: 40,
          step: 1,
          min: 5,
          max: 50,
        },
        dx: {
          knob: 'number',
          defaultValue: 0,
          step: 1,
          min: -100,
          max: 100,
        },
        dy: {
          knob: 'number',
          defaultValue: 0,
          step: 1,
          min: -100,
          max: 100,
        },
      }}
      renderDemo={(props) => (
        <Box
          sx={{
            width: '100%',
            height: 200,
            margin: 'auto',
            mb: 4,
          }}
        >
          <Gauge
            startAngle={-110}
            endAngle={110}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: props.fontSize,
                transform: `translate(${props.dx}px, ${props.dy}px)`,
              },
            }}
            value={props.value}
            text={({ value, valueMax }) => `${value} / ${valueMax}`}
          />
        </Box>
      )}
      getCode={({
        props,
      }) => `import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

<Gauge
  value={${props.value}}
  startAngle={-110}
  endAngle={110}
  sx={{
    [& .${gaugeClasses.valueText}]: {
      fontSize: ${props.fontSize},
      transform: 'translate(${props.dx}px, ${props.dy}px)',
    },
  }}
  text={({ value, valueMax }) => \`\${value} / \${valueMax}\`}
/>
`}
    />
  );
}

```

## Arc design

To customize the Gauge styles, use the `gaugeClasses` export to pull class names from different parts of the component, such as `valueText`, `valueArc`, and `referenceArc`.

For a full reference list, visit the [API page](/x/api/charts/gauge/#classes).

```tsx
import * as React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const settings = {
  width: 200,
  height: 200,
  value: 60,
};

export default function ArcDesign() {
  return (
    <Gauge
      {...settings}
      cornerRadius="50%"
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 40,
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: '#52b202',
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: theme.palette.text.disabled,
        },
      })}
    />
  );
}

```

## Adding elements

### Using the default Gauge

To insert more elements into the Gauge, the first option would be to add them as children, which means they will be stacked on top of the default rendering.

```tsx
import { Gauge } from '@mui/x-charts/Gauge';

<Gauge value={25} valueMax={50}>
  <AddedElement />
</Gauge>;
```

### Using the Gauge container

The second option is to make use of the following elements that are available within the Gauge module:

- Gauge Reference Arc
- Gauge Value Arc
- Gauge Value Text

```tsx
import {
  GaugeContainer,
  Gauge,
  GaugeReferenceArc,
  GaugeValueArc,
} from '@mui/x-charts/Gauge';

<GaugeContainer value={25} valueMax={50}>
  <GaugeReferenceArc />
  <GaugeValueArc />
  <AddedElement />
</GaugeContainer>;
```

### Creating your components

To create your own components, use the `useGaugeState()` hook which provides all you need about the gauge configuration:

- information about the value: `value`, `valueMin`, `valueMax`
- information to plot the arc: `startAngle`, `endAngle`, `outerRadius`, `innerRadius`, `cornerRadius`, `cx`, and `cy`
- computed values:
  - `maxRadius`: the maximal radius that can fit the drawing area
  - `valueAngle`: the angle associated with the current value

```tsx
import * as React from 'react';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

export default function CompositionExample() {
  return (
    <GaugeContainer
      width={200}
      height={200}
      startAngle={-110}
      endAngle={110}
      value={30}
    >
      <GaugeReferenceArc />
      <GaugeValueArc />
      <GaugePointer />
    </GaugeContainer>
  );
}

```

## Accessibility

The MUI X Gauge is compliant with the [Meter ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/meter/), which includes the addition of the `meter` role to the parent container and correct usage of the `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes.

### Label

If a visible label is available, reference it by adding `aria-labelledby` attribute.
Otherwise, the label can be manually provided by `aria-label`.

### Presentation

Assistive technologies often present the value as a percentage.
This can be modified by providing `aria-valuetext` attribute.

For example, a battery level indicator is better with an hour-long duration.

```jsx
<h3 id="battery_level_label">
  Battery level
</h3>
<Gauge
  value={6}
  valueMax={12}
  aria-labelledby="battery_level_label"
  aria-valuetext="50% (6 hours) remaining"
/>
```

## Composition

Use the `<GaugeContainer />` to provide all the parameters as props: `value`, `valueMin`, `valueMax`, `startAngle`, `endAngle`, etc.

In addition to the common chart components available for [composition](/x/react-charts/composition/), you can use the following components:

- `<GaugeReferenceArc />` renders the reference arc.
- `<GaugeValueArc />` renders the value arc.
- `<GaugeValueText />` renders the text at the center.

Here's how the Gauge is composed:

```jsx
<GaugeContainer>
  <GaugeReferenceArc />
  <GaugeValueArc skipAnimation={skipAnimation} />
  <GaugeValueText text={text} />
</GaugeContainer>
```
