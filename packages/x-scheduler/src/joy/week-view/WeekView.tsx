'use client';
import * as React from 'react';
import { DateTime } from 'luxon';
import { TimeGridRoot } from '../../primitives/time-grid/root/TimeGridRoot';
import { TimeGridColumn } from '../../primitives/time-grid/column/TimeGridColumn';
import { TimeGridEvent } from '../../primitives/time-grid/event/TimeGridEvent';
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
      <TimeGridRoot className="WeekViewRoot">
        <div className="WeekViewHeader">
          <div className="WeekViewGridRow WeekViewHeaderRow" role="row">
            <div className="WeekViewAllDayEventsCell" />
            {weekDays.map((day) => (
              <div
                key={day.day.toString()}
                className="WeekViewHeaderCell"
                id={`WeekViewHeaderCell-${day.day.toString()}`}
                role="columnheader"
              >
                {adapter.formatByString(day, 'ccc')} {adapter.format(day, 'dayOfMonth')}
              </div>
            ))}
          </div>
          <div className="WeekViewGridRow WeekViewAllDayEventsRow" role="row">
            <div className="WeekViewAllDayEventsCell" role="columnheader">
              All day
            </div>
            {weekDays.map((day) => (
              <div
                key={day.day.toString()}
                className="WeekViewAllDayEventsCell"
                aria-labelledby={`WeekViewHeaderCell-${day.day.toString()}`}
                role="gridcell"
              >
                -
              </div>
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
                  {hour === 0
                    ? null
                    : adapter.formatByString(DateTime.now().set({ hour, minute: 0 }), 'hh:mm a')}
                </div>
              ))}
            </div>
            <div className="WeekViewGrid">
              {weekDays.map((day) => (
                <TimeGridColumn
                  key={day.day.toString()}
                  value={day}
                  className={'WeekViewColumn'}
                  role="gridcell"
                >
                  {props.events
                    .filter((event) => event.start.hasSame(day, 'day'))
                    .map((event) => (
                      <TimeGridEvent
                        key={event.id}
                        start={event.start}
                        end={event.end}
                        className="WeekViewEvent"
                        role="button"
                        aria-labelledby={`WeekViewHeaderCell-${day.day.toString()}`}
                        tabIndex={0}
                      >
                        <div>{adapter.formatByString(event.start, 'hh a')}</div>
                        <div>{event.title}</div>
                      </TimeGridEvent>
                    ))}
                </TimeGridColumn>
              ))}
            </div>
          </div>
        </div>
      </TimeGridRoot>
    </div>
  );
});
