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

## Custom icons

Use the `defaultCollapseIcon`, `defaultExpandIcon`, and `defaultEndIcon` props to customize the Tree View icons. You can use either icon libraries, such as Material Icons, or create your own.

{{"demo": "CustomIcons.js", "defaultCodeOpen": false}}

## Connection border

Target the `treeItemClasses.group` class to add connection borders between the Tree View items.

{{"demo": "BorderedTreeView.js", "defaultCodeOpen": false}}

## Toggle animations

Use the `TransitionComponent` prop on the `TreeItem` to pass a component that handles your animation.

{{"demo": "CustomAnimation.js", "defaultCodeOpen": false}}

## Customizing for complex use cases

You can customize the Tree View to accomodate more complex use cases:

{{"demo": "CustomizedTreeView.js"}}

## Gmail clone

{{"demo": "GmailTreeView.js"}}

## ContentComponent prop

You can use the `ContentComponent` prop and the `useTreeItem` hook to further customize the behavior of the TreeItem.

Such as limiting expansion to clicking the expand icon:

{{"demo": "IconExpansionTreeView.js", "defaultCodeOpen": false}}

Or increasing the width of the item state indicator to be full-width:

{{"demo": "BarTreeView.js", "defaultCodeOpen": false}}
