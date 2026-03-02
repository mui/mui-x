---
title: Charts - Plugins
productId: x-charts
components: ChartsContainer, ChartDataProvider
---

# Charts - Plugins

<p class="description">Cherry-pick chart features with plugins that handle state, events, and process data.</p>

:::warning
This information is for advanced use cases.
Most charts should not require changes to either the plugins or the series configuration.
:::

Plugins are functions that add features to the chart.
They can process data, add internal state, or listen to events.

You can pass plugins to the `ChartsContainer` or `ChartDataProvider` component with the `plugins` prop.

:::info
Notice that `myChartPlugins` is defined outside of the component.
Plugins contain hooks, so don't change their order.
:::

```jsx
const myChartPlugins = [useChartInteraction, useChartHighlight];

function MyChart() {
  return <ChartsContainer plugins={myChartPlugins}>{/* ... */}</ChartsContainer>;
}
```

## Default plugins for each chart type

Import the default plugin array from the corresponding chart folder to match the built-in chart's behavior when composing a custom component.

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

- **Dependencies:** plugins that must appear earlier in the array to work.
- **Optional dependencies:** plugins that must appear earlier to enable certain behavior.

For example, `useChartClosestPoint()` depends on `useChartCartesianAxis()` and optionally on `useChartHighlight()`.

- `[useChartClosestPoint, useChartCartesianAxis]` does not work because the closest-point plugin comes before the cartesian one.
- `[useChartCartesianAxis, useChartClosestPoint]` works because the cartesian plugin comes first.
- `[useChartCartesianAxis, useChartClosestPoint, useChartHighlight]` works with limited behavior: you get highlighting, but not highlight based on closest point.

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
We do not recommend creating custom plugins.

Plugin internals are not stable and can change in any release, including patch and minor versions.
:::
