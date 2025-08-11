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

## Data structure

The Sankey chart requires a specific data structure with two main parts: `nodes` and `links`.

- The `nodes` array is optional but allows you to customize individual nodes.
- The `links` array defines the connections between nodes.

### Automatic nodes

If a node is referenced in links but not defined in the `nodes` array, it will be automatically created with the ID as the label.

{{"demo": "SankeyBasicDataStructure.js"}}

### Explicit nodes

When you provide explicit node definitions, you can customize labels and colors for each node.

{{"demo": "SankeyDetailedDataStructure.js"}}

## Styling

### Default node styles

You can apply default styles to all nodes using the `nodeOptions` prop:

{{"demo": "SankeyNodeStyling.js"}}

### Default link styles

You can apply default styles to all links using the `linkOptions` prop:

{{"demo": "SankeyLinkStyling.js"}}

### Node alignment

Control how nodes are positioned within the chart:

{{"demo": "SankeyNodeAlignment.js"}}

## Sorting

You can customize the order of nodes and links using sort functions.

### Node sorting

The `nodeOptions.sort` function allows you to control the vertical order of nodes within each column. It receives two `SankeyLayoutNode` objects and should return a number (similar to `Array.sort`).

{{"demo": "SankeyNodeSorting.js"}}

### Link sorting

The `linkOptions.sort` function allows you to control the order of links emanating from each node. It receives two `SankeyLayoutLink` objects and should return a number.

{{"demo": "SankeyLinkSorting.js"}}

## Layout iterations

The `iterations` prop controls how many times the layout algorithm runs to optimize node positioning. More iterations generally result in better layouts but take longer to compute.

{{"demo": "SankeyIterations.js"}}
