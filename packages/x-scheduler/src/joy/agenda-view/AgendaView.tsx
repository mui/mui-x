'use client';
import * as React from 'react';
import clsx from 'clsx';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { AgendaViewProps } from './AgendaView.types';
import { CalendarEvent } from '../models/events';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { AgendaEvent } from '../event/agenda-event/AgendaEvent';
import { useEventCalendarStore } from '../internals/hooks/useEventCalendarStore';
import { useSelector } from '../../base-ui-copy/utils/store';
import { selectors } from '../event-calendar/store';
import './AgendaView.css';

const adapter = getAdapter();

export const AgendaView = React.memo(
  React.forwardRef(function AgendaView(
    props: AgendaViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { className, ...other } = props;
    const store = useEventCalendarStore();

    const today = adapter.date();

    const visibleDate = useSelector(store, selectors.visibleDate);

    const getDayList = useDayList();

    const days = React.useMemo(
      () => getDayList({ date: visibleDate.startOf('week'), amount: 12 }),
      [getDayList, visibleDate],
    );

    const getEventsStartingInDay = useSelector(store, selectors.getEventsStartingInDay);
    const resourcesByIdMap = useSelector(store, selectors.resourcesByIdMap);

    return (
      <div ref={forwardedRef} className={clsx('AgendaViewContainer', 'joy', className)} {...other}>
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
                  {adapter.formatByString(day, 'cccc')}
                </span>
                <span className={clsx('AgendaYearAndMonthLabel', 'LinesClamp')}>
                  {adapter.format(day, 'month')}, {adapter.format(day, 'year')}
                </span>
              </div>
            </div>
            <div className="EventsList">
              {getEventsStartingInDay(day).map((event: CalendarEvent) => (
                <AgendaEvent
                  key={event.id}
                  event={event}
                  variant="compact"
                  eventResource={resourcesByIdMap.get(event.resource)}
                  ariaLabelledBy={`DayHeaderCell-${day.day.toString()}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }),
);
