---
productId: x-tree-view
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Focus

<p class="description">Learn how to focus Tree View items.</p>

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
