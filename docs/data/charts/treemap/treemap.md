---
title: React Treemap chart
productId: x-charts
components: Treemap, TreemapPlot, TreemapDataProvider, TreemapTooltip, TreemapTooltipContent
---

# Charts - Treemap [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Treemaps display hierarchical data as nested rectangles, sizing each tile in proportion to its value.</p>

## Overview

A treemap subdivides a rectangle into tiles, one per data node.
Each tile's area is proportional to the node's value, which makes it easy to compare parts of a whole across a hierarchy.

{{"demo": "TreemapBasic.js"}}

## Data structure

The `series.data` prop accepts a single root node, or an array of root nodes that are wrapped in a synthetic root.
Each node can define:

- `id`: a unique identifier. When omitted, it's derived from the node's position in the tree.
- `label`: the text shown on the tile and in the tooltip. Defaults to the `id`.
- `value`: the size of a leaf node. Parent nodes derive their value from the sum of their descendants.
- `children`: the nested nodes.
- `color`: an explicit color override.

### Nested hierarchy

Nodes nest to any depth through their `children`.
Parent tiles are drawn behind their children, and leaf tiles are drawn on top.

{{"demo": "TreemapNested.js"}}

## Colors

By default, each top-level branch is assigned a color from the chart's palette, and its descendants inherit that color.
Set the `color` property on a node to override it.

{{"demo": "TreemapColors.js"}}

## Tiling

The `tiling` option controls how a node is subdivided into its children.
The default `'squarify'` method keeps tiles close to a square aspect ratio.
Use `paddingInner`, `paddingOuter`, and `paddingTop` to add spacing between tiles.

{{"demo": "TreemapTiling.js"}}

## Labels

By default the root layer (the top-level tiles) is always labeled, and deeper leaves are labeled when their tile is larger than `minLabelWidth` and `minLabelHeight`.

Set `showLabels: false` to hide every label, or pass a function `(node) => boolean` to decide per tile which labels to display. Labels chosen by the function ignore the size thresholds.

{{"demo": "TreemapLabels.js"}}

## Highlighting

Use `nodeOptions.highlight` and `nodeOptions.fade` to control how tiles react to hovering.
Set `fade: 'global'` to fade every tile except the hovered one.

{{"demo": "TreemapHighlight.js"}}

## Click event

The `onItemClick` callback fires when a tile is clicked, with the clicked item's identifier.

{{"demo": "TreemapClick.js"}}
