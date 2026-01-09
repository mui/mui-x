---
title: React Sankey chart
productId: x-charts
components: SankeyChart, SankeyPlot, SankeyTooltip, SankeyTooltipContent, SankeyDataProvider
---

# Charts - Sankey [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🧪

<p class="description">Sankey charts are great for visualizing flows between different elements.</p>

:::info
This feature is in preview. It is ready for production use, but its API, visuals and behavior may change in future minor or patch releases.
:::

## Overview

The Sankey chart is a type of flow diagram that visualizes the flow of data between different nodes.

{{"demo": "SankeyOverview.js"}}

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

### Link color keywords

Link colors can use special keyword values to automatically inherit colors from their connected nodes:

- `'source'` - The link inherits the color of its source node
- `'target'` - The link inherits the color of its target node

This feature works for both individual link colors and the default link color in `linkOptions`:

{{"demo": "SankeyLinkKeywordColors.js"}}

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

## Value formatting

You can customize how values are displayed in tooltips and labels using the `valueFormatter` prop.
This function receives the numeric value and a context object that provides information about what type of element is being formatted.

The context object contains:

- `location`: either `'tooltip'` or `'label'` to indicate where the formatted value is used
- `type`: either `'node'` or `'link'` to indicate what is being formatted
- `nodeId`: for nodes, the ID of the node being formatted
- `sourceId` and `targetId`: for links, the IDs of the source and target nodes

In the following demo, the value formatter adds relevant units to the values.
And when pointer is on top of a node, it display "total" to the tooltip.

{{"demo": "SankeyValueFormatter.js"}}

## Sorting

Nodes are displayed in the same order as they are defined in the `nodes` array.
If a `nodes` array isn't provided, nodes are rendered according to the order in which they are referenced in the `links` array.

To dynamically customize the order, use the sorting functions for the element that needs sorting.

### Node sorting

The `nodeOptions.sort` property controls the vertical order of nodes within each column.

It accepts the following values:

- A **function** that receives two `SankeyLayoutNode` objects and returns a number (similar to [`Array.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn))
- `'auto'` (default): Uses the automatic sorting behavior, which aims to minimize links crossing each other
- `'fixed'`: Preserves the order from the `nodes` array, disabling automatic sorting

{{"demo": "SankeyNodeSorting.js"}}

### Link sorting

The `linkOptions.sort` property controls the order of links emanating from each node.

It accepts the following values:

- A **function** that receives two `SankeyLayoutLink` objects and returns a number
- `'auto'` (default): Uses the automatic sorting behavior, which aims to minimize links crossing each other
- `'fixed'`: Preserves the order from the `links` array, disabling automatic sorting

{{"demo": "SankeyLinkSorting.js"}}

## Layout iterations

The `iterations` prop controls how many times the layout algorithm runs to optimize node positioning. More iterations generally result in better layouts but take longer to compute.

{{"demo": "SankeyIterations.js"}}

## Interaction

### Click event

You can use the `onNodeClick` and `onLinkClick` props to handle click events on both nodes and links in the Sankey chart. The callback receives the mouse event and a `SankeyNodeIdentifierWithData` or `SankeyLinkIdentifierWithData` respectively, both of which contain information about the clicked item.

The `SankeyItemIdentifierWithData` type is a union of `SankeyNodeIdentifierWithData` and `SankeyLinkIdentifierWithData`, allowing you to handle both types of items in a single callback if needed.

{{"demo": "SankeyClick.js"}}

### Highlighting

You can highlight nodes and links by hovering over them or by controlling the highlighting programmatically. When an item is highlighted, other items can be faded out to improve focus.

{{"demo": "SankeyHighlighting.js"}}

The highlighting behavior is configured separately for nodes and links through their respective options:

#### Node highlighting

Configure node highlighting behavior using `nodeOptions.highlight` and `nodeOptions.fade`:

- `nodeOptions.highlight`: Controls what gets highlighted when selecting a node
  - `'nodes'`: Highlight only the selected node
  - `'links'`: Highlight all links connected to the selected node
  - `'incoming'`: Highlight only incoming links to the selected node
  - `'outgoing'`: Highlight only outgoing links from the selected node
  - `'none'`: Disable node highlighting
- `nodeOptions.fade`: Controls the fade effect
  - `'global'`: Fade all non-highlighted items when a node is highlighted
  - `'none'`: No fade effect

#### Link highlighting

Configure link highlighting behavior using `linkOptions.highlight` and `linkOptions.fade`:

- `linkOptions.highlight`: Controls what gets highlighted when selecting a link
  - `'links'`: Highlight only the selected link
  - `'nodes'`: Highlight both source and target nodes of the selected link
  - `'source'`: Highlight only the source node of the selected link
  - `'target'`: Highlight only the target node of the selected link
  - `'none'`: Disable link highlighting
- `linkOptions.fade`: Controls the fade effect
  - `'global'`: Fade all non-highlighted items when a link is highlighted
  - `'none'`: No fade effect

### Controlled highlighting

You can control the highlighting externally using the `highlightedItem` and `onHighlightChange` props. This is useful when you want to programmatically highlight specific nodes or links, or synchronize highlighting with other UI elements.

The `highlightedItem` prop accepts either a `SankeyNodeIdentifier` or a `SankeyLinkIdentifier`:

For nodes:

```ts
{
  type: 'sankey',
  seriesId: string,
  subType: 'node',
  nodeId: string | number,
}
```

For links:

```ts
{
  type: 'sankey',
  seriesId: string,
  subType: 'link',
  sourceId: string | number,
  targetId: string | number,
}
```

The `onHighlightChange` callback is called whenever the highlighted item changes (either through user interaction or programmatic control), allowing you to keep your state synchronized.

{{"demo": "SankeyControlledHighlight.js"}}

## Tooltip

The Sankey chart has an item tooltip that can be customized as described in the [Tooltip documentation page](/x/react-charts/tooltip/).

The only difference of the Sankey Tooltip is its default content.
You can import the default tooltip, or only its content as follows:

```js
import { SankeyTooltip, SankeyTooltipContent } from '@mui/x-charts/SankeyChart',
```
