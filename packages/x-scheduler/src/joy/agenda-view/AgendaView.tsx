'use client';
import * as React from 'react';
import clsx from 'clsx';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { SchedulerValidDate } from '../../primitives/models';
import { TimeGrid } from '../../primitives/time-grid';
import { TimeGridEvent } from '../event/TimeGridEvent';
import { AgendaViewProps } from './AgendaView.types';
import { CalendarEvent } from '../models/events';
import { isWeekend } from '../utils/date-utils';
import { useTranslations } from '../utils/TranslationsContext';
import './AgendaView.css';
import { useDayList } from '@mui/x-scheduler/primitives/use-day-list';
import { AgendaEvent } from '../event/AgendaEvent';

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

  const { events, className, ...other } = props;

  const translations = useTranslations();
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const headerWrapperRef = React.useRef<HTMLDivElement>(null);

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

  console.log('AgendaView eventsByDay', eventsByDay);

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
              className="DayHeaderCell"
              aria-label={`${adapter.format(day, 'weekday')} ${adapter.format(day, 'dayOfMonth')}`}
            >
              <span className="DayNumberCell">{adapter.format(day, 'dayOfMonth')}</span>
              <div className="WeekDayCell">
                <span className="WeekDayName">{adapter.formatByString(day, 'cccc')}</span>
                <span className="YearAndMonth">
                  {adapter.format(day, 'month')}, {adapter.format(day, 'year')}
                </span>
              </div>
            </div>
            <div className="EventsList">
              {dayEvents.map((event: CalendarEvent) => (
                <AgendaEvent
                  key={event.id}
                  event={event}
                  variant="regular"
                  ariaLabelledBy={`AgendaEvent-${day.day.toString()}`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
});
