---
title: React Sankey chart
productId: x-charts
components: SankeyChart, SankeyPlot, SankeyTooltip, SankeyTooltipContent, SankeyDataProvider, FocusedSankeyNode, FocusedSankeyLink
---

# Charts - Sankey [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Show flows between nodes as connected links with proportional widths.</p>

## Overview

A Sankey chart is a flow diagram that shows how values move between nodes.
Links connect source nodes to target nodes, and link width represents the flow magnitude.

{{"demo": "SankeyOverview.js"}}

## Basics

The Sankey chart expects a data structure with `nodes` and `links`.

- `nodes`: optional array for customizing individual nodes (labels, colors)
- `links`: required array of connections, each with `source`, `target`, and `value`

### Automatic nodes

If a node appears in `links` but not in `nodes`, it is created automatically with its ID as the label.

{{"demo": "SankeyBasicDataStructure.js"}}

### Explicit nodes

When you define nodes in the `nodes` array, you can set labels and colors for each.

{{"demo": "SankeyDetailedDataStructure.js"}}

## Styling

### Default node styles

Use the `nodeOptions` prop to apply default styles to all nodes.

{{"demo": "SankeyNodeStyling.js"}}

### Default link styles

Use the `linkOptions` prop to apply default styles to all links.

{{"demo": "SankeyLinkStyling.js"}}

### Link color keywords

Link colors can use `'source'` to inherit from the source node or `'target'` to inherit from the target node.

This works for individual link colors and for the default in `linkOptions`.

{{"demo": "SankeyLinkKeywordColors.js"}}

### Node alignment

Node alignment controls how nodes are positioned.
The layout groups nodes into columns based on the graph structure.
Source nodes are always left of their targets.
Some nodes have fixed positions (from the graph topology).
Others can be placed in different columns depending on alignment.

In the demo below:

- Nodes A, B, D, G, I, and K have fixed positions (moving them would add a column)
- Node E can sit in the first or second column
- Node F can sit in columns 4, 5, or 6

{{"demo": "SankeyNodeAlignment.js"}}

### Curve correction

The `curveCorrection` prop adjusts how links look by changing the x-coordinate of curve control points.
The result depends on the graph layout and chart height.
Higher values make links thicker, and lower values make them thinner.
The default is `10`.

{{"demo": "SankeyCurveCorrection.js"}}

## Value formatting

Use the `valueFormatter` prop to customize how values appear in tooltips and labels.
The formatter receives the numeric value and a context object.
The context has `location` (`'tooltip'` or `'label'`), `type` (`'node'` or `'link'`), and for nodes `nodeId`, for links `sourceId` and `targetId`.

The demo below adds units to values and shows "total" when the pointer is over a node.

{{"demo": "SankeyValueFormatter.js"}}

## Sorting

Nodes render in the order of the `nodes` array.
If `nodes` is not provided, they render in the order they appear in `links`.
Use the sorting options to change the order.

### Node sorting

The `nodeOptions.sort` property controls the vertical order of nodes in each column.
It accepts:

- A function that receives two `SankeyLayoutNode` objects and returns a number (like [`Array.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn))
- `'auto'` (default): automatic sorting to reduce link crossings
- `'fixed'`: keep the order from the `nodes` array

{{"demo": "SankeyNodeSorting.js"}}

### Link sorting

The `linkOptions.sort` property controls the order of links leaving each node.
It accepts:

- A function that receives two `SankeyLayoutLink` objects and returns a number
- `'auto'` (default): automatic sorting to reduce link crossings
- `'fixed'`: keep the order from the `links` array

{{"demo": "SankeyLinkSorting.js"}}

## Layout iterations

The `iterations` prop sets how many times the layout algorithm runs.
More iterations usually improve the layout but take longer.

{{"demo": "SankeyIterations.js"}}

## Interaction

### Click event

Use the `onNodeClick` and `onLinkClick` props to handle clicks on nodes and links.
Each callback receives the mouse event and an identifier object (`SankeyNodeIdentifierWithData` or `SankeyLinkIdentifierWithData`) with details about the clicked item.
Use `SankeyItemIdentifierWithData` when handling both in one callback.

{{"demo": "SankeyClick.js"}}

### Highlighting

You can highlight nodes and links by hovering or programmatically.
When an item is highlighted, others can be faded to improve focus.

{{"demo": "SankeyHighlighting.js"}}

Highlighting is configured separately for nodes and links.

#### Node highlighting

Use `nodeOptions.highlight` and `nodeOptions.fade`:

- `nodeOptions.highlight`: what to highlight when a node is selected
  - `'nodes'`: only the selected node
  - `'links'`: all links connected to the node
  - `'incoming'`: only incoming links
  - `'outgoing'`: only outgoing links
  - `'none'`: no highlighting
- `nodeOptions.fade`: `'global'` fades non-highlighted items, `'none'` turns fade off

#### Link highlighting

Use `linkOptions.highlight` and `linkOptions.fade`:

- `linkOptions.highlight`: what to highlight when a link is selected
  - `'links'`: only the selected link
  - `'nodes'`: source and target nodes
  - `'source'`: only the source node
  - `'target'`: only the target node
  - `'none'`: no highlighting
- `linkOptions.fade`: `'global'` or `'none'`

### Controlled highlighting

Use the `highlightedItem` and `onHighlightChange` props to control highlighting from outside.
This helps when you want to highlight specific items programmatically or sync with other UI.

The `highlightedItem` prop accepts a `SankeyNodeIdentifier` or `SankeyLinkIdentifier`:

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

The `onHighlightChange` callback runs when the highlighted item changes (from user interaction or programmatic control).

{{"demo": "SankeyControlledHighlight.js"}}

## Tooltip

The Sankey chart has an item tooltip that you can customize as described in the [Tooltip](/x/react-charts/tooltip/) documentation.
The Sankey tooltip differs only in its default content.

Import the default tooltip or its content:

```js
import { SankeyTooltip, SankeyTooltipContent } from '@mui/x-charts/SankeyChart';
```

## Composition

Use `SankeyDataProvider` to supply the `series` prop when composing a custom chart.

In addition to the shared components available for [composition](/x/react-charts/composition/), you can use:

- For items: `SankeyNodePlot`, `SankeyLinkPlot`
- For labels: `SankeyNodeLabelPlot`, `SankeyLinkLabelPlot`
- For keyboard: `FocusedSankeyNode`, `FocusedSankeyLink`

The following code shows how the Sankey chart is built:

```jsx
<SankeyDataProvider series={series as SankeySeriesType[]} {...chartDataProviderProProps}>
  <ChartsWrapper {...chartsWrapperProps}>
    <ChartsSurface {...chartsSurfaceProps}>
      <SankeyLinkPlot onClick={onLinkClick} />
      <SankeyNodePlot onClick={onNodeClick} />

      <SankeyLinkLabelPlot />
      <SankeyNodeLabelPlot />

      <FocusedSankeyNode />
      <FocusedSankeyLink />

      <ChartsOverlay {...overlayProps} />
    </ChartsSurface>
    <ChartsTooltip trigger="item" />
  </ChartsWrapper>
</SankeyDataProvider>
```
