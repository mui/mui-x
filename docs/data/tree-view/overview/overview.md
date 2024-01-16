---
productId: x-tree-view
title: Tree View React component
components: SimpleTreeView, RichTreeView, TreeItem, TreeView
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# MUI X Tree View

<p class="description">The Tree View component displays a hierarchical list of content where you can expand or collapse each parent or child item.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Available components

The MUI X Tree View package exposes two different versions of the component:

- `@mui/x-tree-view/TreeView`: for simpler use cases.
- `@mui/x-tree-view/RichTreeView`: for more complex and larger uses of the Tree View component.

### Simple Tree View

The simple version of the Tree View component receive its items as a JSX children, and it's the recommended version if your items are harcoded.

{{"demo": "BasicSimpleTreeView.js"}}

### Rich Tree View

The rich version of the Tree View component is the recommended version for passing its items dynamically from an external data source through the `items` prop.
Features like editing or virtualization are available only in this version.

{{"demo": "BasicRichTreeView.js"}}
