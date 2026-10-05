---
title: Tree View - Focus visible
---

# Tree View - Focus visible

<p class="description">Customize the focus ring that shows when users navigate the Tree View with a keyboard.</p>

## Prerequisite

This feature requires Material UI 9.4 or later, and MUI X 9.13 or later.

Turn it on in the Material UI theme.
The Tree View uses it automatically, so you don't need to set any prop on the tree:

```tsx
const theme = createTheme({ focusVisible: true });
```

See Material UI's [Focus visible](/material-ui/customization/focus-visible/) page to customize the ring.

## Usage

When `focusVisible` is enabled, these elements show the focus ring: items, checkboxes, and the input used to rename an item when [label editing](/x/react-tree-view/rich-tree-view/editing/) is enabled.

The focus ring replaces the gray background that normally marks the focused item.
Selected items keep their selected background.

:::info
The focus ring only shows when you use the keyboard. Clicking doesn't show it.

The demos on this page turn off the ripple effect, so you only see the focus ring.
:::

Press <kbd class="key">Tab</kbd> to move into the demo below, then use the arrow keys to move between items.
Press <kbd class="key">Enter</kbd> on an item to rename it.

{{"demo": "FocusVisibleTreeView.js", "bg": "inline"}}
