---
title: Zoom & Pan
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro
---

# Zoom & Pan [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') 🚧

<p class="description">Enables zooming and panning on specific charts or axis.</p>

:::warning
The zoom feature is part of the pro package which is **not yet** released.

You can test demos.
Don't hesitate to open issues to give feedback.
:::

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

{{"demo": "ZoomOptionsNoSnap.js", "hideToolbar": true, "bg": "playground"}}
