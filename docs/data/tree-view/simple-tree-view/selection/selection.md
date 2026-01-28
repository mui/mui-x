---
productId: x-tree-view
title: Simple Tree View - Selection
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Selection

<p class="description">Learn how to enable item selection for the Tree View component.</p>

## Single selection

By default, `SimpleTreeView` lets users select a single item.

{{"demo": "SingleSelectTreeView.js"}}

:::success
When `SimpleTreeView` is set to allow one seletion at a time, users can select an item by clicking it or using the [keyboard shortcuts](/x/react-tree-view/accessibility/#on-single-select-trees).
:::

## Multi-selection

Use the `multiSelect` prop to enable multi-selection.

{{"demo": "MultiSelectTreeView.js"}}

:::success
When multi-selection is enabled, users can select multiple items using the mouse in two ways:

1. To select multiple independent items, hold <kbd class="key">Ctrl</kbd> (or <kbd class="key">⌘ Command</kbd> on macOS) and click the items.
2. To select a range of items, click on the first item of the range, then hold the <kbd class="key">Shift</kbd> key while clicking on the last item of the range.

You can also use [keyboard shortcuts](/x/react-tree-view/accessibility/#on-multi-select-trees) to select items.
:::

## Disable selection

Use the `disableSelection` prop if you don't want the items to be selectable:

{{"demo": "DisableSelection.js"}}

## Checkbox selection

To enable checkbox selection, set `checkboxSelection={true}`:

{{"demo": "CheckboxSelection.js"}}

This is also compatible with multi-selection:

{{"demo": "CheckboxMultiSelection.js"}}

## Selectable items

Use the `disableSelection` prop on the Tree Item component to disable selection on specific items.
When an item is not selectable, the checkbox is hidden regardless of [`checkboxSelection`](#checkbox-selection) prop.

In the example below, only leaf items (items without children) are selectable.

{{"demo": "SelectableItems.js"}}

## Controlled selection

Use the `selectedItems` prop to control selected `TreeItem` components.
You can also use the `onSelectedItemsChange` prop to listen to changes in the selected items and update the prop accordingly.

{{"demo": "ControlledSelection.js"}}

:::info

- The selection is **controlled** when its parent manages it by providing a `selectedItems` prop.
- The selection is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultSelectedItems` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Track item selection change

Use the `onItemSelectionToggle` prop to react to an item selection change:

{{"demo": "TrackItemSelectionToggle.js"}}

## Imperative API

To use the `apiRef` object, you need to initialize it using the `useSimpleTreeViewApiRef()` hook as follows:

```tsx
const apiRef = useSimpleTreeViewApiRef();

return <SimpleTreeView apiRef={apiRef} items={ITEMS} />;
```

When your component first renders, `apiRef.current` is `undefined`.
After the initial render, `apiRef` holds methods to interact imperatively with the Tree View.

### Select or deselect an item

Use the `setItemSelection()` API method to select or deselect an item:

```ts
apiRef.current.setItemSelection({
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
  // If not defined, the item's selection status will be toggled
  shouldBeSelected,
});
```

{{"demo": "ApiMethodSetItemSelection.js"}}

You can use the `keepExistingSelection` property to avoid losing the items that have already been selected when using `multiSelect`:

{{"demo": "ApiMethodSetItemSelectionKeepExistingSelection.js"}}
