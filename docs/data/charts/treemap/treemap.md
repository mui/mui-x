---
title: React Treemap chart
productId: x-charts
components: Treemap, TreemapPlot, TreemapDataProvider, TreemapTooltip, TreemapTooltipContent
---

# Charts - Treemap [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') 🧪

<p class="description">Treemaps display hierarchical data as nested rectangles, sizing each tile in proportion to its value.</p>

:::warning
This feature is in preview. It is not yet ready for production use, and its API, visuals and behavior may change in future minor or patch releases.
:::

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

{{"demo": "TreemapTiling.js"}}

## Render mode

`nodeOptions.renderMode` sets which nodes render a tile: `'all'` (default) draws the nested group tiles and their leaves, while `'leaf'` draws only the leaves for a flat treemap.

{{"demo": "TreemapRenderMode.js"}}

## Padding and rounded corners

`tiling.paddingInner` sets the gap between sibling tiles, `tiling.paddingOuter` the inset inside a group, and `tiling.paddingTop` the header band reserved for a group's label. `nodeOptions.borderRadius` rounds the tile corners.

{{"demo": "TreemapStyling.js"}}

## Labels

By default every tile is labeled.

Set `showLabels: false` to hide every label, or pass a function `(node) => boolean` to decide per tile which labels to display.

{{"demo": "TreemapLabels.js"}}

### Label padding

`nodeOptions.labelPadding` sets the space between a tile's edge and its label, as a number or `{ x, y }`.
For nested treemaps, the default top padding of a group grows to fit the label padding, so headers keep their spacing.

{{"demo": "TreemapLabelPadding.js"}}

## Highlighting

Use `nodeOptions.highlight` to control which tiles are highlighted with the hovered one, following the hierarchy:

- `'node'`: only the hovered tile.
- `'children'`: the hovered tile and all of its descendants.
- `'parents'`: the hovered tile and all of its ancestors.
- `'parent'`: the hovered tile and its immediate parent.
- `'child'`: the hovered tile and its immediate children.

`nodeOptions.fade` controls which tiles fade: `'node'`, `'children'`, or `'parents'` to fade that relationship, or `'global'` to fade every tile that isn't highlighted. Highlighting takes precedence over fading.

{{"demo": "TreemapHighlight.js"}}

## Click event

The `onItemClick` callback fires when a tile is clicked, with the clicked item's identifier.

{{"demo": "TreemapClick.js"}}
