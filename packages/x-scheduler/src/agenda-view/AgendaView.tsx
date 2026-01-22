'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { EventCalendarViewConfig } from '@mui/x-scheduler-headless/models';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { sortEventOccurrences } from '@mui/x-scheduler-headless/sort-event-occurrences';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { eventCalendarAgendaSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-headless/use-event-occurrences-grouped-by-day';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { AGENDA_VIEW_DAYS_AMOUNT } from '@mui/x-scheduler-headless/constants';
import {
  schedulerNowSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { AgendaViewProps, StandaloneAgendaViewProps } from './AgendaView.types';
import { EventItem } from '../internals/components/event/event-item/EventItem';
import { useTranslations } from '../internals/utils/TranslationsContext';
import { EventPopoverProvider, EventPopoverTrigger } from '../internals/components';
import '../index.css';
import {
  EventDraggableDialogProvider,
  EventDraggableDialogTrigger,
} from '../internals/components/event-draggable-dialog';

const AgendaViewRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewRoot',
})(({ theme }) => ({
  width: '100%',
  height: '100%',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflowY: 'scroll',
}));

const AgendaViewRow = styled('section', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewRow',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '190px 1fr',
  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const DayHeaderCell = styled('header', {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewDayHeaderCell',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  gap: theme.spacing(0.5),
  '&[data-current]': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
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
  color: theme.palette.text.primary,
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
  color: theme.palette.text.secondary,
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
  flexGrow: 1,
  '& .EventRecurringIcon': {
    position: 'static',
  },
}));

// TODO: Replace with a proper loading overlay component that is shared across views
const AgendaViewLoadingOverlay = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'AgendaViewLoadingOverlay',
})(({ theme }) => ({
  position: 'absolute',
  fontSize: theme.typography.body1.fontSize,
  padding: 2,
  color: theme.palette.text.secondary,
  zIndex: 1,
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
    const adapter = useAdapter();
    const translations = useTranslations();
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
          const occurrences = sortEventOccurrences(occurrencesMap.get(date.key) || [], adapter);
          return { date, occurrences };
        }),
      [days, occurrencesMap, adapter],
    );

    return (
      <AgendaViewRoot {...props} ref={handleRef}>
        {isLoading && <AgendaViewLoadingOverlay>{translations.loading}</AgendaViewLoadingOverlay>}

        {daysWithOccurrences.map(({ date, occurrences }) => (
          <AgendaViewRow
            key={date.key}
            id={`AgendaViewRow-${date.key}`}
            aria-labelledby={`DayHeaderCell-${date.key}`}
          >
            <DayHeaderCell
              id={`DayHeaderCell-${date.key}`}
              aria-label={`${adapter.format(date.value, 'weekday')} ${adapter.format(date.value, 'dayOfMonth')}`}
              data-current={adapter.isSameDay(date.value, now) ? '' : undefined}
            >
              <DayNumberCell>{adapter.format(date.value, 'dayOfMonth')}</DayNumberCell>
              <WeekDayCell>
                <AgendaWeekDayNameLabel style={{ '--number-of-lines': 1 } as React.CSSProperties}>
                  {adapter.format(date.value, 'weekday')}
                </AgendaWeekDayNameLabel>
                <AgendaYearAndMonthLabel style={{ '--number-of-lines': 1 } as React.CSSProperties}>
                  {adapter.format(date.value, 'monthFullLetter')},{' '}
                  {adapter.format(date.value, 'yearPadded')}
                </AgendaYearAndMonthLabel>
              </WeekDayCell>
            </DayHeaderCell>
            <EventsList>
              {occurrences.map((occurrence) => (
                <li key={occurrence.key}>
                  <EventDraggableDialogTrigger occurrence={occurrence}>
                    <EventItem
                      occurrence={occurrence}
                      date={date}
                      variant="regular"
                      ariaLabelledBy={`DayHeaderCell-${date.key}`}
                    />
                  </EventDraggableDialogTrigger>
                </li>
              ))}
            </EventsList>
          </AgendaViewRow>
        ))}
      </AgendaViewRoot>
    );
  }),
);

/**
 * An Agenda View that can be used outside of the Event Calendar.
 */
export const StandaloneAgendaView = React.forwardRef(function StandaloneAgendaView<
  TEvent extends object,
  TResource extends object,
>(
  props: StandaloneAgendaViewProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { parameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    typeof props
  >(props);

  return (
    <EventCalendarProvider {...parameters}>
      <EventDraggableDialogProvider>
        <AgendaView ref={forwardedRef} {...forwardedProps} />
      </EventDraggableDialogProvider>
    </EventCalendarProvider>
  );
}) as StandaloneAgendaViewComponent;

type StandaloneAgendaViewComponent = <TEvent extends object, TResource extends object>(
  props: StandaloneAgendaViewProps<TEvent, TResource> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.JSX.Element;
