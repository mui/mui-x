---
title: Charts - Plugins
productId: x-charts
components: ChartContainer, ChartDataProvider
---

# Charts - Plugins

<p class="description">The library relies on two systems to perform data processing: the plugins and the series config.</p>

:::warning
This information is for advanced use-cases.
Most charts should not require changes to either the plugins or the series configuration.
:::

## Plugins

Plugins are functions used to add features to the chart.
They can process data, add internal state, or listen to events.

Plugins can be passed to the `<ChartContainer />` or the `<ChartDataProvider />` with the `plugins` props.

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
import { PIE_CHART_PLUGINS, PieChartPluginsSignatures } from '@mui/x-charts/PieChart';
// Pro package
import { PIE_CHART_PLUGINS, PieChartPluginsSignatures } from '@mui/x-charts-pro/PieChart';
import { PIE_CHART_PRO_PLUGINS, PieChartProPluginsSignatures } from '@mui/x-charts-pro/PieChartPro';


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

| Plugin                                             | Dependencies  | Optional dependency    |
| :------------------------------------------------- | :------------ | :--------------------- |
| `useChartCartesianAxis`                            |               | Interaction            |
| `useChartPolarAxis`                                |               | Interaction            |
| `useChartHighlight`                                |               |                        |
| `useChartInteraction`                              |               |                        |
| `useChartVoronoi`                                  | CartesianAxis | Interaction, Highlight |
| `useChartZAxis`                                    |               |                        |
| `useChartProExport` <span class="plan-pro"></span> |               |                        |
| `useChartProZoom` <span class="plan-pro"></span>   | CartesianAxis |                        |

### Custom plugins

:::warn
Creating custom plugins is not encouraged.
:::

The plugin's internal implementation is not considered stable.
It can break at any time without a breaking change.
