---
title: Data Grid - Focus visible
---

# Data Grid - Focus visible

<p class="description">Customize the focus ring that shows when users navigate the Data Grid with a keyboard.</p>

## Prerequisite

This feature requires Material UI 9.6 or later, and MUI X 9.19 or later.

Turn it on in the Material UI theme.
The Data Grid uses it automatically, so you don't need to set any prop on the Grid:

```tsx
const theme = createTheme({ focusVisible: true });
```

See Material UI's [Focus visible](/material-ui/customization/focus-visible/) page for more details.

## Usage

When `focusVisible` is enabled, these elements show the focus ring: cells, column headers, the cell being edited, toolbar buttons, menu items, checkboxes, pagination controls, and the controls inside panels.
Cells and column headers draw the ring inside their edges, so neighboring cells don't cover it.

:::info
The focus ring only shows when you use the keyboard. Clicking doesn't show it.

The demos on this page turn off the ripple effect, so you only see the focus ring.
:::

Press <kbd class="key">Tab</kbd> to move through the demo below.

{{"demo": "FocusVisibleDataGrid.js", "bg": "inline"}}

:::info
A click on a cell keeps the Grid's thin outline, so you can still see which cell is active.
The focus ring replaces it when you move with the keyboard.

In Firefox, the arrow keys keep the thin outline after a click on a cell.
Press <kbd class="key">Tab</kbd> to move into the Grid to see the focus ring.
:::
