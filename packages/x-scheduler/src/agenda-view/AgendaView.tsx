'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { useAgendaEventOccurrencesGroupedByDay } from '@mui/x-scheduler-headless/use-agenda-event-occurrences-grouped-by-day';
import { AGENDA_VIEW_DAYS_AMOUNT } from '@mui/x-scheduler-headless/constants';
import { AgendaViewProps, StandaloneAgendaViewProps } from './AgendaView.types';
import { EventPopoverProvider, EventPopoverTrigger } from '../internals/components/event-popover';
import { EventItem } from '../internals/components/event/event-item/EventItem';
import './AgendaView.css';
import '../index.css';

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

    // Ref hooks
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useMergedRefs(forwardedRef, containerRef);

    // Feature hooks
    const { days, occurrencesMap } = useAgendaEventOccurrencesGroupedByDay();
    useEventCalendarView(() => ({
      siblingVisibleDateGetter: (date, delta) =>
        adapter.addDays(date, AGENDA_VIEW_DAYS_AMOUNT * delta),
    }));

    const today = adapter.date();

    return (
      <div
        {...props}
        ref={handleRef}
        className={clsx('AgendaViewContainer', 'mui-x-scheduler', props.className)}
      >
        <EventPopoverProvider containerRef={containerRef}>
          {days.map((day) => (
            <section
              className="AgendaViewRow"
              key={day.key}
              id={`AgendaViewRow-${day.key}`}
              aria-labelledby={`DayHeaderCell-${day.key}`}
            >
              <header
                id={`DayHeaderCell-${day.key}`}
                className="DayHeaderCell"
                aria-label={`${adapter.format(day.value, 'weekday')} ${adapter.format(day.value, 'dayOfMonth')}`}
                data-current={adapter.isSameDay(day.value, today) ? '' : undefined}
              >
                <span className="DayNumberCell">{adapter.format(day.value, 'dayOfMonth')}</span>
                <div className="WeekDayCell">
                  <span className={clsx('AgendaWeekDayNameLabel', 'LinesClamp')}>
                    {adapter.format(day.value, 'weekday')}
                  </span>
                  <span className={clsx('AgendaYearAndMonthLabel', 'LinesClamp')}>
                    {adapter.format(day.value, 'month')}, {adapter.format(day.value, 'year')}
                  </span>
                </div>
              </header>
              <ul className="EventsList">
                {occurrencesMap.get(day.key)!.map((occurrence) => (
                  <li key={occurrence.key}>
                    <EventPopoverTrigger
                      occurrence={occurrence}
                      render={
                        <EventItem
                          occurrence={occurrence}
                          variant="regular"
                          ariaLabelledBy={`DayHeaderCell-${day.key}`}
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
