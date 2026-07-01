---
title: Charts - Performance
productId: x-charts
---

# Charts - Performance

<p class="description">Learn how to keep charts fast and responsive when rendering large datasets.</p>

The performance of a chart can be decomposed in multiple factors: The time for computations, the React re-renders time, the time for the DOM update.
This page describes the most impactful options you can use to keep rendering smooth.

## Provide stable references

Charts derive a lot of state from their axes/series and recompute it whenever the relevant prop changes by reference.
Passing a new array or object on every render forces this work to run again and triggers extra re-renders, even when the data itself hasn't changed.

The following props benefit from a stable reference:

- `series`
- `xAxis`, `yAxis`, and `zAxis`
- `dataset`
- `margin`
- `colors`

When the value never changes, define it outside the component so the same reference is reused across renders:

```jsx
// Defined once, outside the component.
const xAxis = [{ scaleType: 'band', data: ['A', 'B', 'C'] }];

function MyChart() {
  return <BarChart xAxis={xAxis} series={series} height={300} />;
}
```

When the value depends on props or state, wrap it in `useMemo` so it is only recomputed when its inputs change:

```jsx
function MyChart({ data }) {
  const series = React.useMemo(() => [{ data }], [data]);

  return <LineChart series={series} height={300} />;
}
```

:::warning
The docs uses lot of inlined objects and arrays directly in the JSX (for example `margin={{ top: 10 }}` or `series={[{ data }]}`).

We do that for clarity in the docs sections.
But each render creates a new reference, which defeats the internal memoization.
:::

## Skip animations

Animations are convenient for small charts, but they require updating the DOM on every frame.
With many data points, this work multiplies.

Set the `skipAnimation` prop to render the final state directly, without transitions:

```jsx
<LineChart series={series} skipAnimation />
```

## Remove marks from line charts

If you set `showMark` to `true` for line series, a mark element is render for every data point.
For a series with thousands of points, this adds thousands of DOM nodes that can impact performances.

Either disable marks, or reduce their number

```jsx
// One mark per 100 values.
showMark: ({ index }) => index % 100 === 0;
// Only a mark at the end of the series.
showMark: 'end';
// Only a mark at the beginning of the series.
showMark: 'start';
```

See [Line charts—Optimization](/x/react-charts/lines/#optimization) for more details.

## Use a more efficient renderer

By default, each item is drawn as its own SVG element—a `<rect>` per bar, a `<circle>` per scatter point.
This is flexible but doesn't scale well: the number of DOM nodes grows with the number of data points.

Bar and scatter charts accept a `renderer` prop to switch to a more efficient drawing strategy:

- `'svg-single'` (default): renders every item in its own SVG element.
- `'svg-batch'`: batches all items into a few `<path>` elements, which dramatically reduces the DOM node count for large datasets.

```jsx
<BarChart series={series} renderer="svg-batch" />
```

The batch renderer comes with some trade-offs, such as not being able to style individual items with CSS.
See the dedicated sections for the full list of limitations and live demos:

- [Bar charts—Performance](/x/react-charts/bars/#svg-batch-rendering)
- [Scatter charts—Performance](/x/react-charts/scatter/#svg-batch-rendering)

### WebGL renderer [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

For the largest datasets, `BarChartPremium`, `ScatterChartPremium`, and `HeatmapPremium` support a `'webgl'` renderer that draws items into a single `<canvas>` element, using GPU.
This trades item-level interactivity for the ability to render hundreds of thousands of points.

```jsx
<ScatterChartPremium series={series} renderer="webgl" />
```

See [Bar charts—WebGL renderer](/x/react-charts/bars/#webgl-renderer), [Scatter charts—WebGL renderer](/x/react-charts/scatter/#webgl-renderer), and [Heatmap—WebGL renderer](/x/react-charts/heatmap/#webgl-renderer) for details and demos.

## Sampling [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

When a zoomable chart has more data than the drawing area can show without making elements
too small, the data can be reduced to an appropriate level of detail before rendering.
Levels are precomputed per zoom level, so panning and zooming stay smooth and the chart only
draws as many elements as the view can resolve.

`BarChartPro` and `LineChartPro` accept a `sampling` prop that selects the method:

- `'none'` (default): render every element.
- `'minmax'`: keep the min and max of each bucket.
- `'m4'`: pixel-accurate—keep the first, min, max, and last point of each bucket (line series).
- `'lttb'`: [Largest-Triangle-Three-Buckets](https://skemman.is/handle/1946/15343), keeps one representative point per bucket to preserve the shape (line series).

Zoom in to progressively reveal more detail; sampling turns off once the view can resolve every element.

Sampling also keeps a hard ceiling on the number of rendered elements (2,000). Once the view fits under it, the chart renders every visible element untouched; while a zoomed-in view still holds more than that, it stays sampled even when each element would be wide enough to draw on its own—so a very dense dataset never floods the renderer at any zoom level.

:::info
The zoom `minSpan` is a percentage, so the most zoomed-in view always renders about `dataLength × minSpan / 100` elements. On a very large dataset, keep the axis `zoom.minSpan` small so the deepest zoom doesn't render too many elements at once.
:::

### Comparing methods

The same 8,784-point series rendered with each method at the same zoom. `'none'` is the reference (every point); the others approximate it with far fewer elements while preserving the overall shape.

{{"demo": "SamplingMethodComparison.js"}}

### Bar sampling

Bars are merged into buckets that keep each range's value envelope, so spikes and troughs survive.
Any method other than `'none'` enables it (bars always use a min/max envelope).

```jsx
<BarChartPro series={series} sampling="minmax" />
```

{{"demo": "BarSampling.js"}}

### Line sampling

Lines support all three algorithms; pick the one that best fits your data.
See [Comparing methods](#comparing-methods).

```jsx
<LineChartPro series={series} sampling="m4" />
```

{{"demo": "LineSampling.js"}}

Series with `null` values are still sampled; the gaps are preserved, so the line breaks at them instead of bridging them.

{{"demo": "LineSamplingNulls.js"}}
