'use client';
import * as React from 'react';
import clsx from 'clsx';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { SchedulerValidDate } from '../../primitives/models';
import { TimeGrid } from '../../primitives/time-grid';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { AgendaViewProps } from './AgendaView.types';
import { CalendarEvent } from '../models/events';
import { isWeekend } from '../internals/utils/date-utils';
import { useTranslations } from '../internals/utils/TranslationsContext';
import './AgendaView.css';
import { useDayList } from '@mui/x-scheduler/primitives/use-day-list';
import { AgendaEvent } from '../event/agenda-event/AgendaEvent';

const adapter = getAdapter();

export const AgendaView = React.forwardRef(function AgendaView(
  props: AgendaViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const getDayList = useDayList();

  const today = adapter.date('2025-05-26');
  const days = React.useMemo(
    () => getDayList({ date: today.startOf('week'), amount: 12 }),
    [getDayList, today],
  );

  const { events, resources, className, ...other } = props;

  const eventsByDay = React.useMemo(() => {
    const map = new Map();
    for (const event of events) {
      const dayKey = adapter.format(event.start, 'keyboardDate');
      if (!map.has(dayKey)) {
        map.set(dayKey, []);
      }
      map.get(dayKey).push(event);
    }
    return map;
  }, [adapter, events]);

  const resourcesById = React.useMemo(() => {
    const map = new Map();
    for (const resource of resources || []) {
      map.set(resource.id, resource);
    }
    return map;
  }, [resources]);

  return (
    <div ref={forwardedRef} className={clsx('AgendaViewContainer', 'joy', className)} {...other}>
      {days.map((day) => {
        const dayKey = adapter.format(day, 'keyboardDate');
        const dayEvents = eventsByDay.get(dayKey) || [];

        return (
          <div
            className="AgendaViewRow"
            key={day.day.toString()}
            id={`AgendaViewRow-${day.day.toString()}`}
          >
            <div
              className={clsx('DayHeaderCell', adapter.isSameDay(day, today) && 'Today')}
              aria-label={`${adapter.format(day, 'weekday')} ${adapter.format(day, 'dayOfMonth')}`}
            >
              <span className="DayNumberCell">{adapter.format(day, 'dayOfMonth')}</span>
              <div className="WeekDayCell">
                <span className={clsx('WeekDayName', 'LinesClamp')}>
                  {adapter.formatByString(day, 'cccc')}
                </span>
                <span className={clsx('YearAndMonth', 'LinesClamp')}>
                  {adapter.format(day, 'month')}, {adapter.format(day, 'year')}
                </span>
              </div>
            </div>
            <div className="EventsList">
              {dayEvents.map((event: CalendarEvent) => (
                <AgendaEvent
                  key={event.id}
                  event={event}
                  variant="compact"
                  eventResource={resourcesById.get(event.resource)}
                  ariaLabelledBy={`WeekDayName-${day.day.toString()}`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
});
