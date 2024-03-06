---
productId: x-tree-view
title: Simple Tree View - Customization
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Customization

<p class="description">Learn how to customize the simple version of the Tree View component.</p>

## Basics

### Custom icons

Use the `collapseIcon` slot, the `expandIcon` slot and the `defaultEndIcon` prop to customize the Tree View icons.
The demo below shows how to add icons using both an existing icon library, such as [Material Icons](/material-ui/material-icons/), and creating an icon from scratch using Material UI's [SVG Icon component](/material-ui/icons/#svgicon).

{{"demo": "CustomIcons.js", "defaultCodeOpen": false}}

### Custom toggle animations

Use the `TransitionComponent` prop on the `TreeItem` to pass a component that handles your animation.

The demo below is animated using Material UI's [Collapse](/material-ui/transitions/#collapse) component together with the [react-spring](https://www.react-spring.dev/) library.

{{"demo": "CustomAnimation.js", "defaultCodeOpen": false}}

### Custom styling

Use `treeItemClasses` to target internal elements of the Tree Item component and change their styles.

{{"demo": "CustomStyling.js"}}

### Adding custom content

Use the `ContentComponent` prop and the `useTreeItemState` hook to replace the Tree Item content with an entirely custom component.
The demo below shows how to add an avatar and custom typography elements.

{{"demo": "CustomContentTreeView.js"}}

## Common examples

### Connection border

Target the `treeItemClasses.groupTransition` class to add connection borders between the Tree View items.

{{"demo": "BorderedTreeView.js", "defaultCodeOpen": false}}

### Limit expansion to icon container

The demo below shows how to trigger the expansion interaction just by clicking on the icon container instead of the whole Tree Item surface.

{{"demo": "IconExpansionTreeView.js", "defaultCodeOpen": false}}

### File explorer

The demo below shows many of the previous customization examples brought together to make the Tree View component look completely different than its default design.

{{"demo": "CustomizedTreeView.js"}}

### Gmail clone

Google's Gmail side nav is potentially one of the web's most famous tree view components.
The demo below shows how to replicate it.

The Gmail sidebar is one of the most well known examples of a tree view.
The demo below shows how to recreate it with the Tree View component:

{{"demo": "GmailTreeView.js"}}
