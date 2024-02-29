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

## Focus a specific node

You can use the the `apiRef.focusNode` method to focus a specific node.
This methods receives two parameters: `event` and `nodeId`.

:::success
To use the `apiRef` object, you need to initialize it using the `useTreeViewApiRef` hook as follows:

```tsx
const apiRef = useTreeViewApiRef();

return <RichTreeView apiRef={apiRef} items={ITEMS}>;
```

`apiRef` will be undefined during the first render and will then contain methods allowing you to imperatively interact with the Tree View.
:::

:::info
This method only works with nodes that are currently visible.
Calling `apiRef.focusNode` on a node whose parent is collapsed will do nothing.
:::

{{"demo": "FocusedRichTreeView.js"}}
