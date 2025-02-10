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

The MUI X Tree View provides all of the functionality necessary to build a hierarchical list of expandable and collapsible items.
The Tree View's theming features are designed to be frictionless when integrating with Material UI and other MUI X components, but it can also stand on its own and be customized to meet the needs of any design system.

The Tree View is **open-core**: The Community version is MIT-licensed and free forever, while more advanced features require a Pro commercial license.
See [MUI X Licensing](/x/introduction/licensing/) for complete details.

The demo below shows how to render a Simple Tree View—try clicking on an item to see how it expands and collapses:

{{"demo": "TreeViewOverviewDemo.js", "defaultCodeOpen": true}}

## Community version (free forever)

```js
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
```

```js
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
```

The MIT-licensed Community version of the Tree View covers the most common use cases.
Proceed to the [Quickstart guide](/x/react-tree-view/quickstart/) to learn more about the differences between the Simple and Rich Tree View components.

## Pro version [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

```js
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
```

The Pro version of the Rich Tree View expands on the Community version by providing [drag-and-drop reordering](/x/react-tree-view/rich-tree-view/ordering/) functionality in addition to all other features.
Pro features are denoted by the blue cube icon (<span class="plan-pro"></span>) throughout the documentation.
