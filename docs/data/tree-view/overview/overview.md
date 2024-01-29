---
productId: x-tree-view
title: Tree View React component
components: SimpleTreeView, RichTreeView, TreeItem, TreeView
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# MUI X Tree View

<p class="description">The Tree View component lets users navigate hierarchical lists of data with nested levels that can be expanded and collapsed.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Available components

The MUI X Tree View package exposes two different versions of the component:

- `@mui/x-tree-view/TreeView`: for simpler use cases.
- `@mui/x-tree-view/RichTreeView`: for more complex and larger uses of the Tree View component.

### Simple Tree View

The simple version of the Tree View component receives its items as JSX children.
This is the recommended version for hardcoded items.

{{"demo": "BasicSimpleTreeView.js"}}

### Rich Tree View

The rich version of the Tree View component receives its items dynamically from an external data source.
This is the recommended version for larger trees, as well as those that require more advanced features like editing and virtualization.

{{"demo": "BasicRichTreeView.js"}}
