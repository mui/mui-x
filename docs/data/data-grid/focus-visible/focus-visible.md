---
title: Data Grid - Focus visible
---

# Data Grid - Focus visible

<p class="description">Theme the keyboard focus ring of the Data Grid.</p>

## Prerequisite

This feature requires Material UI 9.4 or later, and MUI X 9.13 or later.

You enable it once on the Material UI theme, and the Data Grid picks it up—there's nothing to set on the Grid itself:

```tsx
const theme = createTheme({ focusVisible: true });
```

See [Focus visible](/material-ui/customization/focus-visible/) for customization details.

## Usage

Every interactive element in the Data Grid uses the ring: toolbar buttons, menu items, checkboxes, pagination, and the controls inside each panel.
They all match, and they all follow the theme.

Nothing changes until you opt in.

{{"demo": "FocusVisibleDataGrid.js", "bg": "inline"}}

:::info
The ring is for keyboard users. Clicking won't show it—press <kbd class="key">Tab</kbd>.
:::

:::warning
**Cells and column headers are the exception.** They keep their own focus ring, which `theme.focusVisible` doesn't change.
That ring marks the cell you're on, and it has to stay visible after a click as well as after keyboard navigation, so it follows a different rule.

To restyle it, override this CSS variable on the Grid root:

```css
--DataGrid-t-color-interactive-focus
```

See [Styling](/x/react-data-grid/style/) for where to put it.
:::
