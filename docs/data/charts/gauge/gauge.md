---
title: React Gauge chart
productId: x-charts
components: Gauge, GaugeContainer
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/meter/
---

# Charts - Gauge

<p class="description">Gauge charts let the user evaluate metrics.</p>

## Basic gauge

The Gauge display a numeric value that varies within a defined range.

{{"demo": "BasicGauges.js"}}

## Value range

The value of the Gauge is provided by props `value`.

By default it's assumed to be between 0 and 100.
You can modify this range with props `valueMin` and `valueMax`.

{{"demo": "GaugeValueRangeNoSnap.js"}}

## Arcs configuration

You can modify the arc shape with the following props:

- `startAngle`, `endAngle`: Angle range provided in degrees
- `innerRadius`, `outerRadius`: Radius of the arc. It can be a number for fix number of px. Or a percentage string which will be a percent of the maximal available radius.
- `cornerRadius`: It can be a number for fix number of px. Or a percentage string which will be a percent of distance between inner and outer radius.

{{"demo": "PlaygroundNoSnap.js"}}

:::info
Notice that the arc position is computed to let the Gauge take as much space as possible in the drawing area.

Provide props `cx` and/or `cy` to fix the coordinate of the arc center.
:::

## Accessibility

(WAI-ARIA: [https://www.w3.org/WAI/ARIA/apg/patterns/meter/](https://www.w3.org/WAI/ARIA/apg/patterns/meter/))

### Label

If a visible label is available, reference it by adding `aria-labelledby` attribute.
Otherwise, the label can be provided by `aria-label`.

### Presentation

Assistive technologies often present the value as a percentage.
This can be modified by providing `aria-valuetext` attribute.

For example a battery level indicator is better with a duration in hours.

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
