import type { CSSObject } from '@mui/material/styles';

export const EVENT_CALENDAR_CONTAINER_NAME = 'mui-event-calendar-content';

// Each token is declared in two layers:
// 1. Three tier vars (`-sm`, `-md`, `-lg`) hold the per-tier font sizes.
//    They are declared unconditionally on ResponsiveTypographyContainer.
//    Consumers can override a single tier via
//    theme.components.MuiEventCalendar.styleOverrides without copying the
//    @container blocks below.
// 2. An unsuffixed effective var (e.g. `--EventCalendar-fontSize-eventTitle`)
//    is what styled slots reference. It defaults to the lg tier and is
//    retargeted at narrower widths by the @container queries below.
export const responsiveTypographyTokens: CSSObject = {
  // Event title — DayGridEventTitle, TimeGridEventTitle, EventItemTitle.
  '--EventCalendar-fontSize-eventTitle-sm': '0.6rem',
  '--EventCalendar-fontSize-eventTitle-md': '0.7rem',
  '--EventCalendar-fontSize-eventTitle-lg': '0.75rem',

  // Day-number circle in the week/day views — DayTimeGridHeaderDayNumber.
  '--EventCalendar-fontSize-dayNumber-sm': '1rem',
  '--EventCalendar-fontSize-dayNumber-md': '1.2rem',
  '--EventCalendar-fontSize-dayNumber-lg': '1.5rem',

  // Day-number cell in the agenda view — AgendaView DayNumberCell.
  '--EventCalendar-fontSize-agendaDayNumber-sm': '1rem',
  '--EventCalendar-fontSize-agendaDayNumber-md': '1.2rem',
  '--EventCalendar-fontSize-agendaDayNumber-lg': '1.5rem',

  // Time labels — DayTimeGridTimeAxisText (time-axis ticks on the
  // week/day views), TimeGridEventTime (time on event cards in the
  // time-grid), and DayTimeGridAllDayEventsHeaderCell (the "all day"
  // label above the time axis).
  '--EventCalendar-fontSize-timeText-sm': '0.6rem',
  '--EventCalendar-fontSize-timeText-md': '0.7rem',
  '--EventCalendar-fontSize-timeText-lg': '0.75rem',

  // Effective vars. Slots reference these; they default to the lg tier and
  // are retargeted by the @container rules in
  // `responsiveTypographyContainerQueries` at narrower widths.
  '--EventCalendar-fontSize-eventTitle': 'var(--EventCalendar-fontSize-eventTitle-lg)',
  '--EventCalendar-fontSize-dayNumber': 'var(--EventCalendar-fontSize-dayNumber-lg)',
  '--EventCalendar-fontSize-agendaDayNumber': 'var(--EventCalendar-fontSize-agendaDayNumber-lg)',
  '--EventCalendar-fontSize-timeText': 'var(--EventCalendar-fontSize-timeText-lg)',
};

export const responsiveTokens: CSSObject = {
  // Width of the fixed left column in the week/day views — hosts the
  // all-day label cell (DayTimeGridAllDayEventsHeaderCell) at the top and
  // the time-axis labels (DayTimeGridTimeAxisText) below. Consumed by
  // DayTimeGridContainer via its local `--fixed-cell-width` var.
  '--EventCalendar-size-fixedCellWidth': '68px',
  // Typography tokens
  ...responsiveTypographyTokens,
};

// Inert unless an ancestor declares container-type=inline-size and the
// matching container-name. EventCalendarContent provides that ancestor for
// the full calendar; for standalone views the consumer can opt in by
// wrapping the view in an element with the same container-name.
export const responsiveTypographyContainerQueries: CSSObject = {
  [`@container ${EVENT_CALENDAR_CONTAINER_NAME} (width < 550px)`]: {
    // fixed cell width
    '--EventCalendar-size-fixedCellWidth': '54px',
    // Typography
    '--EventCalendar-fontSize-eventTitle': 'var(--EventCalendar-fontSize-eventTitle-sm)',
    '--EventCalendar-fontSize-dayNumber': 'var(--EventCalendar-fontSize-dayNumber-sm)',
    '--EventCalendar-fontSize-agendaDayNumber': 'var(--EventCalendar-fontSize-agendaDayNumber-sm)',
    '--EventCalendar-fontSize-timeText': 'var(--EventCalendar-fontSize-timeText-sm)',
  },
  [`@container ${EVENT_CALENDAR_CONTAINER_NAME} (550px <= width < 800px)`]: {
    '--EventCalendar-fontSize-eventTitle': 'var(--EventCalendar-fontSize-eventTitle-md)',
    '--EventCalendar-fontSize-dayNumber': 'var(--EventCalendar-fontSize-dayNumber-md)',
    '--EventCalendar-fontSize-agendaDayNumber': 'var(--EventCalendar-fontSize-agendaDayNumber-md)',
    '--EventCalendar-fontSize-timeText': 'var(--EventCalendar-fontSize-timeText-md)',
  },
};
