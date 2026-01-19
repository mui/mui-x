---
productId: x-tree-view
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Virtualization

<p class="description">Handle large datasets in your Tree View.</p>

## Basic usage

Use the `virtualization` prop to enable virtualization on the `RichTreeViewPro` component.
Here is an example of a Tree View with 100 000 items:

{{"demo": "BasicVirtualizedRichTreeViewPro.js"}}

:::success
When using virtualization, the DOM structure of the tree is flat (this means that the descendants of a given item are rendered as siblings):

```html
<ul>
  <li>Item 1</li>
  <li>Item 1-1></li>
  <li>Item 1-2</li>
  <li>Item 2</li>
</ul>
```

:::
