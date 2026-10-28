'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import type {
  EventCalendarViewDefinition,
  SchedulerEventOccurrence,
  SchedulerProcessedDay,
} from '@mui/x-scheduler-internals/models';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { sortEventOccurrences } from '@mui/x-scheduler-internals/sort-event-occurrences';
import {
  eventCalendarAgendaSelectors,
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-internals/event-calendar-selectors';
import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-internals/use-event-occurrences-grouped-by-day';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import {
  addToAdapterDate,
  formatDayOfMonth,
  formatMonthAndYear,
  formatWeekday,
  formatWeekdayMonthAndDayOfMonth,
  formatWeekNumber,
  getDayNumber,
  getStartOfWeekDayNumber,
  getWeekNumber,
} from '@mui/x-scheduler-internals/internals';
import {
  schedulerNowSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import clsx from 'clsx';
import type { AgendaViewProps } from './AgendaView.types';
import { EventItem } from '../internals/components/event/event-item/EventItem';
import { EventSkeleton } from '../internals/components/event-skeleton';
import { useEventCalendarStyledContext } from '../event-calendar/EventCalendarStyledContext';
import { getSiblingMonthStart } from '../internals/utils/date-utils';
import { EventContextMenuTrigger } from '../internals/components/event-context-menu';

const AgendaViewRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'AgendaView',
})(({ theme }) => ({
  width: '100%',
  maxHeight: '100%',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflowY: 'auto',
  position: 'relative',
}));

const AgendaViewRow = styled('section', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewRow',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '190px 1fr',
  '&:not(:last-child)': {
    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

const DayHeaderCell = styled('header', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewDayHeaderCell',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  borderInlineEnd: `1px solid ${(theme.vars || theme).palette.divider}`,
  padding: theme.spacing(2),
  gap: theme.spacing(0.5),
  '&[data-current]': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.primary.light, 0.05),
    color: (theme.vars || theme).palette.primary.main,
  },
}));

const DayNumberCell = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewDayNumberCell',
})(({ theme }) => ({
  fontSize: 'var(--EventCalendar-fontSize-agendaDayNumber, 1.5rem)',
  fontWeight: theme.typography.fontWeightMedium,
  lineHeight: 1,
  minWidth: '4ch',
  textAlign: 'center',
  color: (theme.vars || theme).palette.text.primary,
  '&[data-current]': {
    color: (theme.vars || theme).palette.primary.main,
  },
}));

const WeekDayCell = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewWeekDayCell',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const AgendaWeekDayNameLabel = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewWeekDayNameLabel',
})(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  lineHeight: 1,
  display: '-webkit-box',
  WebkitLineClamp: 'var(--number-of-lines)',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
}));

const AgendaYearAndMonthLabel = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewYearAndMonthLabel',
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1,
  color: (theme.vars || theme).palette.text.secondary,
  display: '-webkit-box',
  WebkitLineClamp: 'var(--number-of-lines)',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  '[data-current] &': {
    color: 'inherit',
  },
}));

const EventsList = styled('ul', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewEventsList',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  margin: 0,
  listStyle: 'none',
  flexGrow: 1,
}));

const AgendaViewWeekNumberLabel = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewWeekNumberLabel',
})(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: theme.typography.fontWeightRegular,
  lineHeight: 1,
  color: (theme.vars || theme).palette.text.primary,
}));

const AgendaViewWeekNumberRow = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewWeekNumberRow',
})(({ theme }) => ({
  padding: theme.spacing(0.5, 2),
  backgroundColor: (theme.vars || theme).palette.grey[200],
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.grey[900],
  }),
}));

const AgendaViewEmptyState = styled('p', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewEmptyState',
})(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(4, 2),
  textAlign: 'center',
  fontSize: theme.typography.body2.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
}));

interface AgendaDay {
  date: SchedulerProcessedDay;
  occurrences: SchedulerEventOccurrence[];
  weekNumber: number;
  isFirstDayOfWeek: boolean;
}

const AGENDA_VIEW_DEFINITION: EventCalendarViewDefinition = {
  siblingVisibleDateGetter: ({ state, delta }) => {
    const dayCount = eventCalendarViewSelectors.agendaDayCount(state);
    if (dayCount === 'month') {
      return getSiblingMonthStart(state, delta);
    }
    return addToAdapterDate(
      state.adapter,
      schedulerOtherSelectors.visibleDate(state),
      { days: dayCount * delta },
      state.displayTimezone,
    );
  },
  visibleDaysSelector: eventCalendarAgendaSelectors.visibleDays,
  fetchRangeSelector: eventCalendarAgendaSelectors.fetchRange,
};

/**
 * An Agenda View to use inside the Event Calendar.
 */
