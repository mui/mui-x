---
title: Charts - Toolbar
productId: x-charts
components: Toolbar, ToolbarButton, ChartsToolbarPro, ChartsToolbarZoomInButton, ChartsToolbarZoomOutButton
---

# Charts - Toolbar 🧪

<p class="description">Charts can display a toolbar for easier access to certain functionality.</p>

:::info
This feature is in preview. It is ready for production use, but its API, visuals and behavior may change in future minor or patch releases.
:::

Charts provide a toolbar that can be enabled to give users quick access to certain features.

The toolbar is available on scatter, bar, line, pie and radar charts.

To enable the toolbar, set the `showToolbar` prop to `true` on the chart component.

:::info
The toolbar is only displayed if there are actions available.

For example, if the chart is not zoomable, the zoom buttons will not be displayed.
:::

{{"demo": "ChartsToolbar.js"}}

## Composition 🚧

## Custom elements

The toolbar can be customized to use custom elements instead of the default ones.

That is achievable by passing the custom elements to `slots` prop of the chart.

{{"demo": "ChartsToolbarCustomElements.js"}}

If you want to add or further customize the toolbar's functionality, you can also partially or entirely replace it and use a custom implementation.

{{"demo": "ChartsToolbarCustomToolbar.js"}}
