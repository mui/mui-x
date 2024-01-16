---
productId: x-tree-view
title: Rich Tree View - Focus
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Focus

<p class="description">Handle how users can focus items.</p>

## Controlled focus

Use the `focusedNode` prop to control the focused item.

You can use the `onFocusedNodeChange` prop to listen to changes in the focused item and update the prop accordingly.

{{"demo": "FocusedRichTreeView.js"}}

:::info

- The focus is **controlled** when its parent manages it by providing a `focusedNode` prop.
- The focus is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultFocusedNode` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::
