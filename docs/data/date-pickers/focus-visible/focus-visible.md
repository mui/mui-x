---
title: Date and Time Pickers - Focus visible
---

# Date and Time Pickers - Focus visible

<p class="description">Customize the focus ring that shows when users navigate the Date and Time Pickers with a keyboard.</p>

## Prerequisite

This feature requires Material UI 9.6 or later, and MUI X 9.19 or later.

Turn it on in the Material UI theme.
The Pickers use it automatically, so you don't need to set any prop on the picker:

```tsx
const theme = createTheme({ focusVisible: true });
```

See Material UI's [Focus visible](/material-ui/customization/focus-visible/) page for more details.

## Usage

When `focusVisible` is enabled, these elements show the focus ring: day cells, month and year buttons, clocks and their items, the buttons in the calendar header, shortcuts, and the toolbar buttons and tabs of the range pickers.

The fields follow the Material UI inputs.
A standard or filled field shows the focus ring when its underline is turned off with `disableUnderline`.
An outlined field, or a field that keeps its underline, uses the border or the underline to show focus instead.

:::info
The focus ring only shows when you use the keyboard.
Clicking doesn't show it.

The demos on this page turn off the ripple effect, so you only see the focus ring.
:::

Press <kbd class="key">Tab</kbd> to move into the demo below, then use the arrow keys to move between items.
To reach the year list, open the month dropdown in the calendar header.

{{"demo": "FocusVisiblePickers.js", "bg": "inline"}}

## Style changes

When `focusVisible` is enabled, the Pickers change how days, months, years, and clock items show focus:

- The focus ring replaces the background color that these elements show on focus.
- A selected item with focus shows a band in the contrast color between its fill and the focus ring, so the ring stays visible next to the fill.
- While today's date has focus, it draws its circle with `box-shadow` instead of `outline`, so you see both the circle and the focus ring.

:::warning
A style override that sets the `outline` of the `today` class also replaces the focus ring while today's date has focus.
To keep the focus ring, add `:not(.Mui-focusVisible)` to the selector of the override.
:::

## Custom focus ring

The Pickers use the focus ring that you set in `theme.focusVisible`.
Days, month and year buttons, clock items, and the buttons in the calendar header and the toolbar use the [inner focus indicator](/material-ui/customization/focus-visible/#customizing-the-inner-focus-indicator), so `insetOverrides` applies to them.

The demo below uses a two-color focus ring: an outline, with a band in the paper color between the outline and the element.

{{"demo": "FocusVisibleRingPickers.js", "bg": "inline"}}
