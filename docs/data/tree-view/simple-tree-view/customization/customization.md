---
productId: x-tree-view
title: Simple Tree View - Customization
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Customization

<p class="description">Learn how to customize the Simple Tree View component.</p>

:::success
See [Common concepts—Slots and subcomponents](/x/common-concepts/custom-components/) to learn how to use slots.
:::

## Basics

### Custom icons

Use the `collapseIcon` slot, the `expandIcon` slot and the `defaultEndIcon` prop to customize `SimpleTreeView` icons.
The demo below shows how to add icons using both an existing icon library, such as [Material Icons](/material-ui/material-icons/), and creating an icon from scratch using Material UI's [`SvgIcon`](/material-ui/icons/#svgicon).

{{"demo": "CustomIcons.js", "defaultCodeOpen": false}}

### Custom toggle animations

Use the `groupTransition` slot on `SimpleTreeView` to pass a component that handles your animation.

The demo below is animated using Material UI's [`Collapse`](/material-ui/transitions/#collapse) component together with the [react-spring](https://www.react-spring.dev/) library.

{{"demo": "CustomAnimation.js", "defaultCodeOpen": false}}

### Custom styling

Use `treeItemClasses` to target internal elements of a `TreeItem` and change its styles.

{{"demo": "CustomStyling.js"}}

### Custom Tree Item

You can use the `TreeItem` customization API to build new layouts and manage behaviors.

See [Tree Item customization](/x/react-tree-view/tree-item-customization/) to learn more about the anatomy of `TreeItem` and the customization utilities provided.

### Headless API

Use the `useTreeItem()` hook to create your own component.
The demo below shows how to add an avatar and custom typography elements.

{{"demo": "HeadlessAPI.js", "defaultCodeOpen": false}}

## Common examples

### Connection border

Target the `treeItemClasses.groupTransition` class to add connection borders between `TreeItem` components.

{{"demo": "BorderedTreeView.js", "defaultCodeOpen": false}}

### Gmail clone

The Gmail sidebar is one of the most well-known examples of a tree view.
The demo below shows how to recreate it with `SimpleTreeView`:

{{"demo": "GmailTreeView.js"}}
