---
productId: x-scheduler
title: React Scheduler component - Responsiveness
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: StandaloneWeekView, StandaloneCompactDayTimeGrid
---

# Event Calendar - Responsiveness 🧪

<p class="description">How the Event Calendar adapts to narrow widths.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

:::warning
This is a POC. APIs may change before release.
:::

## Scope of this PR

This PR covers three things:

- A dedicated mobile day/time grid (`CompactDayTimeGrid`) - future dedicated 1-3-7 day views for mobile, keeping them together while during the initial discussions for simpicity.
- A responsive typography layer for the existing desktop views (container queries - can be later extended for more responsiveness optimization on all othher views).
- A split of the time-grid event into two variants (desktop and mobile) + extracted shared logic & styling.

What is **NOT** covered yet:

- Mobile-friendly versions of the other views (month, agenda, day).
- Real event editing on mobile. The editing drawer (see [Touch interactions](#touch-interactions)) is a mock that validates the gesture only — it does not edit the event yet.
- Header responsiveness (toolbar, view switcher, side panel).
- The public opt-in API. The variant is only availabble as a standalone view for now; the final DX is not decided.

## Why a separate mobile view + responsive desktop

The desktop `WeekView` is built for wide screens. On a phone it doesn't fit, even after shrinking. Some things just don't translate: drag-to-create (not available yet) needs the right padding, event cards show start/end time, hover, etc.

2 directions:

1. Make the existing views adapt down to ~400px. CSS only, container queries, no JavaScript. Not a aperfect solution, but no broken views on smaller screens.
2. Ship a dedicated mobile day/time grid for the best mobile experience.

The mobile view is **opt-in**. We do not auto-switch on viewport width. The final opt-in API (prop, hook, view registry) is still TBD.

{{"demo": "CompactWeekView.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
`CompactDayTimeGrid` accepts a `dayCount` prop (`1`, `3`, or `7`). This is temporary — it's the simplest way to demo a mobile-friendly day count without designing the final API. Once the opt-in story is settled, this prop will likely go away.
:::

## Responsive typography

The desktop views now read their font sizes and a few key dimensions from CSS custom properties. A wrapper around the view sets `container-type: inline-size` and a container name. Container queries inside the calendar retarget the variables at narrower widths.

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

## TimeGridEvent vs. TimeGridEventMobile

The event card on the time grid is now split in two variants:

- **`TimeGridEvent`** — desktop. Title + start/end time. Right padding for drag-to-create. Resize handles shown on hover.
- **`TimeGridEventMobile`** — mobile. Title only (wraps, then ellipsizes). No right padding.

Both variants share `useTimeGridEvent` (data attributes, position vars, draggable/resizable flags) and shared styles in [TimeGridEventShared.tsx](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/internals/components/event/time-grid-event/TimeGridEventShared.tsx). The rest of the rendering is handled individually.

### How the variant is plugged in today

`CompactDayTimeGrid` reuses `DayTimeGrid` and swaps the event card through an **internal-only** slot:

```tsx
<DayTimeGrid
  ref={forwardedRef}
  days={days}
  slots={{ timeGridEvent: TimeGridEventMobile }}
  {...other}
/>
```

The `slots` prop is marked `@internal`. It is **not** part of the public API. Only sibling views inside `@mui/x-scheduler` can use it.

This part is **up for debate**:

- The current shape keeps `CompactDayTimeGrid` thin (~10 lines) and keeps both variants behind the same component. Adding more variants later is one line.
- The downside: `slots` prop is awkward - depends a lot on whether we want to allow for a public `event` slot later.
- Alternatives considered:
  - A `variant: 'comfortable' | 'compact'` prop on `DayTimeGrid` — change styling based on a prop. Makes things harder to maintain and custom logic will make the file even longer and harder to read.
  - A separate `CompactDayTimeGrid` that does not go through `DayTimeGrid` — most decoupled, but duplicates the grid/scroll/header code that's the whole point of sharing. A lot of duplication, almost everything in the current `DayTimeGrid` is resued by the mobile.
  - A React context that tells `DayTimeGrid` which event component to render
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
