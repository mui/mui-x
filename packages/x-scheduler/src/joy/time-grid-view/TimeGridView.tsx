'use client';
import * as React from 'react';
import clsx from 'clsx';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { TimeGrid } from '../../primitives/time-grid';
import { TimeGridViewProps } from './TimeGridView.types';
import { CalendarEvent } from '../models/events';
import { isWeekend } from '../utils/date-utils';
import { useTranslations } from '../utils/TranslationsContext';
import './TimeGridView.css';

const adapter = getAdapter();

export const TimeGridView = React.forwardRef(function TimeGridView(
  props: TimeGridViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, days, className, onDayHeaderClick, ...other } = props;

  const translations = useTranslations();
  const today = adapter.date('2025-05-26');
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
  }, [events]);

  React.useLayoutEffect(() => {
    const body = bodyRef.current;
    const header = headerWrapperRef.current;
    if (!body || !header) {
      return;
    }
    const hasScroll = body.scrollHeight > body.clientHeight;
    header.style.setProperty('--has-scroll', hasScroll ? '1' : '0');
  }, [events]);

  const lastIsWeekend = isWeekend(adapter, days[days.length - 1]);

  const handleHeaderClick = React.useCallback(() => {
    onDayHeaderClick?.();
  }, [onDayHeaderClick]);

  const handleHeaderKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onDayHeaderClick?.();
      }
    },
    [onDayHeaderClick],
  );

  return (
    <div ref={forwardedRef} className={clsx('TimeGridViewContainer', 'joy', className)} {...other}>
      <TimeGrid.Root className="TimeGridViewRoot">
        <div ref={headerWrapperRef} className="TimeGridViewHeader">
          <div className="TimeGridViewGridRow TimeGridViewHeaderRow" role="row">
            <div className="TimeGridViewAllDayEventsCell" />
            {days.map((day) => (
              <div
                key={day.day.toString()}
                onClick={handleHeaderClick}
                onKeyDown={handleHeaderKeyDown}
                tabIndex={0}
                className="TimeGridViewHeaderCell"
                id={`TimeGridViewHeaderCell-${day.day.toString()}`}
                role="columnheader"
                aria-label={`${adapter.format(day, 'weekday')} ${adapter.format(day, 'dayOfMonth')}`}
              >
                {/* TODO: Add the 3 letter week day format to the adapter */}
                <span className="TimeGridViewHeaderDayName">
                  {adapter.formatByString(day, 'ccc')}
                </span>
                <span className="TimeGridViewHeaderDayNumber">
                  {adapter.format(day, 'dayOfMonth')}
                </span>
              </div>
            ))}
          </div>
          <div
            className={clsx('TimeGridViewGridRow', 'TimeGridViewAllDayEventsRow')}
            role="row"
            data-weekend={lastIsWeekend ? '' : undefined}
          >
            <div
              className="TimeGridViewAllDayEventsCell TimeGridViewAllDayEventsHeaderCell"
              role="columnheader"
            >
              {translations.allDay}
            </div>
            {days.map((day) => (
              <div
                key={day.day.toString()}
                className="TimeGridViewAllDayEventsCell"
                aria-labelledby={`TimeGridViewHeaderCell-${day.day.toString()}`}
                role="gridcell"
                data-weekend={isWeekend(adapter, day) ? '' : undefined}
              />
            ))}
          </div>
        </div>
        <div ref={bodyRef} className="TimeGridViewBody">
          <div className="TimeGridViewScrollableContent">
            <div className="TimeGridViewTimeAxis" aria-hidden="true">
              {Array.from({ length: 24 }, (_, hour) => (
                <div
                  key={hour}
                  className="TimeGridViewTimeAxisCell"
                  style={{ '--hour': hour } as React.CSSProperties}
                >
                  <time className="TimeGridViewTimeAxisText">
                    {hour === 0
                      ? null
                      : adapter.formatByString(adapter.setHours(today, hour), 'h:mm a')}
                  </time>
                </div>
              ))}
            </div>
            <div className="TimeGridViewGrid">
              {days.map((day) => {
                const dayKey = adapter.format(day, 'keyboardDate');
                const dayEvents = eventsByDay.get(dayKey) || [];
                return (
                  <TimeGrid.Column
                    key={day.day.toString()}
                    value={day}
                    className="TimeGridViewColumn"
                    data-weekend={isWeekend(adapter, day) ? '' : undefined}
                  >
                    {dayEvents.map((event: CalendarEvent) => (
                      <TimeGrid.Event
                        key={event.id}
                        start={event.start}
                        end={event.end}
                        className="TimeGridViewEvent"
                        aria-labelledby={`TimeGridViewHeaderCell-${day.day.toString()}`}
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
