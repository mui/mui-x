'use client';
import * as React from 'react';
import { DateTime } from 'luxon';
import { TimeGrid } from '../../primitives/time-grid';
import { WeekViewProps } from './WeekView.types';
import './WeekView.css';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';

function getCurrentWeekDays() {
  const today = DateTime.fromISO('2025-05-26');
  const startOfWeek = today.startOf('week');
  return Array.from({ length: 7 }).map((_, i) => startOfWeek.plus({ days: i }));
}

export const WeekView = React.forwardRef(function WeekView(
  props: WeekViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const adapter = getAdapter();
  const weekDays = getCurrentWeekDays();

  return (
    <div ref={forwardedRef} className="WeekViewContainer">
      <TimeGrid.Root className="WeekViewRoot">
        <div className="WeekViewHeader">
          <div className="WeekViewGridRow WeekViewHeaderRow" role="row">
            <div className="WeekViewAllDayEventsCell" />
            {weekDays.map((day) => (
              <div
                key={day.day.toString()}
                className="WeekViewHeaderCell"
                id={`WeekViewHeaderCell-${day.day.toString()}`}
                role="columnheader"
                aria-label={`${adapter.formatByString(day, 'cccc')} ${adapter.format(day, 'dayOfMonth')}`}
              >
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
              All day
            </div>
            {weekDays.map((day) => (
              <div
                key={day.day.toString()}
                className="WeekViewAllDayEventsCell"
                aria-labelledby={`WeekViewHeaderCell-${day.day.toString()}`}
                role="gridcell"
                data-weekend={adapter.isWeekend(day) ? 'true' : undefined}
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
                      : adapter.formatByString(DateTime.now().set({ hour, minute: 0 }), 'h:mma')}
                  </time>
                </div>
              ))}
            </div>
            <div className="WeekViewGrid">
              {weekDays.map((day) => (
                <TimeGrid.Column
                  key={day.day.toString()}
                  value={day}
                  className={'WeekViewColumn'}
                  role="gridcell"
                  data-weekend={adapter.isWeekend(day) ? 'true' : undefined}
                >
                  {props.events
                    .filter((event) => event.start.hasSame(day, 'day'))
                    .map((event) => (
                      <TimeGrid.Event
                        key={event.id}
                        start={event.start}
                        end={event.end}
                        className="WeekViewEvent"
                        role="button"
                        aria-labelledby={`WeekViewHeaderCell-${day.day.toString()}`}
                        tabIndex={0}
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
              ))}
            </div>
          </div>
        </div>
      </TimeGrid.Root>
    </div>
  );
});
