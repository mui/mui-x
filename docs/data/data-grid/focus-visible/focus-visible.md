---
title: Data Grid - Focus visible
---

# Data Grid - Focus visible

<p class="description">Customize the focus ring that shows when users navigate the Data Grid with a keyboard.</p>

## Prerequisite

This feature requires Material UI 9.4 or later, and MUI X 9.13 or later.

Turn it on in the Material UI theme.
The Data Grid uses it automatically, so you don't need to set any prop on the Grid:

```tsx
const theme = createTheme({ focusVisible: true });
```

See Material UI's [Focus visible](/material-ui/customization/focus-visible/) page for more details.

## Usage

When `focusVisible` is enabled, these elements show the focus ring: toolbar buttons, menu items, checkboxes, pagination controls, and the controls inside panels.

:::info
The focus ring only shows when you use the keyboard. Clicking doesn't show it.

The demos on this page turn off the ripple effect, so you only see the focus ring.
:::

Press <kbd class="key">Tab</kbd> to move through the demo below.

{{"demo": "FocusVisibleDataGrid.js", "bg": "inline"}}

:::warning
Cells and column headers keep their own focus style, and `theme.focusVisible` doesn't change it.
This is because the Grid marks the active cell after a click too, not only after keyboard navigation.
:::
