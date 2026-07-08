---
title: React Treemap chart
productId: x-charts
components: Treemap, TreemapPlot, TreemapDataProvider
---

# Charts - Treemap [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

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

- `label`: the text shown on the tile and in the tooltip. Required.
- `id`: a unique identifier. When omitted, it's derived from the parent id and the `label`.
- `value`: the size of a leaf node. Parent nodes use their own `value` when set, otherwise the sum of their descendants.
- `children`: the nested nodes.
- `color`: an explicit color override that cascades to descendants.

### Nested hierarchy

Nodes nest to any depth through their `children`.
Parent tiles are drawn behind their children, and leaf tiles are drawn on top.

{{"demo": "TreemapNested.js"}}

## Tiling

The `tiling` option controls how a node is subdivided into its children.
The default `'squarify'` method keeps tiles close to a square aspect ratio.
Use `paddingInner`, `paddingOuter`, and `paddingTop` to control the spacing between tiles.

{{"demo": "TreemapTiling.js"}}

## Labels

Every tile is labeled with its `label`, which defaults to the node `id`.

{{"demo": "TreemapLabels.js"}}

## Click event

The `onItemClick` callback fires when a tile is clicked, with the clicked item's identifier.

{{"demo": "TreemapClick.js"}}
