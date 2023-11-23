---
productId: x-tree-view
title: Tree View - Items
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Tree View - Items

<p class="description">Pass data to your Tree View.</p>

:::info
If you are looking for a basic Tree View with JSX children, you can go to the [JSX children](/x/react-tree-view/jsx-children/) to learn how to use the `SimpleTreeView` component.
:::

## Basic usage

The items can be defined with the `items` prop, which expects an array of objects.

:::warning
The `items` prop should keep the same reference between two renders except if you want to apply new items.
Otherwise, the Tree View will re-generate its entire structure.
:::

{{"demo": "BasicTreeView.js"}}

## Disabled items

You can disable some of the items using the `isItemDisabled` prop:

```tsx
function isItemDisabled(row) {
  return row.disabled ?? false;
}

<TreeView isItemDisabled={isItemDisabled} />;
```

{{"demo": "DisabledItem.js", "defaultCodeOpen": false}}

:::warning
Just like the `items` prop, the `isItemDisabled` function should keep the same JavaScript reference between two renders.
Otherwise, the Tree View will re-generate its entire structure.

It could be achieved by either defining the prop outside the component scope or by memoizing using the `React.useCallback` hook if the function reuses something from the component scope.
:::
