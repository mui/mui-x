---
productId: x-tree-view
title: Simple Tree View - Customization
components: SimpleTreeView, TreeItem, TreeItem2
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Customization

<p class="description">Learn how to customize the Simple Tree View component.</p>

## Basics

### Custom icons

Use the `collapseIcon` slot, the `expandIcon` slot and the `defaultEndIcon` prop to customize the Tree View icons.
The demo below shows how to add icons using both an existing icon library, such as [Material Icons](/material-ui/material-icons/), and creating an icon from scratch using Material UI's [SVG Icon component](/material-ui/icons/#svgicon).

{{"demo": "CustomIcons.js", "defaultCodeOpen": false}}

### Custom toggle animations

Use the `groupTransition` slot on the `TreeItem` to pass a component that handles your animation.

The demo below is animated using Material UI's [Collapse](/material-ui/transitions/#collapse) component together with the [react-spring](https://www.react-spring.dev/) library.

{{"demo": "CustomAnimation.js", "defaultCodeOpen": false}}

### Custom styling

Use `treeItemClasses` to target internal elements of the Tree Item component and change their styles.

{{"demo": "CustomStyling.js"}}

### Custom label

:::warning
This example is built using the new `TreeItem2` component
which adds several slots to modify the content of the Tree Item or change its behavior.

You can learn more about this new component in the [Overview page](/x/react-tree-view/#tree-item-components).
:::

Use the `label` slot to customize the Tree Item label or to replace it with a custom component.

The `slotProps` prop allows you to pass props to the label component.
The demo below shows how to pass an `id` attribute to the Tree Item label:

{{"demo": "LabelSlotProps.js", "defaultCodeOpen": false }}

The `slots` prop allows you to replace the default label with your own component:
The demo below shows how to add a tooltip on the Tree Item label:

{{"demo": "LabelSlots.js", "defaultCodeOpen": false}}

### Headless API

Use the `useTreeItem2` hook to create your own component.
The demo below shows how to add an avatar and custom typography elements.

{{"demo": "HeadlessAPI.js", "defaultCodeOpen": false}}

## Common examples

### Connection border

Target the `treeItemClasses.groupTransition` class to add connection borders between the Tree View items.

{{"demo": "BorderedTreeView.js", "defaultCodeOpen": false}}

### Gmail clone

:::warning
This example is built using the new `TreeItem2` component
which adds several slots to modify the content of the Tree Item or change its behavior.

You can learn more about this new component in the [Overview page](/x/react-tree-view/#tree-item-components).
:::

Google's Gmail side nav is potentially one of the web's most famous tree view components.
The demo below shows how to replicate it.

The Gmail sidebar is one of the most well known examples of a tree view.
The demo below shows how to recreate it with the Tree View component:

{{"demo": "GmailTreeView.js"}}
