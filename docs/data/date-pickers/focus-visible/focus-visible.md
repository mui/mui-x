---
title: Date and Time Pickers - Focus visible
---

# Date and Time Pickers - Focus visible

<p class="description">Theme the keyboard focus ring of the Date and Time Pickers.</p>

## Prerequisite

This feature requires Material UI 9.4 or later, and MUI X 9.13 or later.

You enable it once on the Material UI theme, and the Pickers pick it up—there's nothing to set on the picker itself:

```tsx
const theme = createTheme({ focusVisible: true });
```

See [Focus visible](/material-ui/customization/focus-visible/) for customization details.

## Usage

Every interactive element in the Pickers uses the ring: day cells, year and month buttons, the clocks, and the calendar header controls.
They all match, and they all follow the theme.

Nothing changes until you opt in.
Tab into the demo below, then use the arrow keys to see the focus indicator.
Open the month dropdown in the calendar header to reach the year list.

{{"demo": "FocusVisiblePickers.js", "bg": "inline"}}

:::info
The ring is for keyboard users. Clicking won't show it—press <kbd class="key">Tab</kbd>.

The demos on this page opt out of the ripple to show only the focus visible indicator.
:::

:::warning
**The "today" marker gets out of the way.** It's normally drawn with `outline`, the same single CSS property the ring uses, so the two can't both render.

While a day is focused, the marker is drawn as an inset `box-shadow` instead. A focused "today" shows both: the ring around the cell, the marker inside it.

This only happens when you opt in. Otherwise the marker keeps using `outline`, so an override on the `.MuiPickerDay-today` class still applies as before.
:::
