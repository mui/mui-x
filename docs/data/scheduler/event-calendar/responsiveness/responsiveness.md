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
