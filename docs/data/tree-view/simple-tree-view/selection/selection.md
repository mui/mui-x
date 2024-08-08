---
productId: x-tree-view
title: Simple Tree View - Selection
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Selection

<p class="description">Learn how to enable item selection for the Tree View component.</p>

## Single selection

By default, the Tree View allows selecting a single item.

{{"demo": "SingleSelectTreeView.js"}}

:::success
When the Tree View uses single selection, you can select an item by clicking it,
or using the [keyboard shortcuts](/x/react-tree-view/accessibility/#on-single-select-trees).
:::

## Multi selection

Use the `multiSelect` prop to enable multi-selection.

{{"demo": "MultiSelectTreeView.js"}}

:::success
When the Tree View uses multi selection, you can select multiple items using the mouse in two ways:

- To select multiple independent items, hold <kbd class="key">Ctrl</kbd> (or <kbd class="key">⌘ Command</kbd> on macOS) and click the items.
- To select a range of items, click on the first item of the range, then hold the <kbd class="key">Shift</kbd> key while clicking on the last item of the range.

You can also use the [keyboard shortcuts](/x/react-tree-view/accessibility/#on-multi-select-trees) to select items.
:::

## Disable selection

Use the `disableSelection` prop if you don't want your items to be selectable:

{{"demo": "DisableSelection.js"}}

## Checkbox selection

To activate checkbox selection set `checkboxSelection={true}`:

{{"demo": "CheckboxSelection.js"}}

This is also compatible with multi selection:

{{"demo": "CheckboxMultiSelection.js"}}

## Controlled selection

Use the `selectedItems` prop to control selected Tree View items.
You can also use the `onSelectedItemsChange` prop to listen to changes in the selected items and update the prop accordingly.

{{"demo": "ControlledSelection.js"}}

:::info

- The selection is **controlled** when its parent manages it by providing a `selectedItems` prop.
- The selection is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultSelectedItems` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Track item selection change

Use the `onItemSelectionToggle` prop if you want to react to an item selection change:

{{"demo": "TrackItemSelectionToggle.js"}}

## Imperative API

:::success
To use the `apiRef` object, you need to initialize it using the `useTreeViewApiRef` hook as follows:

```tsx
const apiRef = useTreeViewApiRef();

return <SimpleTreeView apiRef={apiRef}>{children}</SimpleTreeView>;
```

When your component first renders, `apiRef` will be `undefined`.
After this initial render, `apiRef` holds methods to interact imperatively with the Tree View.
:::

### Select or deselect an item

Use the `selectItem` API method to select or deselect an item:

```ts
apiRef.current.selectItem({
  // The DOM event that triggered the change
  event,
  // The id of the item to select or deselect
  itemId,
  // If `true`, the other already selected items will remain selected
  // Otherwise, they will be deselected
  // This parameter is only relevant when `multiSelect` is `true`
  keepExistingSelection,
  // If `true` the item will be selected
  // If `false` the item will be deselected
  // If not defined, the item's new selection status will be the opposite of its current one
  shouldBeSelected,
});
```

{{"demo": "ApiMethodSelectItem.js"}}

You can use the `keepExistingSelection` property to avoid losing the already selected items when using `multiSelect`:

{{"demo": "ApiMethodSelectItemKeepExistingSelection.js"}}
