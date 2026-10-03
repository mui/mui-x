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

See Material UI's [focus visible](/material-ui/customization/focus-visible/) page for customization details.

## Usage

Every interactive element in the Data Grid uses the ring: toolbar buttons, menu items, checkboxes, pagination, and the controls inside each panel.

Nothing changes until you opt in.
Tab through the demo below to see the focus indicator.

{{"demo": "FocusVisibleDataGrid.js", "bg": "inline"}}

:::warning
**Cells and column headers are the exception.** They keep their own focus ring, which `theme.focusVisible` doesn't change.
That ring marks the cell you're on, and it has to stay visible after a click as well as after keyboard navigation, so it follows a different rule.
:::
