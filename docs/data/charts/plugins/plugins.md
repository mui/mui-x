---
title: Charts - Plugins
productId: x-charts
components: ChartContainer, ChartsDataProvider
---

# Charts - Plugins

<p class="description">The library relies on two systems to perform data processing: the plugins and the series config.</p>

:::warning
This information is for advanced use-cases.
Most charts should not require changes to either the plugins or the series configuration.
:::

## Plugins

Plugins are functions that add features to the chart.
They can process data, add internal state, or listen to events.

Plugins can be passed to the `<ChartContainer />` or the `<ChartsDataProvider />` with the `plugins` props.

:::info
Notice that `myChartPlugins` is defined outside of the component.
That's because plugins contain hooks and so their order should not be modified.
:::

```jsx
const myChartPlugins = [useChartInteraction, useChartHighlight];

function MyChart() {
  return <ChartContainer plugins={myChartPlugins}>{/* ... */}</ChartContainer>;
}
```

### Plugins per chart

The default array of plugins can be imported from the corresponding chart folder.
This allows you to get the exact same feature as the component while using composition.

```ts
// Community package
import { PIE_CHART_PLUGINS, PieChartPluginSignatures } from '@mui/x-charts/PieChart';
// Pro package
import { PIE_CHART_PLUGINS, PieChartPluginSignatures } from '@mui/x-charts-pro/PieChart';
import { PIE_CHART_PRO_PLUGINS, PieChartProPluginSignatures } from '@mui/x-charts-pro/PieChartPro';


function MyPieChart() {
    return <ChartContainer plugins={PIE_CHART_PLUGINS}>
        {/* ... */}
    </ChartContainer>
}
```

### Plugins list

You can import plugins individually from `@mui/x-charts/plugins`.

When creating your custom array of plugins, be aware that some plugins have dependencies.

- dependencies: plugins that need to be set before for them to work.
- optional dependencies: plugins that need to be set before to enable some features.

For example, the `useChartClosestPoint` has the `useChartCartesianAxis` as a dependency and the `useChartHighlight` as an optional dependency. Then

- `[useChartClosestPoint, useChartCartesianAxis]` does not work because the closest point plugin is before the cartesian one.
- `[useChartCartesianAxis, useChartClosestPoint]` works because the cartesian plugin is set before the one for closest point.
- `[useChartCartesianAxis, useChartClosestPoint, useChartHighlight]` works with limited feature. The highlight plugin being after the closest point one, you get the highlight feature, but not highlight based on closest point.

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

### Custom plugins

:::warning
Creating custom plugins is not encouraged.
:::

The plugin's internal implementation is not considered stable.
It can break at any time, including patch and minor versions.
