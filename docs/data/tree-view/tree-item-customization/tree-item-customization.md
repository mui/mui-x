---
productId: x-tree-view
title: Tree Item Customization
components: SimpleTreeView, RichTreeView, TreeItem, TreeItem2
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Tree Item Customization

<p class="description">Learn how to customize the Tree Item component.</p>

## Basics

### Change nested item's indentation

Use the `itemChildrenIndentation` prop to change the indentation of the nested items.
By default, a nested item is indented by `12px` from its parent item.

{{"demo": "ItemChildrenIndentationProp.js"}}

:::success
This feature is compatible with both the `TreeItem` and `TreeItem2` components
If you are using a custom Tree Item component, and you want to override the padding,
then apply the following padding to your `groupTransition` element:

```ts
const CustomTreeItem2GroupTransition = styled(TreeItem2GroupTransition)(({ theme }) => ({
  // ...other styles
  paddingLeft: `var(--TreeView-itemChildrenIndentation)`,
}
```

If you are using the `indentationAtItemLevel` prop, then instead apply the following padding to your `content` element:

```ts
const CustomTreeItem2Content = styled(TreeItem2Content)(({ theme }) => ({
  // ...other styles
  paddingLeft:
      `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
}
```

:::

### Apply the nested item's indentation at the item level

By default, the indentation of nested items is applied by the `groupTransition` slot of its parent (i.e.: the DOM element that wraps all the children of a given item).
This approach is not compatible with upcoming features like the reordering of items using drag & drop.

To apply the indentation at the item level (i.e.: have each item responsible for setting its own indentation using the `padding-left` CSS property on its `content` slot),
you can use the `indentationAtItemLevel` experimental feature.
It will become the default behavior in the next major version of the Tree View component.

{{"demo": "IndentationAtItemLevel.js"}}

:::success
This feature is compatible with both the `TreeItem` and `TreeItem2` components and with the `itemChildrenIndentation` prop.
If you are using a custom Tree Item component, and you want to override the padding,
then apply the following padding to your `content` element:

```ts
const CustomTreeItem2Content = styled(TreeItem2Content)(({ theme }) => ({
  // ...other styles
  paddingLeft:
      `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
}
```

:::
