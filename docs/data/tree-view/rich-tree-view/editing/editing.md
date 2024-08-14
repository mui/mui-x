---
productId: x-tree-view
title: Rich Tree View - Editing
githubLabel: 'component: tree view'
packageName: '@mui/x-tree-view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# Rich Tree View - Label editing

<p class="description">Learn how to edit the label of Tree View items.</p>

## Enable label editing

You can use the `isItemEditable` prop to enable editing.
If set to `true`, this prop will enable label editing on all items:

{{"demo": "LabelEditingAllItems.js"}}

:::success
If an item is editable, the editing state can be toggled by double clicking on it, or by pressing <kbd class="key">Enter</kbd> on the keyboard when the item is in focus.

Once an item is in editing state, the value of the label can be edited. Pressing <kbd class="key">Enter</kbd> again or bluring the item will save the new value. Pressing <kbd class="key">Esc</kbd> will cancel the action and restore the item to its original state.

:::

## Limit editing to some items

If you pass a method to `isItemEditable`, only the items for which the method returns `true` will be editable:

{{"demo": "LabelEditingSomeItems.js"}}

### Limit editing to leaves

You can limit the editing to just the leaves of the tree.

{{"demo": "EditLeaves.js"}}

## Track item label change

Use the `onItemLabelChange` prop to trigger an action when the label of an item changes.

{{"demo": "EditingCallback.js"}}

## Change the default behavior

By default, blurring the tree item saves the new value if there is one.
To modify this behavior, use the `slotProps` of the `TreeItem2`.

{{"demo": "CustomBehavior.js"}}

## Validation

You can override the event handlers of the `labelInput` and implement a custom validation logic using the interaction methods from `useTreeItem2Utils`.

{{"demo": "Validation.js"}}

## Enable editing using only icons

The demo below shows how to entirely override the editing behavior, and implement it using icons.

{{"demo": "EditWithIcons.js"}}

## Create a custom labelInput

The demo below shows how to use a different component in the `labelInput` slot.

{{"demo": "CustomLabelInput.js"}}

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
  // The id of the item to to update
  itemId,
  // The new label of the item.
  newLabel,
);
```

{{"demo": "ApiMethodUpdateItemLabel.js"}}
