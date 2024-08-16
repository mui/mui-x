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

## Basics

The Gauge displays a numeric value that varies within a defined range.

{{"demo": "BasicGauges.js"}}

## Value range

The Gauge's value is provided through the `value` props, which accept a value range between 0 and 100.
To modify it, use the `valueMin` and `valueMax` props.

{{"demo": "GaugeValueRangeNoSnap.js"}}

## Arcs configuration

Modify the arc shape with the following props:

- `startAngle` and `endAngle`: The angle range provided in degrees
- `innerRadius` and `outerRadius`: The arc's radii. It can be a fixed number of pixels or a percentage string, which will be a percent of the maximal available radius
- `cornerRadius`: It can be a fixed number of pixels or a percentage string, which will be a percent of the maximal available radius

{{"demo": "ArcPlaygroundNoSnap.js", "bg": "playground", "hideToolbar": true }}

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

{{"demo": "TextPlaygroundNoSnap.js", "bg": "playground", "hideToolbar": true}}

## Arc design

To customize the Gauge styles, use the `chartsGaugeClasses` export to pull class names from different parts of the component, such as `valueText`, `valueArc`, and `referenceArc`.

For a full reference list, visit the [API page](/x/api/charts/gauge/#classes).

{{"demo": "ArcDesign.js"}}

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

To create your own components, use the `useGaugeState` hook which provides all you need about the gauge configuration:

- information about the value: `value`, `valueMin`, `valueMax`
- information to plot the arc: `startAngle`, `endAngle`, `outerRadius`, `innerRadius`, `cornerRadius`, `cx`, and `cy`
- computed values:
  - `maxRadius`: the maximal radius that can fit the drawing area
  - `valueAngle`: the angle associated with the current value

{{"demo": "CompositionExample.js"}}

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
