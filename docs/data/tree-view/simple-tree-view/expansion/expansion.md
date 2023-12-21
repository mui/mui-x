---
productId: x-tree-view
title: Simple Tree View - Expansion
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Expansion

<p class="description">Handle how users can expand items.</p>

## Controlled expansion

Use the `expanded` prop to control the expanded items.

You can use the `onNodeToggle` prop to listen to changes in the expanded items and update the prop accordingly.

{{"demo": "ControlledExpansion.js"}}

:::info

- The expansion is **controlled** when its parent manages it by providing a `expanded` prop.
- The expansion is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultExpanded` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::
