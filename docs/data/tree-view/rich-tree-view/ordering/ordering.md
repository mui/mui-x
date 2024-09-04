---
productId: x-tree-view
title: Rich Tree View - Ordering
components: TreeItem2, TreeItem, RichTreeViewPro
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Ordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Drag and drop your items to reorder them.</p>

:::success
To be able to reorder items, you first have to enable the `indentationAtItemLevel` and the `itemsReordering` experimental features:

```tsx
<RichTreeViewPro
  items={ITEMS}
  experimentalFeatures={{ indentationAtItemLevel: true, itemsReordering: true }}
/>
```

See [Tree Item Customization—Apply the nested item's indentation at the item level](/x/react-tree-view/tree-item-customization/#apply-the-nested-items-indentation-at-the-item-level) for more details.
:::

## Enable drag & drop re-ordering

You can enable the drag & drop re-ordering of items by setting the `itemsReordering` prop to `true`:

{{"demo": "DragAndDrop.js"}}

## Limit the re-ordering

By default, all the items are reorderable.
You can prevent the re-ordering of some items using the `isItemReorderable` prop.
The following example shows how to only allow re-ordering of the leaves using the [`getItemOrderedChildrenIds`](/x/react-tree-view/rich-tree-view/items/#get-an-items-children-by-id) API method.

{{"demo": "OnlyReorderLeaves.js"}}

You can also limit the items in which an item can be dropped using the `canMoveItemToNewPosition` prop.
The following example shows how to only allow re-ordering inside the same parent:

{{"demo": "OnlyReorderInSameParent.js"}}

## React to an item re-ordering

You can use the `onItemPositionChange` to send the new position of an item to your backend:

{{"demo": "OnItemPositionChange.js"}}

If you want to send the entire dataset to your backend, you can use the [`getItemTree`](/x/react-tree-view/rich-tree-view/items/#get-the-current-item-tree) API method.
The following demo demonstrates it by synchronizing the first tree view with the second one whenever you do a re-ordering:

{{"demo": "SendAllItemsToServer.js"}}

## Customization

### Only trigger the reordering from a drag handle

You can create a custom Tree Item component to render a drag handle icon and only trigger the reordering when dragging from it:

{{"demo": "OnlyReorderFromDragHandle.js"}}

## Common examples

### File explorer

The example below is a simplified version of the [File Explorer](/x/react-tree-view/rich-tree-view/customization/#file-explorer) example with drag & drop re-ordering.
You can re-order items but only inside folders (or inside the trash).

{{"demo": "FileExplorer.js"}}
