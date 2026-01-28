---
productId: x-tree-view
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Expansion

<p class="description">Handle how users can expand and collapse items.</p>

## Controlled expansion

Use the `expandedItems` prop to control the expanded items.

You can use the `onExpandedItemsChange` prop to listen to changes to the expanded items and update the prop accordingly.

{{"demo": "ControlledExpansion.js"}}

:::info

- Expansion is **controlled** when its parent manages it by providing a `expandedItems` prop.
- Expansion is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultExpandedItems` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Track item expansion change

Use the `onItemExpansionToggle` prop to react to an item expansion change:

{{"demo": "TrackItemExpansionToggle.js"}}

## Limit expansion to icon container

You can use the `expansionTrigger` prop to decide if the expansion interaction should be triggered by clicking on the icon container instead of the whole `TreeItem` content.

{{"demo": "IconExpansionTreeView.js"}}

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

### Change an item expansion

Use the `setItemExpansion()` API method to change the expansion of an item.

```ts
apiRef.current.setItemExpansion({
  // The DOM event that triggered the change
  event,
  // The id of the item to expand or collapse
  itemId,
  // If `true` the item is expanded
  // If `false` the item is collapsed
  // If not defined, the item's expansion status is toggled.
  shouldBeExpanded,
});
```

{{"demo": "ApiMethodSetItemExpansion.js"}}

### Check if an item is expanded

Use the `isItemExpanded()` API method to check the expansion of an item.

```ts
apiRef.current.isItemExpanded(
  // The id of the item to check
  itemId,
);
```

{{"demo": "ApiMethodIsItemExpanded.js", "defaultCodeOpen": false}}
