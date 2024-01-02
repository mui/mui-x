---
productId: x-tree-view
title: Tree View React component
components: SimpleTreeView, RichTreeView, TreeItem
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# Tree View

<p class="description">The Tree View component displays a hierarchical list of content where you can expand or collapse each parent or child item.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Introduction

The Tree View component is commonly used to represent a file system navigator displaying folders and files.

<p class="description">A Tree View widget presents a hierarchical list.</p>

Tree views can be used to represent a file system navigator displaying folders and files, an item representing a folder can be expanded to reveal the contents of the folder, which may be files, folders, or both.

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Available components

There are two versions of the Tree View available.

## Basics

```jsx
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
```

### Multi-selection

Use the `multiSelect` prop on the Tree View to enable selecting multiple items at once.

### SimpleTreeView

The `SimpleTreeView` component receives its items as JSX children.
It is designed for simple use-cases where the items are hardcoded.

<!-- {{"demo": "BasicSimpleTreeView.js"}} -->

### Controlled Tree View

The Tree View component can be controlled or uncontrolled.

<!-- {{"demo": "ControlledTreeView.js"}} -->

:::info

- A component is **controlled** when it's managed by its parent using props.
- A component is **uncontrolled** when it's managed by its own local state.

Learn more about controlled and uncontrolled components in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

### Rich object

Use [recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion) to pass your Tree View data as a rich object.

<!-- {{"demo": "RichObjectTreeView.js"}} -->

### Disabled item

Use the `disabled` prop on the Tree Item component to disable interaction and focus:

<!-- {{"demo": "DisabledTreeItems.js"}} -->

#### The disabledItemsFocusable prop

Note that the demo above also includes a switch.
It's toggling the `disabledItemsFocusable` prop, which controls whether or not a disabled Tree Item can be focused.

In case that prop is set to false:

- Navigating with keyboard arrow keys will not focus the disabled items, and the next non-disabled item will be focused instead.
- Typing the first character of a disabled item's label will not move the focus to it.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- <kbd class="key">Shift</kbd> + arrow keys will skip disabled items, and the next non-disabled item will be selected instead.
- Programmatic focus will not focus disabled items.

But, if it's set to true:

- Navigating with keyboard arrow keys will focus disabled items.
- Typing the first character of a disabled item's label will move focus to it.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- <kbd class="key">Shift</kbd> + arrow keys will not skip disabled items, but the disabled item will not be selected.
- Programmatic focus will focus disabled items.

## Customization

### The ContentProps component and useTreeItem hook

```jsx
import {
  TreeItemContentProps,
  TreeItemProps,
  useTreeItem,
} from '@mui/x-tree-view/TreeItem';
```

The MUI X Tree View component also provides the `TreeItemContentProps` and `TreeItemProps` components as well as the `useTreeItem` hook for deeper customization options.
Below are a couple of example demos on how to use them:

#### Limit expansion interaction

The demo below shows how to limit the expansion interaction click area to the arrow icon only.

<!-- {{"demo": "IconExpansionTreeView.js", "defaultCodeOpen": false}} -->

#### Full width background

The demo below builds upon the above to also make the Tree Item background span the full Tree View width.

<!-- {{"demo": "BarTreeView.js", "defaultCodeOpen": false}} -->

### Custom icons, border, and animation

The demo below shows how to use a custom animation for displaying the Tree View items (using [react-sprint](https://www.react-spring.dev/)), as well as adding a custom border and icons.

<!-- {{"demo": "CustomizedTreeView.js"}} -->

## Common examples

### Gmail clone

The Gmail side nav is probably one of the most famous Tree View component in daily use.
The demo below shows how to build a similar version:

<!-- {{"demo": "GmailTreeView.js"}} -->

## Accessibility

The [WAI-ARIA guidelines for the tree views](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) recommend using `aria-labelledby` or `aria-label` to reference or provide a label to the Tree View, otherwise screen readers will announce it just as "tree", making it hard to understand the context of each specific tree item.

## Anatomy

The Tree View component is composed of a root `<ul>` that houses interior elements like the Tree View Item and other optional components (such as the expansion item).

```html
<ul role="tree" class="MuiTreeView-root">
  <li role="treeItem" class="MuiTreeItem-root">
    <div class="MuiTreeItem-content">
      <div class="MuiTreeItem-iconContainer">
        <!-- Expansion icon goes here -->
      </div>
      <div class="MuiTreeItem-label">
        <!-- Tree View Item label goes here -->
      </div>
    </div>
  </li>
</ul>
```

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

:::warning
Most new advanced features won't be available on this component.
If you are waiting for features like editing or virtualization, you should use `RichTreeView` instead.
:::

### RichTreeView

The `RichTreeView` component receives its items through the `items` prop.
It is designed for more advanced use-cases where the items are dynamically loaded from a data source.

<!-- {{"demo": "BasicRichTreeView.js"}} -->
