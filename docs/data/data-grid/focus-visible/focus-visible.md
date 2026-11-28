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

:::info
The focus ring only shows when you use the keyboard.
Clicking doesn't show it.

The demos on this page turn off the ripple effect, so you only see the focus ring.
:::

Press <kbd class="key">Tab</kbd> to move through the demo below.

{{"demo": "FocusVisibleDataGrid.js", "bg": "inline"}}

## Style changes

When `focusVisible` is enabled, the Data Grid changes how cells and column headers show focus:

- The focus ring replaces the thin outline of the focused cell or column header.
- Cells and column headers draw the focus ring inside their edges, so neighboring cells don't cover it.
- A checkbox or a button inside a cell draws its own focus ring, and the cell doesn't draw one.
- The cell being edited draws the focus ring, and its input doesn't, because the cell would cut off the ring of the input.

:::info
A click on a cell keeps the thin outline, so you can still see which cell is active.
The focus ring replaces it when you move with the keyboard.

In Firefox, the arrow keys keep the thin outline after a click on a cell.
Press <kbd class="key">Tab</kbd> to move into the Grid to see the focus ring.
:::

:::warning
The Data Grid draws the focus ring of cells and column headers on their `::before` pseudo-element.
A style override that sets the `outline` of a cell doesn't change the focus ring.
Change the focus ring with `theme.focusVisible` instead.
:::

## Custom focus ring

The Data Grid uses the focus ring that you set in `theme.focusVisible`.
Cells, column headers, and the cell being edited use the [inner focus indicator](/material-ui/customization/focus-visible/#customizing-the-inner-focus-indicator), so `insetOverrides` applies to them.

The demo below uses a two-color focus ring: an outline, with a band in the paper color between the outline and the element.

{{"demo": "FocusVisibleRingDataGrid.js", "bg": "inline"}}
