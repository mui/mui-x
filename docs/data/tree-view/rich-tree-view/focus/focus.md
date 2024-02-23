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

You can access the `focusNode` method using the `apiRef` variable. To access this variable, use the `useTreeViewApiRef` hook.

The `focusNode` receives two parameters: `event` and `nodeId`.

:::info
The focus behavior is only supported for nodes that are currently visible.
:::

{{"demo": "FocusedRichTreeView.js"}}
