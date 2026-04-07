---
title: React Gauge chart
productId: x-charts
components: Gauge, GaugeContainer
packageName: '@mui/x-charts'
githubLabel: 'scope: charts'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/meter/
---

# Charts - Gauge

<p class="description">Use gauge charts to show a numeric value within a defined range as an arc or meter.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

## Overview

A gauge shows a numeric value within a defined range, often as an arc or needle against a scale.
Use it for metrics like progress, capacity, or levels (for example, battery, storage, or completion).

The demo below shows basic gauge configurations.

{{"demo": "BasicGauges.js"}}

## Basics

Pass the current value with the `value` prop.
By default, the scale runs from 0 through 100.
Use `valueMin` and `valueMax` to set a different range.

{{"demo": "GaugeValueRange.js"}}

## Arc configuration

Use these props to change the arc shape:

- `startAngle` and `endAngle`: angle range in degrees
- `innerRadius` and `outerRadius`: arc radii, as a pixel value or a percentage string (such as `'50%'`)
- `cornerRadius`: corner rounding, as a pixel value or percentage string

{{"demo": "ArcPlayground.js", "bg": "playground", "hideToolbar": true}}

:::success
The arc is positioned to use as much of the drawing area as possible.

Use the `cx` and `cy` props to fix the arc center.
:::

## Text configuration

The gauge shows the value in the center of the arc by default.
Use the `text` prop to customize the center text.
Pass a string or a formatter function.
The formatter receives an object with `value`, `valueMin`, and `valueMax`.

Use the `gaugeClasses.valueText` class to change the text layout.

{{"demo": "TextPlayground.js", "bg": "playground", "hideToolbar": true}}

## Arc design

Use the `gaugeClasses` export for class names that target different parts of the gauge, such as `valueText`, `valueArc`, and `referenceArc`.

See [Gauge—Classes](/x/api/charts/gauge/#classes) for the full list.

{{"demo": "ArcDesign.js"}}

## Adding elements

### Using the default Gauge

Add elements as children of `Gauge` to render them on top of the default arc and text.

```tsx
import { Gauge } from '@mui/x-charts/Gauge';

<Gauge value={25} valueMax={50}>
  <AddedElement />
</Gauge>;
```

### Using the Gauge container

Use `GaugeContainer` and the following components when you need more control over the layout:

- `GaugeReferenceArc`: the reference arc
- `GaugeValueArc`: the value arc
- `GaugeValueText`: the text in the center

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

### Creating custom components

Use the `useGaugeState()` hook to build custom gauge components.
It returns:

- Value info: `value`, `valueMin`, `valueMax`
- Arc geometry: `startAngle`, `endAngle`, `outerRadius`, `innerRadius`, `cornerRadius`, `cx`, `cy`
- Computed: `maxRadius` (largest radius that fits the drawing area) and `valueAngle` (angle for the current value)

{{"demo": "CompositionExample.js"}}

## Accessibility

The gauge follows the [Meter ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/meter/).
The container has the `meter` role, and `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` match the value range.

### Label

If the gauge has a visible label, set `aria-labelledby` to point to it.
Otherwise, provide a label with `aria-label`.

### Presentation

Assistive technologies often present the value as a percentage.
You can override this by setting the `aria-valuetext` attribute.

For example, a battery level indicator is clearer when it announces a duration (such as hours remaining) instead of only a percentage.

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

Use `GaugeContainer` to supply the gauge parameters: `value`, `valueMin`, `valueMax`, `startAngle`, `endAngle`, and so on.

In addition to the shared chart components available for [composition](/x/react-charts/composition/), you can use:

- `GaugeReferenceArc`: the reference arc
- `GaugeValueArc`: the value arc
- `GaugeValueText`: the text in the center

Here's how the gauge is composed:

```jsx
<GaugeContainer>
  <GaugeReferenceArc />
  <GaugeValueArc skipAnimation={skipAnimation} />
  <GaugeValueText text={text} />
</GaugeContainer>
```
