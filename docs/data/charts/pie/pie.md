---
title: React Pie chart
productId: x-charts
components: PieArc, PieArcLabel, PieArcLabelPlot, PieArcPlot, PieChart, PiePlot, PieChartPro, ChartsWrapper
---

# Charts - Pie

<p class="description">Pie charts express portions of a whole, using arcs or angles within a circle.</p>

## Overview

Pie charts are ideal for showing proportions of a whole.
They excel at visualizing how categories contribute to a total, making relative shares easy to compare at a glance.
Here are the basic requirements to create a pie chart:

- One categorical dimension (each category represented as a slice)
- One numerical metric representing the value or size of each slice (converted into percentage of the whole)

The pie chart below compares survival rates of passengers in different classes on the Titanic:

{{"demo": "TitanicPie.js"}}

## Basics

Pie charts series must contain a `data` property containing an array of objects.
Each object corresponds to a slice of the pie.
It must contain a property `value` and can have other optional properties like `label`.

If you plan to update/reorder those data, you should add an `id` property which is used for `key` props.

{{"demo": "BasicPie.js"}}

## Donut chart

A donut chart (or doughnut chart) is essentially a pie chart with a hollow center.

You can transform any pie chart into a donut chart by setting the `innerRadius` property to a value greater than 0.

{{"demo": "DonutChart.js"}}

## Colors

The pie colors can be customized in two ways.

1. You can provide a [color palette](/x/react-charts/styling/#built-in-color-palettes). Each arc of the pie will be colored according to this palette.
2. You can provide a `color` property in `data` objects which overrides the palette.

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

Pie series shape is described by multiple properties:

- `innerRadius` The radius between the center and the beginning of the arc. The default is set to 0.
- `outerRadius` The radius between the center and the end of the arc. The default is the largest value available in the drawing area.
- `arcLabelRadius` The radius between the center and the arc label.
- `paddingAngle` The angle (in degrees) between two arcs.
- `cornerRadius` Similar to the CSS `border-radius`.
- `startAngle`/`endAngle` The angle range of the pie chart. Values are given in degrees.
- `cx`/`cy` The center of the pie charts. By default the middle of the drawing area.

{{"demo": "PieShape.js", "hideToolbar": true, "bg": "playground"}}

The following properties accept percentage string (for example `'50%'`).

- `innerRadius`/`outerRadius`/`arcLabelRadius` with `'100%'` equivalent to maximal radius fitting in the drawing area.
- `cx`, `cy` with `'100%'` equivalent to the drawing area width/height.

## Labels

You can display labels on the arcs.
To do so, the series should get `arcLabel` property.
It can either get a function that gets the object associated with the arc and returns the label.
Or you can pass one of the following values:

- `'value'` display the raw value of the arc.
- `'formattedValue'` display the returned value of `valueFormatter` for the arc.
- `'label'` display the `label` property of the arc if provided.

To avoid displaying labels on small arcs, you can provide `arcLabelMinAngle` property.
Arcs with angles smaller than the value (in deg) will not have labels.

{{"demo": "PieArcLabel.js"}}

## Highlight

Pie series can get `highlightScope` property to manage element highlighting.
Its behavior is described in the [dedicated page](/x/react-charts/highlighting/#highlighting-series).

When elements are highlighted or faded they can be customized with dedicated CSS classes: `.MuiPieArc-faded` and `.MuiPieArc-highlighted`.

CSS is well suited to modify the `color`, `stroke-width`, or `opacity`.
However, to modify the size of a pie arc, you must use the `highlighted` and `faded` properties, with which you can override any of the properties `innerRadius`, `outerRadius`, and `cornerRadius` when an arc is highlighted or faded.

If you do not want to provide absolute values, you can use `additionalRadius` which will be added to the `outerRadius`.
This value can be negative to reduce arc size.

{{"demo": "PieActiveArc.js"}}

## Click event

Pie Chart provides an `onItemClick` handler for handling clicks on specific pie arcs.
It has the following signature.

```js
const onItemClick = (
  event, // The mouse event.
  params, // An object that identifies the clicked element.
) => {};
```

{{"demo": "PieClick.js"}}

## CSS

You can customize the different elements rendered by a pie chart using CSS.

In the example below, the outer series is selected using the `data-series` attribute to reduce its opacity.

{{"demo": "PieCSSStyling.js"}}

## Animation

Chart containers respect [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), but you can also disable animations manually by setting the `skipAnimation` prop to `true`.

When `skipAnimation` is enabled, the chart renders without any animations.

```jsx
// For a single component chart
<PieChart skipAnimation />

// For a composed chart
<ChartContainer>
  <PiePlot skipAnimation />
</ChartContainer>
```

{{"demo": "PieAnimation.js"}}

## Composition

Use the `<ChartDataProvider />` to provide the `series` prop for composition.

In addition to the common chart components available for [composition](/x/react-charts/composition/), you can use the `<PiePlot />` component that renders the pie slices and their labels.

Here's how the Pie Chart is composed:

```jsx
<ChartDataProvider plugins={PIE_CHART_PLUGINS}>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      <PiePlot />
      <FocusedPieArc />
      <ChartsOverlay />
    </ChartsSurface>
    <ChartsTooltip trigger="item" />
  </ChartsWrapper>
</ChartDataProvider>
```

:::info
The `<ChartDataProvider />` accepts a [`plugins`](/x/react-charts/plugins/) prop.
This is done to remove cartesian-axis features which are useless for a pie chart, and interfere with the pie position.

For pro users, use the `PIE_CHART_PRO_PLUGINS` instead to activate the export feature.
:::
