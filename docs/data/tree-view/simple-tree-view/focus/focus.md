---
productId: x-tree-view
title: Simple Tree View - Focus
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Focus

<p class="description">Learn how to focus Tree View items.</p>

## Imperative API

To use the `apiRef` object, you need to initialize it using the `useSimpleTreeViewApiRef()` hook as follows:

```tsx
const apiRef = useSimpleTreeViewApiRef();

return <SimpleTreeView apiRef={apiRef} items={ITEMS} />;
```

When your component first renders, `apiRef.current` is `undefined`.
After the initial render, `apiRef` holds methods to interact imperatively with the Tree View.

### Focus a specific item

Use the `focusItem()` API method to focus a specific item.

```ts
apiRef.current.focusItem(
  // The DOM event that triggers the change
  event,
  // The id of the item to focus
  itemId,
);
```

:::info
This method only works with items that are currently visible.
Calling `apiRef.focusItem()` on an item with a collapsed parent has no effect.
:::

{{"demo": "ApiMethodFocusItem.js"}}
