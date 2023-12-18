---
productId: x-tree-view
title: Simple Tree View - Selection
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Selection

<p class="description">Handle how the users can select items.</p>

## Multi selection

The Tree View also supports multi-selection:

{{"demo": "MultiSelectTreeView.js"}}

## Controlled selection

Use the `selected` prop to control the selected items.

You can use the `onNodeSelect` prop to listen to changes in the selected items and update the prop accordingly.

{{"demo": "ControlledSelection.js"}}
