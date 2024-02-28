---
productId: x-tree-view
title: Tree View React component
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# MUI X Tree View

<p class="description">The Tree View component lets users navigate hierarchical lists of data with nested levels that can be expanded and collapsed.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Available components

The MUI X Tree View package exposes two different versions of the component:

### Simple Tree View

```jsx
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
```

The simple version of the Tree View component receives its items as JSX children.
This is the recommended version for hardcoded items.

{{"demo": "BasicSimpleTreeView.js"}}

### Rich Tree View

```jsx
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
```

The rich version of the Tree View component receives its items dynamically from an external data source.
This is the recommended version for larger trees, as well as those that require more advanced features like editing and virtualization.

{{"demo": "BasicRichTreeView.js"}}

:::info
At the moment, the Simple and Rich Tree Views are similar in terms of feature support. But as the component grows, you can expect to see the more advanced ones appear primarily on the Rich Tree View.
:::
