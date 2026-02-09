---
title: Charts - Plugins
productId: x-charts
components: ChartsContainer, ChartDataProvider
---

# Charts - Plugins

<p class="description">The library uses two systems to perform data processing: plugins and the series config.</p>

:::warning
This information is for advanced use cases.
Most charts should not require changes to either the plugins or the series configuration.
:::

Plugins are functions that add features to the chart.
They can process data, add internal state, or listen to events.

You can pass plugins to the `ChartContainer` or `ChartDataProvider` component with the `plugins` prop.

:::info
Notice that `myChartPlugins` is defined outside of the component.
That's because plugins contain hooks, so you should not modify their order.
:::

```jsx
const myChartPlugins = [useChartInteraction, useChartHighlight];

function MyChart() {
  return <ChartsContainer plugins={myChartPlugins}>{/* ... */}</ChartsContainer>;
}
```

## Plugins per chart

You can import the default array of plugins from the corresponding chart folder.
This lets you get the exact same features as the component when using composition.

```ts
// Community package
import { PIE_CHART_PLUGINS, PieChartPluginSignatures } from '@mui/x-charts/PieChart';
// Pro package
import { PIE_CHART_PLUGINS, PieChartPluginSignatures } from '@mui/x-charts-pro/PieChart';
import { PIE_CHART_PRO_PLUGINS, PieChartProPluginSignatures } from '@mui/x-charts-pro/PieChartPro';


function MyPieChart() {
    return <ChartsContainer plugins={PIE_CHART_PLUGINS}>
        {/* ... */}
    </ChartsContainer>
}
```

## Plugins list

You can import plugins individually from `@mui/x-charts/plugins`.

When creating your custom array of plugins, note that some plugins have dependencies.

- Dependencies: plugins that must be set before them to work.
- Optional dependencies: plugins that must be set before them to enable some features.

For example, `useChartClosestPoint()` has `useChartCartesianAxis()` as a dependency and `useChartHighlight()` as an optional dependency.

- `[useChartClosestPoint, useChartCartesianAxis]` does not work because the closest point plugin is before the cartesian one.
- `[useChartCartesianAxis, useChartClosestPoint]` works because the cartesian plugin is set before the closest point one.
- `[useChartCartesianAxis, useChartClosestPoint, useChartHighlight]` works with limited features.
  The highlight plugin is after the closest point one, so you get the highlight feature, but not highlight based on closest point.

| Plugin                                             | Dependencies            | Optional dependency                            |
| :------------------------------------------------- | :---------------------- | :--------------------------------------------- |
| `useChartCartesianAxis`                            |                         | `useChartInteraction`                          |
| `useChartPolarAxis`                                |                         | `useChartInteraction`                          |
| `useChartHighlight`                                |                         |                                                |
| `useChartTooltip`                                  |                         |                                                |
| `useChartInteraction`                              |                         | `useChartTooltip`                              |
| `useChartClosestPoint`                             | `useChartCartesianAxis` | `useChartInteraction`,<br/>`useChartHighlight` |
| `useChartZAxis`                                    |                         |                                                |
| `useChartBrush`                                    |                         |                                                |
| `useChartProExport` <span class="plan-pro"></span> |                         |                                                |
| `useChartProZoom` <span class="plan-pro"></span>   | `useChartCartesianAxis` |                                                |

## Custom plugins

:::warning
Creating custom plugins is not encouraged.
:::

The plugin's internal implementation is not stable.
It can break at any time, including patch and minor versions.
