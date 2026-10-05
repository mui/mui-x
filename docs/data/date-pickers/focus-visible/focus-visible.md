---
title: Date and Time Pickers - Focus visible
---

# Date and Time Pickers - Focus visible

<p class="description">Customize the focus ring that shows when users navigate the Date and Time Pickers with a keyboard.</p>

## Prerequisite

This feature requires Material UI 9.4 or later, and MUI X 9.13 or later.

Turn it on in the Material UI theme.
The Pickers use it automatically, so you don't need to set any prop on the picker:

```tsx
const theme = createTheme({ focusVisible: true });
```

See Material UI's [Focus visible](/material-ui/customization/focus-visible/) page to customize the ring.

## Usage

When `focusVisible` is enabled, these elements show the focus ring: day cells, month and year buttons, clocks, and the buttons in the calendar header.

:::info
The focus ring only shows when you use the keyboard. Clicking doesn't show it.

The demos on this page turn off the ripple effect, so you only see the focus ring.
:::

Press <kbd class="key">Tab</kbd> to move into the demo below, then use the arrow keys to move between items.
To reach the year list, open the month dropdown in the calendar header.

{{"demo": "FocusVisiblePickers.js", "bg": "inline"}}

:::warning
Today's date is marked with a circle drawn with the CSS `outline` property.
The focus ring also uses `outline`, and an element can only have one.

So when today's date has focus, the circle is drawn with `box-shadow` instead, and you see both the ring and the circle.

This only happens when the focus ring is turned on.
Otherwise, today's date still uses `outline`, so your existing styles on the `today` class keep working.
:::
