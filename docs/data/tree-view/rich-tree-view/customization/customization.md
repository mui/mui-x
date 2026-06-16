---
productId: x-tree-view
components: RichTreeView, RichTreeViewPro, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Customization

<p class="description">Learn how to customize the Rich Tree View component.</p>

:::success
See [Common concepts—Slots and subcomponents](/x/common-concepts/custom-components/) to learn how to use slots.
:::

## Basics

### Custom icons

Use the `collapseIcon` slot, the `expandIcon` slot and the `defaultEndIcon` prop to customize `RichTreeView` icons.
The demo below shows how to add icons using both an existing icon library, such as [Material Icons](/material-ui/material-icons/), and creating an icon from scratch using Material UI's [`SvgIcon`](/material-ui/icons/#svgicon).

{{"demo": "CustomIcons.js", "defaultCodeOpen": false}}

### Custom toggle animations

Use the `groupTransition` slot on `TreeItem` to pass a component that handles your animation.

The demo below is animated using Material UI's [`Collapse`](/material-ui/transitions/#collapse) component together with the [react-spring](https://www.react-spring.dev/) library.

:::info
`RichTreeViewPro` uses a flat DOM structure by default.
To use animations that rely on the nested `groupTransition` slot, disable virtualization and set `domStructure="nested"`:

```tsx
<RichTreeViewPro items={ITEMS} disableVirtualization domStructure="nested" />
```

:::

{{"demo": "CustomAnimation.js", "defaultCodeOpen": false}}

### Custom styling

Use `treeItemClasses` to target internal elements of a `TreeItem` and change its styles.
The DOM structure affects which styling patterns are available: nested DOM lets you style child groups from their parent item, while flat DOM renders every visible item as a sibling.

{{"demo": "CustomStyling.js"}}

`RichTreeViewPro` defaults to flat DOM, so use `domStructure="nested"` with virtualization disabled for nested-DOM styling patterns, or adapt the styles to the flat DOM structure.

{{"demo": "CustomStylingRichTreeViewPro.js", "defaultCodeOpen": false}}

### Custom Tree Item

You can use the `TreeItem` customization API to build new layouts and manage behaviors.

See [Tree Item customization](/x/react-tree-view/tree-item-customization/) to learn more about the anatomy of `TreeItem` and the customization utilities provided.

### Headless API

Use the `useTreeItem()` hook to create your ownn fully custom component.
The demo below shows how to add an avatar and custom typography elements.

{{"demo": "HeadlessAPI.js", "defaultCodeOpen": false}}

## Common examples

### File explorer

The file explorer demo below leverages many of the customization options described above to make `RichTreeView` look significantly different than its default design:

{{"demo": "FileExplorer.js", "defaultCodeOpen": false}}
