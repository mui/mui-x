'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { AgendaViewProps } from './AgendaView.types';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { useEventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { AGENDA_VIEW_DAYS_AMOUNT, selectors } from '../../primitives/use-event-calendar';
import { EventPopoverProvider, EventPopoverTrigger } from '../internals/components/event-popover';
import { DayGridEvent } from '../internals/components/event/day-grid-event/DayGridEvent';
import './AgendaView.css';

const adapter = getAdapter();

export const AgendaView = React.memo(
  React.forwardRef(function AgendaView(
    props: AgendaViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useMergedRefs(forwardedRef, containerRef);

    const { className, ...other } = props;
    const { store } = useEventCalendarContext();

    const today = adapter.date();

    const visibleDate = useStore(store, selectors.visibleDate);
    const settings = useStore(store, selectors.settings);
    const getDayList = useDayList();

    const days = React.useMemo(
      () =>
        getDayList({
          date: visibleDate,
          amount: AGENDA_VIEW_DAYS_AMOUNT,
          excludeWeekends: settings.hideWeekends,
        }),
      [getDayList, settings.hideWeekends, visibleDate],
    );
    const daysWithEvents = useStore(store, selectors.eventsToRenderGroupedByDay, {
      days,
      shouldOnlyRenderEventInOneCell: false,
    });
    const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);

    return (
      <div
        ref={handleRef}
        className={clsx('AgendaViewContainer', 'mui-x-scheduler', className)}
        {...other}
      >
        <EventPopoverProvider containerRef={containerRef}>
          {daysWithEvents.map(({ day, events, allDayEvents }) => (
            <section
              className="AgendaViewRow"
              key={day.toString()}
              id={`AgendaViewRow-${day.toString()}`}
              aria-labelledby={`DayHeaderCell-${day.day.toString()}`}
            >
              <header
                id={`DayHeaderCell-${day.toString()}`}
                className={clsx('DayHeaderCell', adapter.isSameDay(day, today) && 'Today')}
                aria-label={`${adapter.format(day, 'weekday')} ${adapter.format(day, 'dayOfMonth')}`}
              >
                <span className="DayNumberCell">{adapter.format(day, 'dayOfMonth')}</span>
                <div className="WeekDayCell">
                  <span className={clsx('AgendaWeekDayNameLabel', 'LinesClamp')}>
                    {adapter.format(day, 'weekday')}
                  </span>
                  <span className={clsx('AgendaYearAndMonthLabel', 'LinesClamp')}>
                    {adapter.format(day, 'month')}, {adapter.format(day, 'year')}
                  </span>
                </div>
              </header>
              <ul className="EventsList">
                {allDayEvents.map((event) => (
                  <li>
                    <EventPopoverTrigger
                      key={event.key}
                      event={event}
                      render={
                        <DayGridEvent
                          event={event}
                          variant="compact"
                          eventResource={resourcesByIdMap.get(event.resource)}
                          ariaLabelledBy={`DayHeaderCell-${day.toString()}`}
                        />
                      }
                    />
                  </li>
                ))}
                {events.map((event) => (
                  <li>
                    <EventPopoverTrigger
                      key={event.key}
                      event={event}
                      render={
                        <DayGridEvent
                          event={event}
                          variant="compact"
                          eventResource={resourcesByIdMap.get(event.resource)}
                          ariaLabelledBy={`DayHeaderCell-${day.toString()}`}
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
