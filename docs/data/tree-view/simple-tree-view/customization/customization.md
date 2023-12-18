---
productId: x-tree-view
title: Simple Tree View - Customization
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Customization

<p class="description">Customize the rendering of your Tree View.</p>

## Custom icons, border and animation

{{"demo": "CustomizedTreeView.js"}}

## ContentComponent prop

You can use the `ContentComponent` prop and the `useTreeItem` hook to further customize the behavior of the TreeItem.

Such as limiting expansion to clicking the expand icon:

{{"demo": "IconExpansionTreeView.js", "defaultCodeOpen": false}}

Or increasing the width of the item state indicator to be full-width:

{{"demo": "BarTreeView.js", "defaultCodeOpen": false}}

## Gmail clone

{{"demo": "GmailTreeView.js"}}
