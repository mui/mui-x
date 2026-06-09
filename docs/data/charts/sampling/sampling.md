---
title: Charts - Sampling
productId: x-charts
components: LineChartPro, ScatterChartPro, BarChartPro
---

# Charts - Sampling [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Downsample dense series to render large datasets smoothly.</p>

A cartesian chart renders one SVG node per data point.
With tens of thousands of points this floods the DOM and degrades performance, even though most points map to the same pixels and are visually redundant.

Sampling reduces the number of points that are **rendered**, while keeping the full dataset for everything else: axis extremums, the axis domain, tooltips, highlighting, and item interaction all use the complete data.

Sampling is available on the Pro version of line, scatter, and bar charts.

:::info
The demos on this page use small datasets so the page stays responsive when you toggle sampling off.
With a realistic large dataset, rendering every point (sampling off) can freeze the browser tab—which is the problem sampling solves.
:::

## Sampling methods

Set the `sampling` prop on a series to a built-in method, or to a [custom function](#custom-sampling-functions).
The chart then renders a representative subset of the points sized to the available width.

Each series type has one recommended built-in method.

| Method     | Series  | Description                                                                                                                                                               |
| :--------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `'lttb'`   | line    | Largest-Triangle-Three-Buckets. Preserves peaks, troughs, and the overall shape. Best for lines.                                                                          |
| `'m4'`     | line    | Keeps the first, last, min, and max of each column, preserving the line's full vertical extent. The densest, most shape-faithful line method, at the cost of more points. |
| `'bucket'` | scatter | Keeps one representative point per grid cell, sized to the marker. Points that would overlap are visually redundant. Best for scatter.                                    |
| `'bucket'` | bar     | Groups consecutive bars into pixel-width buckets and keeps the largest one. Best for bars.                                                                                |

The extra toggle in the demos below—`Min/Max` for line and bar, `Random` for scatter—is a [custom function](#custom-sampling-functions), not a built-in method.
Use the toggle to compare the strategies on the same data.
All the demos on this page have zoom enabled: zoom in to see detail return as fewer points share the visible range.

{{"demo": "SamplingLineChart.js"}}

## Scatter charts

Scatter series use the `'bucket'` method, which keeps one point per grid cell sized to the marker (`markerSize`): points closer together than a marker overlap, so only one needs to be drawn.

{{"demo": "SamplingScatterChart.js"}}

## Bar charts

Bar series use the `'bucket'` method to keep the most prominent bar in each pixel-width group.

The kept bars are laid out on a uniform grid across the axis—fewer and wider—rather than at their original category positions, so a rendered bar no longer lines up with the axis tick of the value it represents.
Tooltips and highlighting still read the full data, so they remain accurate for the kept bars even though their position is approximate.

{{"demo": "SamplingBarChart.js"}}

## Stacked series

Series in the same stacking group are sampled together, on the combined shape of the stack, so the layers keep the same points and stay aligned.

{{"demo": "SamplingStackedLine.js"}}
{{"demo": "SamplingStackedBar.js"}}

## Custom sampling functions

Set `sampling` to a function to use a custom downsampling strategy.
The function (a `DataSampler`) is called with a single parameters object and returns the indices of the points to render.

```tsx
import { DataSampler } from '@mui/x-charts-pro/models';

const sampler: DataSampler = (params) => {
  // ...inspect params, return the indices to render
  return [0, 1, 2];
};

<LineChartPro series={[{ data, sampling: sampler }]} />;
```

### Parameters

The parameters object describes the series and how much detail to keep, without exposing the raw data, so the same function works across series types.

| Property      | Type                        | Description                                                                                                                                                                                                                           |
| :------------ | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `length`      | `number`                    | The number of points in the series.                                                                                                                                                                                                   |
| `target`      | `number`                    | The recommended number of points to keep. Derived from the drawing-area size and zoom level (it doubles roughly every 2x zoom). Returning about this many keeps performance and density consistent, but you may return more or fewer. |
| `zoomLevel`   | `number`                    | The quantized zoom level: `0` when not zoomed, increasing by one roughly every 2x zoom.                                                                                                                                               |
| `getValue`    | `(index: number) => number` | Returns the value of the point at `index` (the y value, or the cumulative top for stacked series).                                                                                                                                    |
| `getPosition` | `(index: number) => number` | Returns the position of the point at `index` along the sampled axis: the x value for line and vertical bar series, the data x for scatter, or the index when no numeric position exists.                                              |

### Return value

Return an array of the indices to render. The chart renders them as-is, so they must be valid: unique integers in `[0, length)`, in ascending order. A `Set` is an easy way to keep them unique.

The function must be **deterministic**—returning the same indices for the same parameters—otherwise the chart flickers while panning.
The `Min/Max` and `Random` toggles in the demos above are implemented as custom samplers.

## How it works

Sampling is applied in the rendering pipeline, after the series are processed but before they are drawn.
Keep the following in mind:

- **Rendering uses the sampled data only.** The drawn geometry behaves as if the dropped values never existed—bars, in particular, are laid out across the full width as if only the kept categories existed, so they become fewer and wider rather than thin with gaps.
- **Everything else uses the full data.** Tooltips, the axis domain, and item interaction always read the complete dataset. As a result, hovering a point that was dropped from a sampled scatter series does not highlight it.
- **Sampling changes in steps as you zoom, not continuously.** Each time you zoom in by about 2x, the target number of rendered points doubles, so detail comes back in discrete steps. Between those steps the kept points are fixed: panning does not recompute them, so points don't flicker in and out as the view moves. Their positions still come from the live scale, so panning and zooming themselves stay smooth.
- **Stacked series share their sampling.** Each series is sampled against its own axes, but series in the same stacking group are sampled once—on the combined silhouette of the stack—and the result is shared by every member, so the stacked layers stay aligned on the same points.
