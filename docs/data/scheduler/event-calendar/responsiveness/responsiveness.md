---
productId: x-scheduler
title: React Scheduler component - Responsiveness
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: StandaloneWeekView
---

# Event Calendar - Responsiveness 🧪

<p class="description">How the Event Calendar adapts its typography to narrow widths.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

:::warning
This is a POC. APIs may change before release.
:::

## Scope of this PR

This PR covers three things:

- Dedicated touch-optimized views for narrow widths: `CompactDayView`, `CompactThreeDayView` and `CompactWeekView` (1-, 3- and 7-day), all sharing the same compact day/time grid.
- A responsive typography layer for the existing desktop views (container queries - can be later extended for more responsiveness optimization on all other views).
- A split of the time-grid event into two variants (desktop and touch) + extracted shared logic & styling.

What is **NOT** covered yet:

- Mobile-friendly versions of the other views (month, agenda, day).
- Real event editing on mobile. The editing drawer (see [Touch interactions](#touch-interactions)) is a mock that validates the gesture only — it does not edit the event yet.
- Header responsiveness (toolbar, view switcher, side panel).
- The public opt-in API. The compact views are only available as standalone views for now; the final DX is not decided.

## Why separate touch views + responsive desktop

The desktop `WeekView` is built for wide screens. On a phone it doesn't fit, even after shrinking. Some things just don't translate: drag-to-create (not available yet) needs the right padding, event cards show start/end time, hover, etc.

2 directions:

1. Make the existing views adapt down to ~400px. CSS only, container queries, no JavaScript. Not a perfect solution, but no broken views on smaller screens.
2. Ship dedicated touch-optimized views for the best mobile experience.

The compact views are **opt-in**. We do not auto-switch on viewport width. The final opt-in API (prop, hook, view registry) is still TBD.

{{"demo": "CompactWeekView.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
The compact day count is split across three separate views (`CompactDayView`, `CompactThreeDayView`, `CompactWeekView`) rather than a single `dayCount` prop. The demo above switches between them. The final opt-in story is still TBD.
:::

## Responsive typography

The views read their font sizes and a few key dimensions from CSS custom properties. A wrapper around the view sets `container-type: inline-size` and a container name. Container queries inside the calendar retarget the variables at narrower widths, so the typography scales down without any JavaScript or viewport detection.

### Tokens

Each token is declared in two layers:

- **Tier vars** (`-sm`, `-md`, `-lg`) hold the per-tier value.
- **Effective vars** (no suffix) are what styled components read. They default to `lg` and switch to `md` or `sm` at narrower widths.

Current tokens:

| Token                                      | Used by                                                 |
| :----------------------------------------- | :------------------------------------------------------ |
| `--EventCalendar-fontSize-eventTitle`      | Event title on every event card                         |
| `--EventCalendar-fontSize-dayNumber`       | Day-number circle in the week/day views                 |
| `--EventCalendar-fontSize-agendaDayNumber` | Day-number cell in the agenda view                      |
| `--EventCalendar-fontSize-timeText`        | Time axis, time on event cards, "all day" label         |
| `--EventCalendar-size-fixedCellWidth`      | Width of the fixed left column hosting time-axis labels |

Current breakpoints:

- `width < 550px` → `sm`
- `550px <= width < 800px` → `md`
- `width >= 800px` → `lg` (default)

### Customizing as a consumer

Override a single tier through the theme. No need to copy the `@container` blocks:

```tsx
const theme = createTheme({
  components: {
    MuiEventCalendar: {
      styleOverrides: {
        ResponsiveTypographyContainer: {
          '--EventCalendar-fontSize-eventTitle-sm': '0.7rem',
          '--EventCalendar-fontSize-dayNumber-sm': '1.1rem',
        },
      },
    },
  },
});
```

Overriding the effective var directly is also valid. It disables the tier switching for that token.

### Demo

The demo below renders `StandaloneWeekView` with `width: 100%` and a `max-width` toggle. Switching `sm` / `md` / `lg` crosses the container-query breakpoints. Typography and the fixed-column width adapt.

{{"demo": "ResponsiveTypographyDemo.js", "bg": "inline", "defaultCodeOpen": false}}

## TimeGridEvent vs. TimeGridEventTouch

The event card on the time grid is now split in two variants:

- **`TimeGridEvent`** — desktop. Title + start/end time. Right padding for drag-to-create. Resize handles shown on hover.
- **`TimeGridEventTouch`** — touch. Title only (wraps, then ellipsizes). No right padding. Resize handles and a selection outline appear only when the event is armed.

Both variants share `useTimeGridEvent` (data attributes, position vars, draggable/resizable flags) and shared styles in [TimeGridEventShared.tsx](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/internals/components/event/time-grid-event/TimeGridEventShared.tsx). The rest of the rendering is handled individually.

### How the variant is plugged in today

The compact views share a single internal `CompactDayTimeGrid` layout that reuses `DayTimeGrid` and swaps the event card through an **internal-only** React context (`DayTimeGridInternalRenderersContext`) rather than a public slot:

```tsx
<DayTimeGridInternalRenderersContext.Provider
  value={{ timeGridEvent: TimeGridEventTouch }}
>
  <DayTimeGrid ref={forwardedRef} days={days} {...other} />
</DayTimeGridInternalRenderersContext.Provider>
```

The context is internal. It is **not** part of the public API. Only sibling views inside `@mui/x-scheduler` can use it.

This part is **up for debate**:

- The context keeps the shared `CompactDayTimeGrid` layout thin and keeps both variants behind the same `DayTimeGrid`. Adding more renderers later is one line, with no extra props on the public surface.
- Alternatives considered:
  - A `slots={{ timeGridEvent }}` prop on `DayTimeGrid` — explicit, but adds an awkward `slots` prop that depends on whether we want a public `event` slot later.
  - A `variant: 'comfortable' | 'compact'` prop on `DayTimeGrid` — change styling based on a prop. Makes things harder to maintain and custom logic will make the file even longer and harder to read.
  - A separate compact grid that does not go through `DayTimeGrid` — most decoupled, but duplicates the grid/scroll/header code that's the whole point of sharing.
  - Composition (a `<DayTimeGrid.Event>` subcomponent the consumer picks)
  - `children` as the event renderer

## Touch interactions

On the compact grid, touch gestures are deliberately split so they don't fight each other:

- **Single tap** on an event _arms_ it: the resize handles and a selection outline appear, and the editing drawer opens below the grid. There is no custom long-press anymore — it used to conflict with the browser's native drag.
- **Drag to move** is the browser's native drag: press, hold, and drag the event card. This is unchanged.
- **Resize** by dragging the round handles on the top/bottom edges of an armed event (pointer-based, with autoscroll near the grid edges). The drawer stays open while you resize.
- **The drawer** sits _below_ the grid rather than overlaying it: while open it shrinks the grid to make room. Tapping the drawer expands it to full height.
- **Tapping anywhere on the grid** while editing (the empty grid _or_ another event) exits editing and disarms the resize — it does **not** create or arm anything. Only the _next_ tap, with the drawer closed, creates a new event or arms the tapped one.
- **Creating an event** (a tap on the empty grid with nothing armed) drops a placeholder that already carries resize handles, so the new event's duration can be dragged out before it's saved.

Arming is driven by a dedicated `CompactEventDrawer` context (its own `createModal` instance, separate from the event dialog and the store's editing state): a tap opens the drawer for that occurrence, and the drawer and the resize handles both read it.

:::warning
The editing drawer is a **mock** to validate the touch interaction only. It shows a placeholder label (`This is editable` / `This is non editable`) and does **not** edit the event. Wiring the drawer to real event editing is intentionally out of scope and will be handled in a follow-up.
:::
