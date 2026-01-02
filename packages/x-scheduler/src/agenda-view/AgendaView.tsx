'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
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
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { AgendaViewProps, StandaloneAgendaViewProps } from './AgendaView.types';
import { EventPopoverProvider, EventPopoverTrigger } from '../internals/components/event-popover';
import { EventItem } from '../internals/components/event/event-item/EventItem';
import { useTranslations } from '../internals/utils/TranslationsContext';
import './AgendaView.css';
import '../index.css';

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

    // Feature hooks
    const { days } = useEventCalendarView(AGENDA_VIEW_CONFIG);
    const occurrencesMap = useEventOccurrencesGroupedByDay({ days });

    // Selector hooks
    const isLoading = useStore(store, schedulerOtherSelectors.isLoading);

    const today = adapter.now('default');
    const daysWithOccurrences = React.useMemo(
      () =>
        days.map((date) => {
          const occurrences = sortEventOccurrences(occurrencesMap.get(date.key) || [], adapter);
          return { date, occurrences };
        }),
      [days, occurrencesMap, adapter],
    );

    return (
      <div
        {...props}
        ref={handleRef}
        className={clsx('AgendaViewContainer', 'mui-x-scheduler', props.className)}
      >
        <EventPopoverProvider containerRef={containerRef}>
          {isLoading && <div className="LoadingOverlay">{translations.loading}</div>}

          {daysWithOccurrences.map(({ date, occurrences }) => (
            <section
              className="AgendaViewRow"
              key={date.key}
              id={`AgendaViewRow-${date.key}`}
              aria-labelledby={`DayHeaderCell-${date.key}`}
            >
              <header
                id={`DayHeaderCell-${date.key}`}
                className="DayHeaderCell"
                aria-label={`${adapter.format(date.value, 'weekday')} ${adapter.format(date.value, 'dayOfMonth')}`}
                data-current={adapter.isSameDay(date.value, today) ? '' : undefined}
              >
                <span className="DayNumberCell">{adapter.format(date.value, 'dayOfMonth')}</span>
                <div className="WeekDayCell">
                  <span className={clsx('AgendaWeekDayNameLabel', 'LinesClamp')}>
                    {adapter.format(date.value, 'weekday')}
                  </span>
                  <span className={clsx('AgendaYearAndMonthLabel', 'LinesClamp')}>
                    {adapter.format(date.value, 'monthFullLetter')},{' '}
                    {adapter.format(date.value, 'yearPadded')}
                  </span>
                </div>
              </header>
              <ul className="EventsList">
                {occurrences.map((occurrence) => (
                  <li key={occurrence.key}>
                    <EventPopoverTrigger
                      occurrence={occurrence}
                      render={
                        <EventItem
                          occurrence={occurrence}
                          date={date}
                          variant="regular"
                          ariaLabelledBy={`DayHeaderCell-${date.key}`}
                        />
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </EventPopoverProvider>
      </div>
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
      <AgendaView ref={forwardedRef} {...forwardedProps} />
    </EventCalendarProvider>
  );
}) as StandaloneAgendaViewComponent;

type StandaloneAgendaViewComponent = <TEvent extends object, TResource extends object>(
  props: StandaloneAgendaViewProps<TEvent, TResource> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.JSX.Element;
