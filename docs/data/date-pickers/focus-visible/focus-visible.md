---
title: Date and Time Pickers - Focus visible
---

# Date and Time Pickers - Focus visible

<p class="description">Theme the keyboard focus ring of the Date and Time Pickers.</p>

Material UI can draw a single, themeable focus ring across every interactive component.
It's opt-in: set `focusVisible` on the theme and the ring appears wherever a component supports it.
See [Focus visible](/material-ui/customization/focus-visible/) for the option itself and the values it accepts.

```tsx
const theme = createTheme({ focusVisible: true });
```

The Pickers participate in that ring. Nothing changes until you opt in.

{{"demo": "FocusVisiblePickers.js", "bg": "inline"}}

:::info
The ring only appears for keyboard users, because it's drawn on `:focus-visible`.
Clicking a button won't show it—use the Tab and arrow keys.
:::

## What the ring covers

| Component                | Ring                                                                     |
| :----------------------- | :----------------------------------------------------------------------- |
| Year button              | Inset, because the year list scrolls—see [Inset ring](#inset-ring) below |
| Month button             | Outset                                                                   |
| Clock                    | Outset, drawn around the circular face                                   |
| Digital Clock item       | Inset, inherited from [`MenuItem`](/material-ui/react-menu/)             |
| Multi Section Clock item | Inset, same as above                                                     |
| Day cell                 | **Opted out**—see [Day cells](#day-cells) below                          |

Where a component previously marked focus with a background tint, the ring replaces that tint rather than stacking on top of it.
Pointer focus is unaffected: clicking doesn't match `:focus-visible`, so it looks exactly as it did before.

## Day cells and the "today" marker

Day cells take the themed ring like everything else, and the "today" marker survives underneath it.

The marker is normally drawn with `outline`, which is the same single CSS property the ring uses, so the two can't both render.
While a day cell is focused, the marker is redrawn as an inset `box-shadow` instead, leaving `outline` free for the ring.
A focused "today" therefore shows both—the ring around the cell, the marker inside it.

Nothing changes if you don't opt in: the marker keeps using `outline`, so an override on the `.MuiPickerDay-today` class still applies as before.

This applies to the range day of the [Date Range Picker](/x/react-date-pickers/date-range-picker/) as well.

## Inset rings

Two surfaces draw the ring just inside their edge rather than just outside it, because an outset ring would be clipped there:

- **The year button.** The year list is a scroller with almost no padding, so arrowing through it parks the focused year flush against the visible edge.
- **The calendar header's view-switch button.** Its label container is `overflow: hidden` and the button sits flush against three of its sides.

Every other picker surface keeps the outset ring, because nothing clips it.

## The clock

The clock's focus ring is drawn on the wrapper that owns the tab stop, tracing the circular face.

The ring is outset here: in a picker popover there's roughly 16px of room above the clock and 50px to either side, and the popover doesn't clip, so the ring reads better outside the face than cutting across it and crowding the numerals.
