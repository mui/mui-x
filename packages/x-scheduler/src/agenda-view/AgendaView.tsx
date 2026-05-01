'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { EventCalendarViewConfig } from '@mui/x-scheduler-headless/models';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { sortEventOccurrences } from '@mui/x-scheduler-headless/sort-event-occurrences';
import { eventCalendarAgendaSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-headless/use-event-occurrences-grouped-by-day';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { AGENDA_VIEW_DAYS_AMOUNT } from '@mui/x-scheduler-headless/constants';
import {
  schedulerNowSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import clsx from 'clsx';
import { AgendaViewProps } from './AgendaView.types';
import { EventItem } from '../internals/components/event/event-item/EventItem';
import { EventSkeleton } from '../internals/components/event-skeleton';
import { useEventCalendarStyledContext } from '../event-calendar/EventCalendarStyledContext';
import { EventDialogTrigger } from '../internals/components/event-dialog';

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
  borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
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
  fontSize: theme.typography.h6.fontSize,
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

const AGENDA_VIEW_CONFIG: EventCalendarViewConfig = {
  siblingVisibleDateGetter: ({ state, delta }) =>
    state.adapter.addDays(
      schedulerOtherSelectors.visibleDate(state),
      AGENDA_VIEW_DAYS_AMOUNT * delta,
    ),
  visibleDaysSelector: eventCalendarAgendaSelectors.visibleDays,
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
    const adapter = useAdapterContext();
    const { schedulerId, classes } = useEventCalendarStyledContext();
    const store = useEventCalendarStoreContext();

    // Ref hooks
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useMergedRefs(forwardedRef, containerRef);

    // Selector hooks
    const now = useStore(store, schedulerNowSelectors.nowUpdatedEveryMinute);

    // Feature hooks
    const { days } = useEventCalendarView(AGENDA_VIEW_CONFIG);
    const occurrencesMap = useEventOccurrencesGroupedByDay({ days });

    // Selector hooks
    const isLoading = useStore(store, schedulerOtherSelectors.isLoading);

    const daysWithOccurrences = React.useMemo(
      () =>
        days.map((date) => {
          const occurrences = sortEventOccurrences(occurrencesMap.get(date.key) || []);
          return { date, occurrences };
        }),
      [days, occurrencesMap],
    );

    return (
      <AgendaViewRoot
        {...props}
        ref={handleRef}
        className={clsx(props.className, classes.agendaView)}
      >
        {daysWithOccurrences.map(({ date, occurrences }) => (
          <AgendaViewRow
            className={classes.agendaViewRow}
            key={date.key}
            id={`${schedulerId}-AgendaViewRow-${date.key}`}
            aria-labelledby={`${schedulerId}-DayHeaderCell-${date.key}`}
          >
            <DayHeaderCell
              className={classes.agendaViewDayHeaderCell}
              id={`${schedulerId}-DayHeaderCell-${date.key}`}
              aria-label={`${adapter.format(date.value, 'weekday')} ${adapter.format(date.value, 'dayOfMonth')}`}
              data-current={adapter.isSameDay(date.value, now) ? '' : undefined}
            >
              <DayNumberCell
                className={classes.agendaViewDayNumberCell}
                data-current={adapter.isSameDay(date.value, now) ? '' : undefined}
              >
                {adapter.format(date.value, 'dayOfMonth')}
              </DayNumberCell>
              <WeekDayCell className={classes.agendaViewWeekDayCell}>
                <AgendaWeekDayNameLabel
                  className={classes.agendaViewWeekDayNameLabel}
                  style={{ '--number-of-lines': 1 } as React.CSSProperties}
                >
                  {adapter.format(date.value, 'weekday')}
                </AgendaWeekDayNameLabel>
                <AgendaYearAndMonthLabel
                  className={classes.agendaViewYearAndMonthLabel}
                  style={{ '--number-of-lines': 1 } as React.CSSProperties}
                >
                  {adapter.format(date.value, 'monthFullLetter')},{' '}
                  {adapter.format(date.value, 'yearPadded')}
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
                    <EventDialogTrigger occurrence={occurrence}>
                      <EventItem
                        occurrence={occurrence}
                        date={date}
                        variant="regular"
                        ariaLabelledBy={`DayHeaderCell-${date.key}`}
                      />
                    </EventDialogTrigger>
                  </li>
                ))}
            </EventsList>
          </AgendaViewRow>
        ))}
      </AgendaViewRoot>
    );
  }),
);
