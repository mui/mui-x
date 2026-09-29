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

## Day cells

Day cells deliberately **don't** take the themed ring—they render identically whether or not you opt in.

A day cell already spends its `outline` on the "today" marker, and `outline` is a single CSS property that can only render one value.
The themed ring wins on specificity, so a focused "today" would lose its marker and become indistinguishable from any other focused day—precisely when a keyboard user most needs to tell them apart.

Rather than trade the marker for the ring, the day cell keeps both of its existing affordances: the "today" outline, and the background tint on focus.
This applies to the range day of the [Date Range Picker](/x/react-date-pickers/date-range-picker/) as well.

## Inset ring

The year button's ring is inset—drawn just inside the button's edge rather than just outside it.

The year list is a scroller with almost no horizontal padding, so arrowing through it parks the focused year flush against the visible edge, where an outset ring would be clipped.
Every other picker surface keeps the outset ring, because nothing clips it.

## The clock

The clock's focus ring is drawn on the wrapper that owns the tab stop, tracing the circular face.

The ring is outset here: in a picker popover there's roughly 16px of room above the clock and 50px to either side, and the popover doesn't clip, so the ring reads better outside the face than cutting across it and crowding the numerals.
