---
productId: x-tree-view
title: Tree View React component
components: SimpleTreeView, RichTreeView, TreeItem
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# Tree View

<p class="description">A Tree View widget presents a hierarchical list.</p>

Tree views can be used to represent a file system navigator displaying folders and files, an item representing a folder can be expanded to reveal the contents of the folder, which may be files, folders, or both.

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Available components

The Tree View exists in two versions:

### SimpleTreeView

The `SimpleTreeView` component accepts its items as JSX children.
It is designed for simple use-cases where the items are hardcoded.

{{"demo": "BasicSimpleTreeView.js"}}

:::warning
Most new advanced features won't be available on this component.
If you are waiting for features like editing or virtualization, you should probably use `RichTreeView` instead.

Throughout the documentation, all the features not available for this component are marked as such at the beginning of the doc pages.
:::

### RichTreeView

The `RichTreeView` component accepts its items takes with the `items` prop.
It is designed for more advanced use-cases where the items are dynamically loaded from a datasource.

{{"demo": "BasicRichTreeView.js"}}
