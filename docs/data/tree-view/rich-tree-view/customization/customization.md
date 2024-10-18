---
productId: x-tree-view
title: Rich Tree View - Customization
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Customization

<p class="description">Learn how to customize the Rich Tree View component.</p>

:::success
See [Common concepts—Custom slots and subcomponents](/x/common-concepts/custom-components/) to learn how to use slots.
:::

## Basics

### Custom icons

Use the `collapseIcon` slot, the `expandIcon` slot and the `defaultEndIcon` prop to customize the Tree View icons.
The demo below shows how to add icons using both an existing icon library, such as [Material Icons](/material-ui/material-icons/), and creating an icon from scratch using Material UI's [SVG Icon component](/material-ui/icons/#svgicon).

{{"demo": "CustomIcons.js", "defaultCodeOpen": false}}

### Custom toggle animations

Use the `groupTransition` slot on the `<TreeItem />` to pass a component that handles your animation.

The demo below is animated using Material UI's [Collapse](/material-ui/transitions/#collapse) component together with the [react-spring](https://www.react-spring.dev/) library.

{{"demo": "CustomAnimation.js", "defaultCodeOpen": false}}

### Custom styling

Use `treeItemClasses` to target internal elements of the Tree Item component and change their styles.

{{"demo": "CustomStyling.js"}}

### Custom Tree Item

You can use the Tree Item's customization API to build new layouts and manage behaviors.
Learn more about the anatomy of the Tree Item components and the customization utilities provided in the [Tree Item customization doc](/x/react-tree-view/tree-item-customization/).

### Headless API

Use the `useTreeItem` hook to create your own component.
The demo below shows how to add an avatar and custom typography elements.

{{"demo": "HeadlessAPI.js", "defaultCodeOpen": false}}

## Common examples

### File explorer

The demo below shows many of the previous customization examples brought together to make the Tree View component look completely different than its default design.

{{"demo": "FileExplorer.js", "defaultCodeOpen": false}}
