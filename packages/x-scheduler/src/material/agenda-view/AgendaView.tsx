'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { AgendaViewProps } from './AgendaView.types';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { useEventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { selectors } from '../event-calendar/store';
import { EventPopoverProvider, EventPopoverTrigger } from '../internals/components/event-popover';
import { DayGridEvent } from '../internals/components/event/day-grid-event/DayGridEvent';
import './AgendaView.css';

export const AGENDA_VIEW_DAYS_AMOUNT = 12;

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

    const getDayList = useDayList();

    const days = React.useMemo(
      () => getDayList({ date: visibleDate, amount: AGENDA_VIEW_DAYS_AMOUNT }),
      [getDayList, visibleDate],
    );

    const getEventsStartingInDay = useStore(store, selectors.getEventsStartingInDay);
    const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);

    return (
      <div
        ref={handleRef}
        className={clsx('AgendaViewContainer', 'mui-x-scheduler', className)}
        {...other}
      >
        <EventPopoverProvider containerRef={containerRef}>
          {days.map((day) => (
            <div
              className="AgendaViewRow"
              key={day.day.toString()}
              id={`AgendaViewRow-${day.day.toString()}`}
            >
              <div
                id={`DayHeaderCell-${day.day.toString()}`}
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
                {getEventsStartingInDay(day).map((event) => (
                  <EventPopoverTrigger
                    key={event.id}
                    event={event}
                    nativeButton={false}
                    render={
                      <DayGridEvent
                        event={event}
                        variant="compact"
                        eventResource={resourcesByIdMap.get(event.resource)}
                        ariaLabelledBy={`DayHeaderCell-${day.day.toString()}`}
                      />
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </EventPopoverProvider>
      </div>
    );
  }),
);
