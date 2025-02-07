---
title: React Gauge chart
productId: x-charts
components: Gauge, GaugeContainer
packageName: '@mui/x-charts'
githubLabel: 'component: charts'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/meter/
---

# Charts - Gauge

<p class="description">Gauge charts let the user evaluate metrics.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

## Introduction

The Gauge displays a numeric value that varies within a defined range.

{{"demo": "BasicGauges.js"}}

## Basics

### Import

```tsx
import { Gauge } from '@mui/x-charts/Gauge';
```

### Value range

Use the `value` prop to set the value within the default range of 0 and 100.
You can adjust the minimum and maximum values using the `valueMin` and `valueMax` props, respectively.

{{"demo": "GaugeValueRangeNoSnap.js"}}

### Arc configuration

You can use the following props to modify the shape of the arc:

- `startAngle` and `endAngle`: The angle range provided in degrees
- `innerRadius` and `outerRadius`: The arc's radii, which can either be fixed numbers (in pixels), or percentages in strings that describe how much of the available space to fill
- `cornerRadius`: The corner radius, which can either be a fixed number (in pixels), or a percentage in a string that describes how much of the available space to fill

Try manipulating these dimensions in the playground below to see how they behave:

{{"demo": "ArcPlaygroundNoSnap.js", "bg": "playground", "hideToolbar": true }}

:::success
The arc position is computed to let the Gauge fill as much space as possible in the drawing area.
You can use the `cx` and/or `cy` props to keep the arc's center coordinates fixed to a given location.
:::

### Text configuration

By default, the Gauge displays its value in the center of the arc.
You can modify this content using the `text` prop, which accepts a string as well as a formatter.
The formatter's argument contains `value`, `valueMin` and `valueMax`.

To modify the text layout, use the `gaugeClasses.valueText` class name.

{{"demo": "TextPlaygroundNoSnap.js", "bg": "playground", "hideToolbar": true}}

## Customization

### Arc design

To customize the Gauge styles, use the `chartsGaugeClasses` export to pull class names from different parts of the component, such as `valueText`, `valueArc`, and `referenceArc`.

For a full reference list, visit the [API page](/x/api/charts/gauge/#classes).

{{"demo": "ArcDesign.js"}}

### Adding elements

#### Using the default Gauge

To insert more elements into the Gauge, the first option would be to add them as children, which means they will be stacked on top of the default rendering.

```tsx
import { Gauge } from '@mui/x-charts/Gauge';

<Gauge value={25} valueMax={50}>
  <AddedElement />
</Gauge>;
```

#### Using the Gauge container

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

## Composition

```tsx
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';
```

To compose your own Gauge component, use the `useGaugeState()` hook which provides all of the necessary props and values:

- information about the value: `value`, `valueMin`, `valueMax`
- information to plot the arc: `startAngle`, `endAngle`, `outerRadius`, `innerRadius`, `cornerRadius`, `cx`, and `cy`
- computed values:
  - `maxRadius`: the maximal radius that can fit the drawing area
  - `valueAngle`: the angle associated with the current value

{{"demo": "CompositionExample.js"}}

## Accessibility

The MUI X Gauge is compliant with the [Meter ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/meter/), which includes the addition of the `meter` role to the parent container and the appropriate usage of the `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes.

### Label

If a visible label is available, you should reference it by adding an `aria-labelledby` attribute.
Otherwise, you can use `aria-label` to label it manually.

### Presentation

Assistive technologies often present the value as a percentage, which may not be accurate or useful to the user.
You can use the `aria-valuetext` attribute to explicitly define how an assistive device should describe the units.

The snippet shows how to use this attribute in the context of a battery level indicator to let the user know how many hours of battery life are remaining.

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
