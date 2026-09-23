---
title: React Radial Line chart
productId: x-charts
components: ChartsRadialDataProvider, ChartsRadialDataProviderPremium, RadialLineChart, RadialMarkPlot, RadialLinePlot, RadialAreaPlot, RadialLineHighlightPlot
---

# Charts - Radial Lines [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Use radial line charts to show trends along periodic values.</p>

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

## Click events

The `RadialLineChart` provides two click handlers:

- `onItemClick` for clicks on a specific line
- `onAxisClick` for clicks anywhere in the chart area

They both provide the following signature:

```js
const clickHandler = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

{{"demo": "RadialLineClick.js", "bg": "outline"}}

:::info
There is a slight difference between the `event` of `onItemClick` and `onAxisClick`:

- For `onItemClick` the event is a React synthetic mouse event emitted by the chart container.
  Radial lines have no per-element click handler, so the clicked line is resolved from the pointer position.
- For `onAxisClick` the event is a native mouse event emitted by the SVG component.

:::

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
