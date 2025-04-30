---
title: Charts - Zoom and pan
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro, ChartZoomSlider
---

# Charts - Zoom and pan [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Enables zooming and panning on specific charts or axis.</p>

Zooming is possible on the **Pro**[<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') versions of the charts: `<LineChartPro />`, `<BarChartPro />`, `<ScatterChartPro />`.

## Basic usage

To enable zooming and panning, set the `zoom` prop to `true` on the wanted axis.

Enabling zoom will enable all the interactions, which are made to be as intuitive as possible.

The following actions are supported:

- **Scroll**: Zoom in/out by scrolling the mouse wheel.
- **Drag**: Pan the chart by dragging the mouse.
- **Pinch**: Zoom in/out by pinching the chart.

{{"demo": "ZoomScatterChart.js"}}
{{"demo": "ZoomBarChart.js"}}
{{"demo": "ZoomLineChart.js"}}

## Zooming options

You can customize the zooming behavior by setting the `zoomOptions` prop.

The following options are available:

- **minStart**: The starting percentage of the axis range. Between 0 and 100.
- **maxEnd**: The ending percentage of the zoom range.
- **step**: The step of the zooming function. Defines the granularity of the zoom.
- **minSpan**: Restricts the minimum span size.
- **maxSpan**: Restricts the maximum span size.
- **panning**: Enables or disables panning.

{{"demo": "ZoomOptions.js", "hideToolbar": true, "bg": "playground"}}

## Zoom filtering

You can make the zoom of an axis affect one or more axes extremums by setting the `zoom.filterMode` prop on the axis config.

- If `zoom.filterMode` is set to `"discard"` the data points outside the visible range of this axis are filtered out and the other axes will modify their zoom range to fit the visible ones.
- If `zoom.filterMode` is set to `"keep"` (default) the data points outside the visible range are kept. Then, other axes will not be impacted.

See how the secondary axis adapts to the visible part of the primary axis in the following example.

{{"demo": "ZoomFilterMode.js"}}

## Zoom slider 🧪

:::warning
This feature is unstable and its API, visuals and/or behavior may change in future minor or patch releases.
:::

You can provide an overview and allow the manipulation of the zoomed area by setting the `zoom.slider.enabled` property on the axis config.

{{"demo": "ZoomSlider.js"}}

Optionally, you can set the `zoom.slider.size` property to customize the zoom slider's size, i.e., the height on an x-axis and the width on a y-axis.

### Composition

When using composition, you can render the axes' sliders by rendering the `ChartZoomSlider` component.

{{"demo": "ZoomSliderComposition.js"}}

## Zoom management

### External zoom management

You can manage the zoom state by two means:

- By defining an initial state with the `initialZoom` prop.
- By imperatively setting a zoom value with the `setZoomData()` method of the public API.

In addition, the `onZoomChange` prop is a function that receives the new zoom state.

The `zoom` state is an array of objects that define the zoom state for each axis with zoom enabled.

- **axisId**: The id of the axis to control.
- **start**: The starting percentage of the axis range.
- **end**: The ending percentage of the zoom range.

{{"demo": "ExternalZoomManagement.js"}}

### Zoom synchronization

To synchronize zoom between multiple charts, you can control the zoom state.

{{"demo": "ZoomControlled.js"}}
