---
productId: x-tree-view
title: Rich Tree View - Customization
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Customization

<p class="description">Learn how to customize the rich version of the Tree View component.</p>

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

### Adding custom content

Use the `ContentComponent` prop and the `useTreeItemState` hook to replace the Tree Item content with an entirely custom component.
The demo below shows how to add an avatar and custom typography elements.

{{"demo": "CustomContentTreeView.js"}}

## Common examples

### Limit expansion to icon container

The demo below shows how to trigger the expansion interaction just by clicking on the icon container instead of the whole Tree Item surface.

{{"demo": "IconExpansionTreeView.js", "defaultCodeOpen": false}}
