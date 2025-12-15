---
productId: x-tree-view
title: Rich Tree View - Ordering
components: TreeItem, RichTreeViewPro, TreeItemDragAndDropOverlay
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Ordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Let users drag and drop items in the Tree View to reorder them.</p>

## Enable drag-and-drop reordering

You can enable the drag-and-drop reordering of items by setting the `itemsReordering` prop to `true`:

{{"demo": "DragAndDrop.js"}}

## Limit reordering

By default, all items are reorderable.
You can prevent reordering of specifc items using the `isItemReorderable` prop.
The following example shows how to only let users reorder the leaves using the [`getItemOrderedChildrenIds()`](/x/react-tree-view/rich-tree-view/items/#get-an-items-children-by-id) API method.

{{"demo": "OnlyReorderLeaves.js"}}

You can also limit the items in which an item can be dropped using the `canMoveItemToNewPosition` prop.
The following example shows how to only let users reorder inside the same parent:

{{"demo": "OnlyReorderInSameParent.js"}}

## React to an item reordering

You can use the `onItemPositionChange` to send the new position of an item to your backend:

{{"demo": "OnItemPositionChange.js"}}

If you want to send the entire dataset to your backend, you can use the [`getItemTree()`](/x/react-tree-view/rich-tree-view/items/#get-the-current-item-tree) API method.
The following demo demonstrates it by synchronizing the first `RichTreeView` with the second one whenever you perform a reordering:

{{"demo": "SendAllItemsToServer.js"}}

## Customization

### Only trigger reordering from a drag handle

You can create a custom `TreeItem` component to render a drag handle icon and only trigger reordering when dragging from it:

{{"demo": "OnlyReorderFromDragHandle.js"}}

## Common examples

### File explorer

The example below is a simplified version of the [file explorer](/x/react-tree-view/rich-tree-view/customization/#file-explorer) example with drag-and-drop reordering.
You can reorder items but only inside folders (or inside the trash).

{{"demo": "FileExplorer.js"}}
