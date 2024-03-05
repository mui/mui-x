---
productId: x-tree-view
title: Rich Tree View - Customization
components: RichTreeView, TreeItem, TreeItem2
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Customization

<p class="description">Learn how to customize the rich version of the Tree View component.</p>

## Basics

### Custom label

Use the `label` slot to customize the Tree Item label or to replace it with an entirely custom component.

The `slotProps` prop allows you to pass props to the default label component:

:::warning
TODO
:::

The `slots` prop allows you to replace the default label with your own component.
The demo below shows how to implement a very basic label-editing feature:

{{"demo": "LabelSlots.js", "defaultCodeOpen": false}}