export const AgendaView = React.memo(
  React.forwardRef(function AgendaView(
    props: AgendaViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Context hooks
    const { schedulerId, classes, localeText } = useEventCalendarStyledContext();
    const store = useEventCalendarStoreContext();

    // Selector hooks
    const nowDayNumber = useStore(store, schedulerNowSelectors.nowDayNumber);
    const showWeekNumber = useStore(store, eventCalendarPreferenceSelectors.showWeekNumber);
    const weekInfo = useStore(store, eventCalendarPreferenceSelectors.weekInfo);
    const locale = useStore(store, schedulerOtherSelectors.dateLocale);

    // Feature hooks
    const { days: visibleDays } = useEventCalendarView(AGENDA_VIEW_DEFINITION);

    // Selector hooks
    const isLoading = useStore(store, schedulerOtherSelectors.isLoading);
    const baseVisibleDays = useStore(store, eventCalendarAgendaSelectors.baseVisibleDays);

    // While loading with no day to show, render the base days so the skeletons have rows.
    const days = isLoading && visibleDays.length === 0 ? baseVisibleDays : visibleDays;
    const occurrencesMap = useEventOccurrencesGroupedByDay({ days });

    const daysWithOccurrences = React.useMemo(() => {
      // The week number heads the first day of each week, so it's only computed when shown.
      const result: AgendaDay[] = [];
      let previousWeekStartDayNumber: number | null = null;
      for (const date of days) {
        const occurrences = sortEventOccurrences(occurrencesMap.get(date.key) || []);
        let weekNumber = 0;
        let isFirstDayOfWeek = false;
        if (showWeekNumber) {
          const weekStartDayNumber = getStartOfWeekDayNumber(
            getDayNumber(date.plainDate),
            weekInfo.firstDay,
          );
          isFirstDayOfWeek = weekStartDayNumber !== previousWeekStartDayNumber;
          if (isFirstDayOfWeek) {
            weekNumber = getWeekNumber(date.plainDate, weekInfo);
          }
          previousWeekStartDayNumber = weekStartDayNumber;
        }
        result.push({ date, occurrences, weekNumber, isFirstDayOfWeek });
      }
      return result;
    }, [days, occurrencesMap, showWeekNumber, weekInfo]);

    return (
      <AgendaViewRoot
        {...props}
        ref={forwardedRef}
        className={clsx(props.className, classes.agendaView)}
      >
        {!isLoading && days.length === 0 && (
          <AgendaViewEmptyState className={classes.agendaViewEmptyState} role="status">
            {localeText.agendaViewEmptyStateLabel}
          </AgendaViewEmptyState>
        )}
        {daysWithOccurrences.map(({ date, occurrences, isFirstDayOfWeek, weekNumber }) => {
          const isToday = getDayNumber(date.plainDate) === nowDayNumber;
          return (
            <React.Fragment key={date.key}>
              {showWeekNumber && isFirstDayOfWeek && (
                <AgendaViewWeekNumberRow className={classes.agendaViewWeekNumberRow}>
                  <AgendaViewWeekNumberLabel
                    className={classes.agendaViewWeekNumberLabel}
                    aria-label={localeText.weekNumberAriaLabel(weekNumber)}
                  >
                    {`${localeText.week} ${formatWeekNumber(locale, weekNumber)}`}
                  </AgendaViewWeekNumberLabel>
                </AgendaViewWeekNumberRow>
              )}
              <AgendaViewRow
                className={classes.agendaViewRow}
                id={`${schedulerId}-AgendaViewRow-${date.key}`}
                aria-labelledby={`${schedulerId}-DayHeaderCell-${date.key}`}
              >
                <DayHeaderCell
                  className={classes.agendaViewDayHeaderCell}
                  id={`${schedulerId}-DayHeaderCell-${date.key}`}
                  aria-label={formatWeekdayMonthAndDayOfMonth(locale, date.plainDate)}
                  data-current={isToday ? '' : undefined}
                  aria-current={isToday ? 'date' : undefined}
                >
                  <DayNumberCell
                    className={classes.agendaViewDayNumberCell}
                    data-current={isToday ? '' : undefined}
                  >
                    {formatDayOfMonth(locale, date.plainDate)}
                  </DayNumberCell>
                  <WeekDayCell className={classes.agendaViewWeekDayCell}>
                    <AgendaWeekDayNameLabel
                      className={classes.agendaViewWeekDayNameLabel}
                      style={{ '--number-of-lines': 1 } as React.CSSProperties}
                    >
                      {formatWeekday(locale, date.plainDate)}
                    </AgendaWeekDayNameLabel>
                    <AgendaYearAndMonthLabel
                      className={classes.agendaViewYearAndMonthLabel}
                      style={{ '--number-of-lines': 1 } as React.CSSProperties}
                    >
                      {formatMonthAndYear(locale, date.plainDate)}
                    </AgendaYearAndMonthLabel>
                  </WeekDayCell>
                </DayHeaderCell>
                <EventsList className={classes.agendaViewEventsList}>
                  {isLoading && (
                    <li className={classes.agendaViewEventListItem}>
                      <EventSkeleton data-variant="agenda" />
                    </li>
                  )}
                  {!isLoading &&
                    occurrences.map((occurrence) => (
                      <li key={occurrence.key} className={classes.agendaViewEventListItem}>
                        <EventContextMenuTrigger occurrence={occurrence}>
                          <EventItem occurrence={occurrence} date={date} variant="regular" />
                        </EventContextMenuTrigger>
                      </li>
                    ))}
                </EventsList>
              </AgendaViewRow>
            </React.Fragment>
          );
        })}
      </AgendaViewRoot>
    );
  }),
);
