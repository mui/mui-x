---
productId: x-tree-view
title: Simple Tree View - Expansion
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Expansion

<p class="description">Learn how to handle expanding and collapsing Tree View items.</p>

## Controlled expansion

Use the `expandedItems` prop to control the expanded items.
You can also use the `onExpandedItemsChange` prop to listen to changes in the expanded items and update the prop accordingly.

{{"demo": "ControlledExpansion.js"}}

:::info

- The expansion is **controlled** when its parent manages it by providing a `expandedItems` prop.
- The expansion is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultExpandedItems` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Track item expansion change

Use the `onItemExpansionToggle` prop to trigger an action upon an item being expanded.

{{"demo": "TrackItemExpansionToggle.js"}}
