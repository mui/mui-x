---
title: Data Grid - Focus visible
---

# Data Grid - Focus visible

<p class="description">Theme the keyboard focus ring of the Data Grid.</p>

Material UI can draw a single, themeable focus ring across every interactive component.
It's opt-in: set `focusVisible` on the theme and the ring appears wherever a component supports it.
See [Focus visible](/material-ui/customization/focus-visible/) for the option itself and the values it accepts.

```tsx
const theme = createTheme({ focusVisible: true });
```

In the Data Grid the ring applies to the **panel controls**. Nothing changes until you opt in.

{{"demo": "FocusVisibleDataGrid.js", "bg": "inline"}}

:::info
The ring only appears for keyboard users, because it's drawn on `:focus-visible`.
Clicking a control won't show it—Tab into the panel instead.
:::

## What the ring covers

These controls aren't built on [`ButtonBase`](/material-ui/api/button-base/), so they take the themed ring directly:

| Control               | Where                                             |
| :-------------------- | :------------------------------------------------ |
| Section header        | Pivot panel, above Rows / Columns / Values        |
| Chart selector        | Charts panel, when more than one chart exists     |
| Chart type tile       | Charts panel, under the Chart tab                 |
| Prompt changes toggle | AI Assistant panel, on a prompt that made changes |

Two of these previously borrowed their hover affordance to signal focus—a background tint in one case, an underline in the other—so keyboard focus looked identical to hover.
With the ring enabled, the ring becomes the indicator and the borrowed affordance is dropped, so the two don't stack. Hover itself is unchanged.

:::info
These controls are part of [Data Grid Premium](/x/introduction/licensing/#premium-plan).
:::

## Cells and column headers

The cell and column header focus ring is **not** affected by `theme.focusVisible`. It's themed through the Grid's own CSS variable instead:

```css
--DataGrid-t-color-interactive-focus
```

The reason is that the Grid follows the [ARIA grid pattern](/x/react-data-grid/accessibility/): a roving tabindex moves a cell cursor, and that cursor has to be visible after a mouse click as well as after keyboard navigation.
So the cell ring is drawn on `:focus` rather than `:focus-visible`, which is a different condition from the one `theme.focusVisible` describes.

Its geometry is deliberate too: the ring is inset, because cells sit flush against each other and an outset ring would overlap its neighbors and be clipped by the virtualized scroller.

:::success
To restyle the cell cursor, override the CSS variable on the Grid root—see [Styling](/x/react-data-grid/style/).
:::
