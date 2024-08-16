---
productId: x-tree-view
title: Rich Tree View - Focus
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Focus

<p class="description">Learn how to focus Tree View items.</p>

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

### Focus a specific item

Use the `focusItem` API method to focus a specific item.

```ts
apiRef.current.focusItem(
  // The DOM event that triggered the change
  event,
  // The id of the item to focus
  itemId,
);
```

:::info
This method only works with items that are currently visible.
Calling `apiRef.focusItem` on an item whose parent is collapsed will do nothing.
:::

{{"demo": "ApiMethodFocusItem.js"}}
