---
productId: x-tree-view
components: RichTreeView, TreeItem
githubLabel: 'scope: tree view'
packageName: '@mui/x-tree-view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# Rich Tree View - Label editing

<p class="description">Learn how to edit Tree View item labels.</p>

## Enable label editing

Use the `isItemEditable` prop to enable editing.
If set to `true`, this prop enables label editing on all items as shown in the demo below:

{{"demo": "LabelEditingAllItems.js"}}

:::success
If an item is editable, the editing state can be toggled by double clicking on it, or by pressing <kbd class="key">Enter</kbd> on the keyboard when the item is in focus.

Once an item is in the editing state, the value of the label can be edited.
Pressing <kbd class="key">Enter</kbd> again or blurring the item will save the new value.
Pressing <kbd class="key">Esc</kbd> will cancel the action and restore the item to its original state.

:::

## Limit editing to some items

If you pass a method to `isItemEditable`, then only the items for which the method returns `true` will be editable:

{{"demo": "LabelEditingSomeItems.js"}}

### Limit editing to leaves

You can limit editing to just the leaves of the tree, as shown below:

{{"demo": "EditLeaves.js"}}

## Track item label change

Use the `onItemLabelChange` prop to trigger an action when an item label changes:

{{"demo": "EditingCallback.js"}}

## Change the default behavior

By default, blurring a `TreeItem` saves the new value if there is one.
To modify this behavior, use the `slotProps` on the `TreeItem` as shown below:

{{"demo": "CustomBehavior.js"}}

## Validation

You can override the event handlers of the `labelInput` and implement a custom validation logic using the interaction methods from `useTreeItemUtils()`:

{{"demo": "Validation.js"}}

## Enable editing using only icons

The demo below shows how to completely override the editing behavior and implement it using icons:

{{"demo": "EditWithIcons.js"}}

## Create a custom labelInput

The demo below shows how to use a different component in the `labelInput` slot:

{{"demo": "CustomLabelInput.js"}}

## Imperative API

To use the `apiRef` object, you need to initialize it using the `useRichTreeViewApiRef()` or `useRichTreeViewProApiRef()` hook as follows:

```tsx
// Community package
const apiRef = useRichTreeViewApiRef();

return <RichTreeView apiRef={apiRef} items={ITEMS} />;

// Pro package
const apiRef = useRichTreeViewProApiRef();

return <RichTreeViewPro apiRef={apiRef} items={ITEMS} />;
```

When your component first renders, `apiRef.current` is `undefined`.
After the initial render, `apiRef` holds methods to interact imperatively with `RichTreeView`.

### Change the label of an item

Use the `updateItemLabel()` API method to imperatively update the label of an item.

```ts
apiRef.current.updateItemLabel(
  // The id of the item to update
  itemId,
  // The new label of the item
  newLabel,
);
```

{{"demo": "ApiMethodUpdateItemLabel.js"}}

### Change edition mode of an item

Use the `setEditedItem()` API method to set which item is being edited.

```ts
apiRef.current.setEditedItem(
  // The id of the item to edit, or `null` to exit editing mode
  itemId,
);
```

{{"demo": "ApiMethodSetEditedItem.js"}}

## Editing lazy loaded children

To store the updated item labels on your server, use the `onItemLabelChange()` callback function.

Changes to the label are not automatically updated in the `dataSourceCache` and must be updated manually.

```tsx
const handleItemLabelChange = (itemId: TreeViewItemId, newLabel: string) => {
  // update your cache here
};

<RichTreeViewPro
  items={[]}
  onItemLabelChange={handleItemLabelChange}
  isItemEditable
  dataSource={{
    getChildrenCount: (item) => item?.childrenCount as number,
    getTreeItems: fetchData,
  }}
  {...otherProps}
/>;
```

See [lazy loading](/x/react-tree-view/rich-tree-view/lazy-loading/#lazy-loading-and-label-editing) for more details.
