---
title: React Pie chart
productId: x-charts
components: PieArc, PieArcLabel, PieArcLabelPlot, PieArcPlot, PieChart, PiePlot, PieChartPro, ChartsWrapper
---

# Charts - Pie

<p class="description">Show parts of a whole as arcs or angles in a circle for quick comparison of proportions.</p>

## Overview

A pie chart shows proportions of a whole so you can compare how much each category contributes to the total.
You need:

- One categorical dimension (each category is a slice)
- One numeric value per category (sizes are converted to a share of the whole)

The demo below compares survival rates of passengers by class on the Titanic.

{{"demo": "TitanicPie.js"}}

## Basics

A pie chart series must include a `data` property with an array of objects.
Each object is one slice and must have a `value` property.
You can add optional properties such as `label`.

Add an `id` property to each item if you will update or reorder the data, since it is used for React `key` props.

{{"demo": "BasicPie.js"}}

## Donut chart

A donut chart (or doughnut chart) is a pie chart with a hollow center.

Set the `innerRadius` property to a value greater than 0 to turn any pie chart into a donut.

{{"demo": "DonutChart.js"}}

## Colors

You can customize pie colors in two ways:

1. Pass a [color palette](/x/react-charts/styling/#built-in-color-palettes). Each arc uses a color from the palette.
2. Set a `color` property on each item in `data` to override the palette for that slice.

```jsx
<PieChart
  colors={['red', 'blue', 'green']} // Use palette
  series={[
    {
      data: [
        { value: 10, color: 'orange' }, // Use color property
        // ...
      ],
    },
  ]}
/>
```

{{"demo": "PieColor.js"}}

## Sizing

Pie series shape is controlled by these properties:

- `innerRadius` — distance from the center to the inner edge of the arc. Default is 0.
- `outerRadius` — distance from the center to the outer edge of the arc. Default is the largest value that fits in the drawing area.
- `arcLabelRadius` — distance from the center to the arc labels.
- `paddingAngle` — angle in degrees between adjacent arcs.
- `cornerRadius` — rounds the arc corners, similar to CSS `border-radius`.
- `startAngle` / `endAngle` — angle range of the pie in degrees.
- `cx` / `cy` — center of the pie. Default is the center of the drawing area.

{{"demo": "PieShape.js", "hideToolbar": true, "bg": "playground"}}

The following accept percentage strings (for example `'50%'`):

- `innerRadius`, `outerRadius`, and `arcLabelRadius` — `'100%'` means the full radius that fits in the drawing area.
- `cx` and `cy` — `'100%'` means the width or height of the drawing area.

## Labels

Set the `arcLabel` property on the series to show labels on the arcs.
Pass a function that receives the arc's data object and returns the label string, or use one of these values:

- `'value'` — the arc's raw value
- `'formattedValue'` — the result of `valueFormatter` for the arc
- `'label'` — the arc's `label` property, if present

Set `arcLabelMinAngle` so that arcs with an angle smaller than that value (in degrees) do not show a label.

{{"demo": "PieArcLabel.js"}}

## Highlight

Add the `highlightScope` property to a pie series to control highlighting.
See the [highlighting page](/x/react-charts/highlighting/#highlighting-series) for how it works.

Use the `.MuiPieArc-faded` and `.MuiPieArc-highlighted` CSS classes to style arcs when they are faded or highlighted.

CSS works well for changing `color`, `stroke-width`, or `opacity`.
To change the size of an arc when highlighted or faded, use the `highlighted` and `faded` properties to override `innerRadius`, `outerRadius`, or `cornerRadius`.

Use `additionalRadius` to add to `outerRadius` instead of setting an absolute value.
A negative value shrinks the arc.

{{"demo": "PieActiveArc.js"}}

## Click event

The pie chart provides an `onItemClick` handler for clicks on a specific arc.
It uses this signature:

```js
const onItemClick = (
  event, // The mouse event.
  params, // An object that identifies the clicked element.
) => {};
```

{{"demo": "PieClick.js"}}

## CSS

Use CSS to customize the elements that the pie chart renders.

The demo below uses the `data-series` attribute to select the outer series and reduce its opacity.

{{"demo": "PieCSSStyling.js"}}

## Animation

Chart containers respect the [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) media query.
You can also turn off animation by setting the `skipAnimation` prop to `true`.

With `skipAnimation` set, the chart renders without animation.

```jsx
// For a single component chart
<PieChart skipAnimation />

// For a composed chart
<ChartsDataProvider>
  <PiePlot skipAnimation />
</ChartsDataProvider>
```

{{"demo": "PieAnimation.js"}}

## Composition

Use `ChartsDataProvider` to supply the `series` prop when composing a custom chart.

In addition to the shared components described in [Composition](/x/react-charts/composition/), you can use `PiePlot` to draw the pie slices and their labels.

The following shows how the pie chart is built:

```jsx
<ChartsDataProvider plugins={PIE_CHART_PLUGINS}>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      <PiePlot />
      <FocusedPieArc />
      <ChartsOverlay />
    </ChartsSurface>
    <ChartsTooltip trigger="item" />
  </ChartsWrapper>
</ChartsDataProvider>
```

:::info
`ChartsDataProvider` accepts a [`plugins`](/x/react-charts/plugins/) prop.
For pie charts, pass plugins that remove cartesian-axis behavior so it does not affect the pie position.

Pro users can use `PIE_CHART_PRO_PLUGINS` to enable export.
:::
