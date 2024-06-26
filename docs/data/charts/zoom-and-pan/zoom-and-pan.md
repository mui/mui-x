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
:::error
Zoom & Pan isn't working perfectly in `Line` and `Bar` charts yet.
:::

## Basic usage

To enable zooming and panning, set the `zoom` prop to `true` on the chart component.

{{"demo": "ZoomScatterChart.js"}}
{{"demo": "ZoomBarChart.js"}}
{{"demo": "ZoomLineChart.js"}}
