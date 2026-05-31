---
title: React Radial Line chart
productId: x-charts
components: ChartsRadialDataProvider, ChartsRadialDataProviderPremium, RadialLineChart, RadialMarkPlot, RadialLinePlot, RadialAreaPlot, RadialLineHighlightPlot
---

# Charts - Radial Lines [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

<p class="description">Use radial line charts to show trends along periodic values.</p>

:::warning
This feature is in preview.
It is ready for production use, and its API, visuals, and behavior may change in future minor or patch releases.
:::

## Basics

The `RadialLineChart` component accepts `series`, `rotationAxis`, and `radiusAxis` props to render data in polar coordinates.

{{"demo": "BasicRadialLineChart.js", "bg": "outline"}}

## Closing path

To draw the line between the last and first point of the series, set the series property `closePath` to `true`.

{{"demo": "ClosedOpenRadialLineChart.js", "bg": "outline"}}

## Axes

Like for line series, the rotation axis can have any scale type, and the radius axis can use any continuous scale type.

For more information about radial axes configuration, visit the [dedicated page](/x/react-charts/radial-axes/).

Here is an example of a rotation axis with a continuous scale type.

{{"demo": "ContinuousRadialLineChart.js", "bg": "outline"}}

## Marks

Add `showMark: true` to display marks.

To modify the mark, use the property `shape`.
It accepts 7 shapes: `'circle'`, `'square'`, `'diamond'`, `'cross'`, `'star'`, `'triangle'`, and `'wye'`.

{{"demo": "RadialLineMarkShape.js", "bg": "outline"}}

## Highlight

Like other series, the radial line series has a `highlightScope` property that accepts an object with `highlight` and `fade` properties.

:::info
The radial line interaction uses the [pointer based interaction](/x/react-charts/lines/#pointer-interaction).
:::

{{"demo": "ElementHighlights.js", "bg": "outline"}}

## Axis Click

The `RadialLineChart` provides an `onAxisClick` handler that fires when the user clicks anywhere in the chart area.
Its signature matches the bar chart:

```js
const clickHandler = (
  event, // The native mouse event emitted by the SVG component.
  params, // An object that identifies the clicked rotation axis item and its series values.
) => {};
```

{{"demo": "RadialLineClick.js", "bg": "outline"}}

## Composition

Use `ChartsRadialDataProviderPremium` to provide `series`, `rotationAxis`, and `radiusAxis` props for composition.

In addition to the shared chart components available for [composition](/x/react-charts/composition/), you can use `RadialLinePlot`, `RadialAreaPlot`, `RadialMarkPlot`, and `RadialLineHighlightPlot` to draw the lines, areas, marks, and highlight indicator.

Here's how the radial line chart is composed:

```jsx
<ChartsRadialDataProviderPremium>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      <ChartsRadialGrid />
      <g clipPath={`url(#${clipPathId})`}>
        <RadialAreaPlot />
        <RadialLinePlot />
        <ChartsOverlay />
      </g>
      <ChartsRadialAxisHighlight />
      <ChartsRotationAxis />
      <ChartsRadiusAxis />
      <RadialMarkPlot />
      <RadialLineHighlightPlot />
      <ChartsClipPath id={clipPathId} />
    </ChartsSurface>
    <ChartsTooltip />
  </ChartsWrapper>
</ChartsRadialDataProviderPremium>
```
