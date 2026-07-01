import type { CSSObject } from '@mui/material/styles';

export const EVENT_CALENDAR_CONTAINER_NAME = 'mui-event-calendar-content';

// Container-query breakpoints (px) for retargeting the typography vars. Shared so
// slots like the day-number circle react to the same widths from a single source.
export const RESPONSIVE_TYPOGRAPHY_BREAKPOINT_SM = 550;
export const RESPONSIVE_TYPOGRAPHY_BREAKPOINT_MD = 800;

// Wraps the whole calendar (vs. content-only `EVENT_CALENDAR_CONTAINER_NAME`), so the
// toolbar and drawer react to the overall width via CSS. Distinct names never conflict.
export const EVENT_CALENDAR_ROOT_CONTAINER_NAME = 'mui-event-calendar-root';

// Builds every `@container` at-rule from the shared breakpoint constants, so no
// hardcoded `550px` drifts out of sync with the typography tiers.
const containerWidthBelow = (containerName: string, widthPx: number) =>
  `@container ${containerName} (width < ${widthPx}px)`;
const containerWidthFrom = (containerName: string, widthPx: number) =>
  `@container ${containerName} (width >= ${widthPx}px)`;
const containerWidthBetween = (containerName: string, minWidthPx: number, maxWidthPx: number) =>
  `@container ${containerName} (${minWidthPx}px <= width < ${maxWidthPx}px)`;

// Root-container queries: switch desktop/mobile layout on the overall width. Tag
// descendants `data-desktop-only` / `data-mobile-only`; toggle rules live on the root.
export const eventCalendarRootMobileQuery = containerWidthBelow(
  EVENT_CALENDAR_ROOT_CONTAINER_NAME,
  RESPONSIVE_TYPOGRAPHY_BREAKPOINT_SM,
);
export const eventCalendarRootDesktopQuery = containerWidthFrom(
  EVENT_CALENDAR_ROOT_CONTAINER_NAME,
  RESPONSIVE_TYPOGRAPHY_BREAKPOINT_SM,
);

// Content-container query: reacts to content width (shrinks with the side panel) at
// the same breakpoint, for slots that scale with the views' available room.
export const eventCalendarContentMobileQuery = containerWidthBelow(
  EVENT_CALENDAR_CONTAINER_NAME,
  RESPONSIVE_TYPOGRAPHY_BREAKPOINT_SM,
);

// Two layers per token: three tier vars (`-sm`/`-md`/`-lg`) declared unconditionally,
// and an effective var (lg by default) retargeted at narrower widths by the queries below.
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

  // Time labels — time-axis ticks, event-card times, and the "all day" label.
  '--EventCalendar-fontSize-timeText-sm': '0.6rem',
  '--EventCalendar-fontSize-timeText-md': '0.7rem',
  '--EventCalendar-fontSize-timeText-lg': '0.75rem',

  // Recurring-event icon. lg matches the historical `fontSize="small"` (1.25rem);
  // narrower tiers shrink it alongside the text.
  '--EventCalendar-fontSize-recurringIcon-sm': '1rem',
  '--EventCalendar-fontSize-recurringIcon-md': '1.125rem',
  '--EventCalendar-fontSize-recurringIcon-lg': '1.25rem',

  // Effective vars: slots reference these; default to lg, retargeted at narrower
  // widths by `responsiveTypographyContainerQueries`.
  '--EventCalendar-fontSize-eventTitle': 'var(--EventCalendar-fontSize-eventTitle-lg)',
  '--EventCalendar-fontSize-dayNumber': 'var(--EventCalendar-fontSize-dayNumber-lg)',
  '--EventCalendar-fontSize-agendaDayNumber': 'var(--EventCalendar-fontSize-agendaDayNumber-lg)',
  '--EventCalendar-fontSize-timeText': 'var(--EventCalendar-fontSize-timeText-lg)',
  '--EventCalendar-fontSize-recurringIcon': 'var(--EventCalendar-fontSize-recurringIcon-lg)',
};

export const responsiveTokens: CSSObject = {
  // Width of the fixed left column in week/day views (all-day label + time axis).
  '--EventCalendar-size-fixedCellWidth': '68px',
  // Typography tokens
  ...responsiveTypographyTokens,
};

// Inert unless an ancestor sets container-type + name; `ResponsiveTypographyContainer`
// is that ancestor, so these queries fire for both the calendar and standalone views.
export const responsiveTypographyContainerQueries: CSSObject = {
  [eventCalendarContentMobileQuery]: {
    // fixed cell width
    '--EventCalendar-size-fixedCellWidth': '54px',
    // Typography
    '--EventCalendar-fontSize-eventTitle': 'var(--EventCalendar-fontSize-eventTitle-sm)',
    '--EventCalendar-fontSize-dayNumber': 'var(--EventCalendar-fontSize-dayNumber-sm)',
    '--EventCalendar-fontSize-agendaDayNumber': 'var(--EventCalendar-fontSize-agendaDayNumber-sm)',
    '--EventCalendar-fontSize-timeText': 'var(--EventCalendar-fontSize-timeText-sm)',
    '--EventCalendar-fontSize-recurringIcon': 'var(--EventCalendar-fontSize-recurringIcon-sm)',
  },
  [containerWidthBetween(
    EVENT_CALENDAR_CONTAINER_NAME,
    RESPONSIVE_TYPOGRAPHY_BREAKPOINT_SM,
    RESPONSIVE_TYPOGRAPHY_BREAKPOINT_MD,
  )]: {
    '--EventCalendar-fontSize-eventTitle': 'var(--EventCalendar-fontSize-eventTitle-md)',
    '--EventCalendar-fontSize-dayNumber': 'var(--EventCalendar-fontSize-dayNumber-md)',
    '--EventCalendar-fontSize-agendaDayNumber': 'var(--EventCalendar-fontSize-agendaDayNumber-md)',
    '--EventCalendar-fontSize-timeText': 'var(--EventCalendar-fontSize-timeText-md)',
    '--EventCalendar-fontSize-recurringIcon': 'var(--EventCalendar-fontSize-recurringIcon-md)',
  },
};
