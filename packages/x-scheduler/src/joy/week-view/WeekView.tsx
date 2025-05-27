'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';
import { SchedulerValidDate } from '../../primitives/utils/adapter/types';
import { TimeGrid } from '../../primitives/time-grid';
import { WeekViewProps } from './WeekView.types';
import { CalendarEvent } from '../models/events';
import { isWeekend } from '../utils/date-utils';
import './WeekView.css';

function getCurrentWeekDays(today: SchedulerValidDate) {
  const startOfWeek = today.startOf('week');
  return Array.from({ length: 7 }, (_, i) => startOfWeek.plus({ days: i }));
}

export const WeekView = React.forwardRef(function WeekView(
  props: WeekViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, className, ...other } = props;

  const adapter = useAdapter();
  const today = adapter.date('2025-05-26');
  const currentWeekDays = getCurrentWeekDays(today);

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

  return (
    <div ref={forwardedRef} className={clsx('WeekViewContainer', className)} {...other}>
      <TimeGrid.Root className="WeekViewRoot">
        <div className="WeekViewHeader">
          <div className="WeekViewGridRow WeekViewHeaderRow" role="row">
            <div className="WeekViewAllDayEventsCell" />
            {currentWeekDays.map((day) => (
              <div
                key={day.day.toString()}
                className="WeekViewHeaderCell"
                id={`WeekViewHeaderCell-${day.day.toString()}`}
                role="columnheader"
                aria-label={`${adapter.format(day, 'weekday')} ${adapter.format(day, 'dayOfMonth')}`}
              >
                {/* // TODO: Add the 3 letter week day format to the adapter */}
                <span className="WeekViewHeaderDayName">{adapter.formatByString(day, 'ccc')}</span>
                <span className="WeekViewHeaderDayNumber">{adapter.format(day, 'dayOfMonth')}</span>
              </div>
            ))}
          </div>
          <div className="WeekViewGridRow WeekViewAllDayEventsRow" role="row">
            <div
              className="WeekViewAllDayEventsCell WeekViewAllDayEventsHeaderCell"
              role="columnheader"
            >
              {/* // TODO: Add localization */}
              All day
            </div>
            {currentWeekDays.map((day) => (
              <div
                key={day.day.toString()}
                className="WeekViewAllDayEventsCell"
                aria-labelledby={`WeekViewHeaderCell-${day.day.toString()}`}
                role="gridcell"
                data-weekend={isWeekend(adapter, day) ? '' : undefined}
              />
            ))}
          </div>
        </div>
        <div className="WeekViewBody">
          <div className="WeekViewScrollableContent">
            <div className="WeekViewTimeAxis" aria-hidden="true">
              {Array.from({ length: 24 }, (_, hour) => (
                <div
                  key={hour}
                  className="WeekViewTimeAxisCell"
                  style={{ '--hour': hour } as React.CSSProperties}
                >
                  <time className="WeekViewTimeAxisText">
                    {hour === 0
                      ? null
                      : adapter.formatByString(adapter.setHours(today, hour), 'h:mm a')}
                  </time>
                </div>
              ))}
            </div>
            <div className="WeekViewGrid">
              {currentWeekDays.map((day) => {
                const dayKey = adapter.format(day, 'keyboardDate');
                const dayEvents = eventsByDay.get(dayKey) || [];
                return (
                  <TimeGrid.Column
                    key={day.day.toString()}
                    value={day}
                    className="WeekViewColumn"
                    data-weekend={isWeekend(adapter, day) ? '' : undefined}
                  >
                    {dayEvents.map((event: CalendarEvent) => (
                      <TimeGrid.Event
                        key={event.id}
                        start={event.start}
                        end={event.end}
                        className="WeekViewEvent"
                        aria-labelledby={`WeekViewHeaderCell-${day.day.toString()}`}
                      >
                        <time>
                          {adapter.formatByString(event.start, 'h:mma')} -{' '}
                          {adapter.formatByString(event.end, 'h:mma')}
                        </time>
                        <br />
                        <span>{event.title}</span>
                      </TimeGrid.Event>
                    ))}
                  </TimeGrid.Column>
                );
              })}
            </div>
          </div>
        </div>
      </TimeGrid.Root>
    </div>
  );
});
