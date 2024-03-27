---
productId: x-tree-view
title: Rich Tree View - Ordering
components: RichTreeView, TreeItem2
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Ordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Drag and drop your items to reorder them.</p>

## Enable drag & drop re-ordering

You can enable the drag & drop re-ordering of items by setting the `itemsReordering` prop to `true`:

{{"demo": "DragAndDrop.js"}}

## Limit the re-ordering of some items

By default, all the items are reorderable.
You can prevent the re-ordering of some items using the `isItemReorderable` prop.
The following example demonstrates how to only allow re-ordering of the leaves:

{{"demo": "OnlyReorderLeaves.js"}}

You can also limit the items in which an item can be dropped:
