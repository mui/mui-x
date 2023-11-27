---
productId: x-tree-view
title: Tree View - Items
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Tree View - Items

<p class="description">Pass data to your Tree View.</p>

## Usage with `TreeView`

{{"demo": "BasicTreeView.js"}}

## Usage with `RichTreeView`

The items can be defined with the `items` prop, which expects an array of objects.

:::warning
The `items` prop should keep the same reference between two renders except if you want to apply new items.
Otherwise, the Tree View will re-generate its entire structure.
:::

{{"demo": "BasicRichTreeView.js"}}

## Disabled items

### Disable items on `TreeView`

You can disable some of the items using the `disabled` prop on the `TreeItem` component:

```tsx
<TreeView>
  <TreeItem nodeId="@mui/x-scheduler" label="Scheduler" disabled />
</TreeView>
```

{{"demo": "DisabledJSXItem.js", "defaultCodeOpen": false}}

### Disable items on `RichTreeView`

You can disable some of the items using the `isItemDisabled` prop on the `RichTreeView` component:

```tsx
function isItemDisabled(row) {
  return row.disabled ?? false;
}

<TreeView isItemDisabled={isItemDisabled} />;
```

{{"demo": "DisabledPropItem.js", "defaultCodeOpen": false}}

:::warning
Just like the `items` prop, the `isItemDisabled` function should keep the same JavaScript reference between two renders.
Otherwise, the Tree View will re-generate its entire structure.

It could be achieved by either defining the prop outside the component scope or by memoizing using the `React.useCallback` hook if the function reuses something from the component scope.
:::

### Interact with disabled items

The behavior of disabled tree items depends on the `disabledItemsFocusable` prop.

If it is false:

- Arrow keys will not focus disabled items and, the next non-disabled item will be focused.
- Typing the first character of a disabled item's label will not focus the item.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- Shift + arrow keys will skip disabled items and, the next non-disabled item will be selected.
- Programmatic focus will not focus disabled items.

If it is true:

- Arrow keys will focus disabled items.
- Typing the first character of a disabled item's label will focus the item.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- Shift + arrow keys will not skip disabled items but, the disabled item will not be selected.
- Programmatic focus will focus disabled items.

{{"demo": "DisabledItemsFocusable.js", "defaultCodeOpen": false}}
