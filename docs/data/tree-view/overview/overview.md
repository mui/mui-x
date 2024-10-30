---
productId: x-tree-view
title: Tree View React component
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# MUI X Tree View

<p class="description">The Tree View lets users navigate hierarchical lists of data with nested levels that can be expanded and collapsed.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

## Overview

The MUI X Tree View provides all of the functionality necessary to build a hierarchical list of expandable and collapsible items.
The package exposes two different versions of this component: `<SimpleTreeView />` and `<RichTreeView />`.

```jsx
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
```

The Simple version is recommended for hardcoded items, while the Rich version is preferred for dynamically rendered items, larger trees, and more complex use cases that require features like editing and virtualization.

The demo below shows how to render a Simple Tree View—try clicking on an item to see how it expands and collapses:

{{"demo": "TreeViewOverviewDemo.js", "defaultCodeOpen": true}}

:::info
Currently, the Simple and Rich Tree View components share many of the same features.
As this package continues to mature, more advanced features and functionality will be prioritized for the Rich Tree View.
:::
