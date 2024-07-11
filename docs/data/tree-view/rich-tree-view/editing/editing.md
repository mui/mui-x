---
productId: x-tree-view
title: Rich Tree View - Focus
githubLabel: 'component: tree view'
packageName: '@mui/x-tree-view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# Rich Tree View - label editing

<p class="description">Learn how to edit the label of Tree View items.</p>

:::warning
this doc page is stip WIP
:::

## Enable editing on certain items

You can use the `isItemEditable` prop to enable editing on certain items.

If an item is editable, the editing state can be toggled by double clicking on it, or by pressing <kbd class="key">Enter</kbd> on the keyboard when the item is in focus.

Once an item is in editing state, the value of the label can be edited. Pressing <kbd class="key">Enter</kbd> again or bluring the item will save the new value. Pressing <kbd class="key">Esc</kbd> will cancel the action and restore the item to its original state.

{{"demo": "LabelEditing.js"}}

### Limit editing to leaves

You can limit the editing to just the leaves of the tree.

{{"demo": "EditLeaves.js"}}

## Track item label change

Use the `onItemLabelChange` prop to trigger an action when the label of an item changes.

{{"demo": "EditingCallback.js"}}

## Change the default behavior

The default behavior on bluring the tree item that is being edited is to save the new value if there is one. This can be customized using the `slotProps` of the `TreeItem2`

{{"demo": "CustomBehavior.js"}}

## Enable editing using only icons

The demo below shows how to entirely override the editing behavior, and implementit using icons.

{{"demo": "EditWithIcons.js"}}

## Imperative API

:::success
To use the `apiRef` object, you need to initialize it using the `useTreeViewApiRef` hook as follows:

```tsx
const apiRef = useTreeViewApiRef();

return <RichTreeView apiRef={apiRef} items={ITEMS}>;
```

When your component first renders, `apiRef` will be `undefined`.
After this initial render, `apiRef` holds methods to interact imperatively with the Tree View.
:::

### Change the label of an item

Use the `setItemExpansion` API method to change the expansion of an item.

```ts
apiRef.current.updateItemLabel(
  // The id of the item to expand or collapse
  itemId,
  // The new label of the item.
  newLabel,
);
```

{{"demo": "ApiMethodUpdateItemLabel.js"}}
