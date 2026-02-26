---
productId: x-tree-view
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Selection

<p class="description">Handle how users can select items.</p>

## Single selection

By default, `RichTreeView` lets users select one item at a time.

{{"demo": "SingleSelectTreeView.js"}}

:::success
When `RichTreeView` is set to allow one seletion at a time, users can select an item by clicking it or using the [keyboard shortcuts](/x/react-tree-view/accessibility/#on-single-select-trees).
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

Use the `isItemSelectionDisabled` prop to disable selection on specific items.
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

## Automatic parents and children selection

By default, selecting a parent item does not select its children.
You can override this behavior using the `selectionPropagation` prop.

Here's how it's structured:

```ts
type TreeViewSelectionPropagation = {
  descendants?: boolean; // default: false
  parents?: boolean; // default: false
};
```

When `selectionPropagation.descendants` is set to `true`:

- Selecting a parent selects all its descendants automatically.
- Deselecting a parent deselects all its descendants automatically.

When `selectionPropagation.parents` is set to `true`:

- Selecting all the descendants of a parent selects the parent automatically.
- Deselecting a descendant of a selected parent deselects the parent automatically.

The example below demonstrates the usage of the `selectionPropagation` prop.

{{"demo": "SelectionPropagation.js", "defaultCodeOpen": false}}

:::warning
This feature only works when multi-selection is enabled using `props.multiSelect`.
:::

### Apply propagation on mount

You can use the `useApplyPropagationToSelectedItemsOnMount()` to apply the selection propagation to your `defaultSelectedItems` or `selectedItems` prop.

```tsx
// Uncontrolled example
const defaultSelectedItems = useApplyPropagationToSelectedItemsOnMount({
  items: props.items,
  selectionPropagation: props.selectedPropagation,
  selectedItems: ['10', '11', '13', '14'],
});

return (
  <RichTreeView
    items={props.items}
    selectionPropagation={props.selectionPropagation}
    defaultSelectedItems={defaultSelectedItems}
  />
);
```

```tsx
// Controlled example
const initialSelectedItems = useApplyPropagationToSelectedItemsOnMount({
  items: props.items,
  selectionPropagation: props.selectedPropagation,
  selectedItems: ['10', '11', '13', '14'],
});

const [selectedItems, setSelectedItems] = React.useState(initialSelectedItems);

return (
  <RichTreeView
    items={props.items}
    selectionPropagation={props.selectionPropagation}
    selectedItems={selectedItems}
    onSelectedItemsChange={setSelectedItems}
  />
);
```

In the example below, only Anna, Michael, Elizabeth, and William are selected in the raw data.
Their ancestors are added to the `defaultSelectedItems` prop by the hook:

{{"demo": "SelectionPropagationMount.js", "defaultCodeOpen": false}}

:::success
The `useApplyPropagationToSelectedItemsOnMount()` must receive the following props as provided to `RichTreeView`:

- `items`
- `selectionPropagation`
- `getItemId` (can be skipped if not provided to `RichTreeView`)
- `getItemChildren` (can be skipped if not provided to `RichTreeView`)

:::

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

{{"demo": "ApiMethodSetItemSelection.js", "defaultCodeOpen": false}}

You can use the `keepExistingSelection` property to avoid losing the items that have already been selected when using `multiSelect`:

{{"demo": "ApiMethodSetItemSelectionKeepExistingSelection.js", "defaultCodeOpen": false}}
