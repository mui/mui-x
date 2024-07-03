---
title: Zoom & Pan
productId: x-charts
---

# Zoom & Pan [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') 🚧

<p class="description">Enables zooming and panning on specific charts or axis.</p>

Zooming is possible on the **Pro**[<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') versions of the charts: `<LineChartPro />`, `<BarChartPro />`, `<ScatterChartPro />`.

:::warning
Zooming is currently only possible on the `X axis`.
:::

## Basic usage

To enable zooming and panning, set the `zoom` prop to `true` on the chart component.

Enabling zoom will enable all the interactions, which are made to be as intuitive as possible.

The following actions are supported:

- **Scroll**: Zoom in/out by scrolling the mouse wheel.
- **Drag**: Pan the chart by dragging the mouse.
- **Pinch**: Zoom in/out by pinching the chart.

{{"demo": "ZoomScatterChart.js"}}
{{"demo": "ZoomBarChart.js"}}
{{"demo": "ZoomLineChart.js"}}
