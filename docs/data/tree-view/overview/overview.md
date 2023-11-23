---
productId: x-tree-view
title: Tree View React component
components: TreeView, TreeItem
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# Tree View

<p class="description">A tree view widget presents a hierarchical list.</p>

Tree views can be used to represent a file system navigator displaying folders and files, an item representing a folder can be expanded to reveal the contents of the folder, which may be files, folders, or both.

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Basic tree view

{{"demo": "FileSystemNavigator.js"}}

## ContentComponent prop

You can use the `ContentComponent` prop and the `useTreeItem` hook to further customize the behavior of the TreeItem.

Such as limiting expansion to clicking the expand icon:

{{"demo": "IconExpansionTreeView.js", "defaultCodeOpen": false}}

Or increasing the width of the item state indicator to be full-width:

{{"demo": "BarTreeView.js", "defaultCodeOpen": false}}

## Customization

### Custom icons, border and animation

{{"demo": "CustomizedTreeView.js"}}

### Gmail clone

{{"demo": "GmailTreeView.js"}}

## Accessibility

(WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)

The component follows the WAI-ARIA authoring practices.

To have an accessible tree view you must use `aria-labelledby` or `aria-label` to reference or provide a label on the TreeView, otherwise screen readers will announce it as "tree", making it hard to understand the context of a specific tree item.

## TypeScript

In order to benefit from the [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users need to import the following types.
Internally, it uses module augmentation to extend the default theme structure.

```tsx
// When using TypeScript 4.x and above
import type {} from '@mui/x-tree-view/themeAugmentation';
// When using TypeScript 3.x and below
import '@mui/x-tree-view/themeAugmentation';

const theme = createTheme({
  components: {
    MuiTreeView: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});
```
