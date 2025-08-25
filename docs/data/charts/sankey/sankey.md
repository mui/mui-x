---
title: React Sankey chart
productId: x-charts
components: SankeyChart, SankeyPlot, SankeyTooltip, SankeyTooltipContent
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

If a node is referenced in `links` but not defined in the `nodes` array, it is automatically created with the ID as the label.

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

The node alignment determines how nodes are positioned within the Sankey chart. The layout follows these principles:

- Nodes are grouped into columns based on the graph structure
- Source nodes always appear to the left of their target nodes
- Some nodes have fixed positions (determined by the graph topology), while others can be positioned more flexibly (affected by alignment)

For example, in the demonstration below:

- Nodes A, B, D, G, I, and K have fixed positions because moving them would require creating a new column
- Node E can be placed in either the first or second column
- Node F is flexible and can be positioned in columns 4, 5, or 6

{{"demo": "SankeyNodeAlignment.js"}}

### Curve correction

The `curveCorrection` prop adjusts the look of the links between nodes by modifying the x-coordinate of the control points in the curve function.
In some instances, this creates better-looking connections but is dependent on the graph layout, and is especially impacted by the chart height.

Higher values create plumper links, while lower values create thinner connections. The default value is `10`.

{{"demo": "SankeyCurveCorrection.js"}}

## Sorting

Nodes are displayed in the same order as they are defined in the `nodes` array.
If a `nodes` array isn't provided, nodes are rendered according to the order in which they are referenced in the `links` array.

To dynamically customize the order, use the sorting functions for the element that needs sorting.

### Node sorting

The `nodeOptions.sort` function allows control of the vertical order of nodes within each column.
It receives two `SankeyLayoutNode` objects and should return a number (similar to [`Array.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn)).

{{"demo": "SankeyNodeSorting.js"}}

### Link sorting

The `linkOptions.sort` function allows control of the order of links emanating from each node.
It receives two `SankeyLayoutLink` objects and should return a number.

{{"demo": "SankeyLinkSorting.js"}}

## Layout iterations

The `iterations` prop controls how many times the layout algorithm runs to optimize node positioning. More iterations generally result in better layouts but take longer to compute.

{{"demo": "SankeyIterations.js"}}

## Interaction

### Click event

You can use the `onNodeClick` and `onLinkClick` props to handle click events on both nodes and links in the Sankey chart. The callback receives the mouse event and a `SankeyNodeIdentifierWithData` or `SankeyLinkIdentifierWithData` respectively, both of which contain information about the clicked item.

The `SankeyItemIdentifierWithData` type is a union of `SankeyNodeIdentifierWithData` and `SankeyLinkIdentifierWithData`, allowing you to handle both types of items in a single callback if needed.

{{"demo": "SankeyClick.js"}}

## Tooltip

The Sankey chart has an item tooltip that can be customized as described in the [Tooltip documentation page](/x/react-charts/tooltip/).

The only difference of the Sankey Tooltip is its default content.
You can import the default tooltip, or only its content as follows:

```js
import { SankeyTooltip, SankeyTooltipContent } from '@mui/x-charts/SankeyChart',
```
