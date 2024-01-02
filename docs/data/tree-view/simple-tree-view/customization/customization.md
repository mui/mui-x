---
productId: x-tree-view
title: Simple Tree View - Customization
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Customization

<p class="description">Learn how to customize the Tree View component.</p>

## Custom icons, border, and animation

The demo below shows how to use a custom animation for displaying the Tree View items (using [react-sprint](https://www.react-spring.dev/)), as well as adding a custom border and icons.

{{"demo": "CustomizedTreeView.js"}}

## The ContentProps component and useTreeItem hook

```jsx
import {
  TreeItemContentProps,
  TreeItemProps,
  useTreeItem,
} from '@mui/x-tree-view/TreeItem';
```

The MUI X Tree View component also provides the `TreeItemContentProps` and `TreeItemProps` components as well as the `useTreeItem` hook for deeper customization options.
Below are a couple of example demos on how to use them:

### Limit expansion interaction

The demo below shows how to limit the expansion interaction click area to the arrow icon only.

{{"demo": "IconExpansionTreeView.js", "defaultCodeOpen": false}}

### Full width background

The demo below builds upon the above to also make the Tree Item background span the full Tree View width.

{{"demo": "BarTreeView.js", "defaultCodeOpen": false}}

## Gmail clone

The Gmail sidenav is probably one of the most famous Tree View component in daily use.
The demo below shows how to build a similar version:

{{"demo": "GmailTreeView.js"}}
