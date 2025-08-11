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

The Sankey chart requires a specific data structure with two main parts: `nodes` and `links`.

- The `nodes` array is optional but allows the customization of individual nodes.
- The `links` array defines the connections between nodes and must specify `source`, `target`, and `value`.

### Automatic nodes

If a node is referenced in links but not defined in the `nodes` array, it will be automatically created with the ID as the label.

{{"demo": "SankeyBasicDataStructure.js"}}

### Explicit nodes

When an explicit node definition is provided, it allows customizing labels and colors for each node.

{{"demo": "SankeyDetailedDataStructure.js"}}

## Styling

### Default node styles

Default styles can be applied to all nodes using the `nodeOptions` prop:

{{"demo": "SankeyNodeStyling.js"}}

### Default link styles

Default styles can be applied to all links using the `linkOptions` prop:

{{"demo": "SankeyLinkStyling.js"}}

### Node alignment

Control how nodes are positioned within the chart:

{{"demo": "SankeyNodeAlignment.js"}}

## Sorting

By default, the nodes are sorted by their appearance in the `links` array.
If a `nodes` array is provided, the nodes are sorted by their order in that array.

To dynamically customize the order, use the sorting functions for the element that needs sorting.

### Node sorting

The `nodeOptions.sort` function allows control of the vertical order of nodes within each column. It receives two `SankeyLayoutNode` objects and should return a number (similar to `Array.sort`).

{{"demo": "SankeyNodeSorting.js"}}

### Link sorting

The `linkOptions.sort` function allows control of the order of links emanating from each node. It receives two `SankeyLayoutLink` objects and should return a number.

{{"demo": "SankeyLinkSorting.js"}}

## Layout iterations

The `iterations` prop controls how many times the layout algorithm runs to optimize node positioning. More iterations generally result in better layouts but take longer to compute.

{{"demo": "SankeyIterations.js"}}
