'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useForkRef } from '@base-ui-components/react/utils';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { AgendaViewProps } from './AgendaView.types';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { useEventCalendarStore } from '../internals/hooks/useEventCalendarStore';
import { useSelector } from '../../base-ui-copy/utils/store';
import { selectors } from '../event-calendar/store';
import { EventPopoverProvider } from '../internals/utils/EventPopoverProvider';
import { DayGridEvent } from '../internals/components/event/day-grid-event/DayGridEvent';
import './AgendaView.css';

const adapter = getAdapter();

export const AgendaView = React.memo(
  React.forwardRef(function AgendaView(
    props: AgendaViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useForkRef(forwardedRef, containerRef);

    const { onEventsChange, className, ...other } = props;
    const store = useEventCalendarStore();

    const today = adapter.date();

    const visibleDate = useSelector(store, selectors.visibleDate);
    const visibleResourceIds = useSelector(store, selectors.visibleResourceIds);

    const getDayList = useDayList();

    const days = React.useMemo(
      () => getDayList({ date: visibleDate, amount: 12 }),
      [getDayList, visibleDate],
    );

    const getEventsStartingInDay = useSelector(store, selectors.getEventsStartingInDay);
    const resourcesByIdMap = useSelector(store, selectors.resourcesByIdMap);

    const visibleEventsByDay = React.useMemo(() => {
      const map = new Map();
      days.forEach((day) => {
        const dayKey = day.day.toString();
        const events = getEventsStartingInDay(day).filter(
          (event) => event.resource && visibleResourceIds.includes(event.resource),
        );
        map.set(dayKey, events);
      });
      return map;
    }, [days, getEventsStartingInDay, visibleResourceIds]);

    return (
      <div ref={handleRef} className={clsx('AgendaViewContainer', 'joy', className)} {...other}>
        <EventPopoverProvider containerRef={containerRef} onEventsChange={onEventsChange}>
          {({ onEventClick }) => (
            <React.Fragment>
              {days.map((day) => {
                const dayKey = day.day.toString();
                return (
                  <div className="AgendaViewRow" key={dayKey} id={`AgendaViewRow-${dayKey}`}>
                    <div
                      id={`DayHeaderCell-${dayKey}`}
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
                    </div>
                    <div className="EventsList">
                      {visibleEventsByDay.get(dayKey).map((event) => (
                        <DayGridEvent
                          key={event.id}
                          event={event}
                          variant="compact"
                          eventResource={resourcesByIdMap.get(event.resource)}
                          ariaLabelledBy={`DayHeaderCell-${dayKey}`}
                          onEventClick={onEventClick}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          )}
        </EventPopoverProvider>
      </div>
    );
  }),
);
