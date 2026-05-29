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
- A mobile layout for the event dialog.
- Header responsiveness (toolbar, view switcher, side panel).
- The public opt-in API. The variant is only availabble as a standalone view for now; the final DX is not decided.
- [WIP] Touch / drag interactions on mobile. The current handles work but are not tuned for touch.

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

`CompactDayTimeGrid` reuses `DayTimeGrid` and swaps the event card through an **internal-only** React context (`DayTimeGridInternalRenderersContext`). The desktop renderer is always used as a default; sibling views can override it by wrapping `DayTimeGrid` in the provider:

```tsx
<DayTimeGridInternalRenderersContext.Provider value={{ timeGridEvent: TimeGridEventMobile }}>
  <DayTimeGrid ref={forwardedRef} days={days} {...other} />
</DayTimeGridInternalRenderersContext.Provider>
```

The context lives next to `DayTimeGrid` and is not exported from the package. `DayTimeGrid`'s public props stay unchanged — no `slots` (or any other override) prop appears in the types, so consumers can't reach it.

This mirrors how the event dialog already injects the recurrence tab from premium via `EventDialogOptionalRenderersContext`. The semantics are slightly different though: here the desktop renderer is always there as a default and the context only overrides it (hence "Internal" rather than "Optional" — community already has a renderer, premium would only swap it).

Why a context over a prop:

- Keeps the `slots` name free on `DayTimeGrid` for a future public slots API. Zero migration when that lands.
- `DayTimeGrid`'s public surface stays unchanged. No `@internal` prop in the types.
- Codebase precedent — same pattern as the event dialog renderers.
- Tests are unaffected: `DayTimeGrid` doesn't need to know the mobile path exists; only `CompactDayTimeGrid` wires the provider.

Alternatives considered:

- A `variant: 'comfortable' | 'compact'` prop on `DayTimeGrid` — change styling based on a prop. Makes things harder to maintain and custom logic will make the file even longer and harder to read.
- A separate `CompactDayTimeGrid` that does not go through `DayTimeGrid` — most decoupled, but duplicates the grid/scroll/header code that's the whole point of sharing. A lot of duplication, almost everything in the current `DayTimeGrid` is reused by the mobile.
- An `@internal` `slots` prop on `DayTimeGrid` — simpler, but the `@internal` tag is intent, not enforcement, and `slots` is the canonical public customization name across MUI X, which would block (or force a migration of) any future real public slots API on `DayTimeGrid`.
- Composition (a `<DayTimeGrid.Event>` subcomponent the consumer picks)
- `children` as the event renderer
