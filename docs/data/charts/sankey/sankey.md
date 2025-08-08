---
title: React Sankey chart
productId: x-charts
---

# Charts - Sankey [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🧪

<p class="description">Sankey charts are great for visualizing flows between different elements.</p>

:::info
This feature is in preview. It is ready for production use, but its API, visuals and behavior may change in future minor or patch releases.
:::

## Basics

The Sankey chart series must contain a `data` property containing an object with `nodes` and `links`.
Each node can have an optional configuration object, and links must specify `source`, `target`, and `value`.

{{"demo": "SankeyChartExample.js"}}

{{"demo": "ComplexSankeyChart.js"}}
