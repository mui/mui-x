'use client';
import * as React from 'react';
import clsx from 'clsx';
import { SchedulerValidDate } from '@mui/x-scheduler/primitives/utils/adapter/types';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { TimeGrid as TimeGridPrimitive } from '../../../../primitives/time-grid';
import { TimeGridProps } from './TimeGrid.types';
import { CalendarEvent } from '../../../models/events';
import { isWeekend } from '../../../utils/date-utils';
import { useTranslations } from '../../../utils/TranslationsContext';
import './TimeGrid.css';

const adapter = getAdapter();

export const TimeGrid = React.forwardRef(function TimeGrid(
  props: TimeGridProps,
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

  const handleHeaderClick = React.useCallback(
    (event: React.MouseEvent) => {
      onDayHeaderClick?.(today, event);
    },
    [onDayHeaderClick, today],
  );

  const handleHeaderKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onDayHeaderClick?.(today, event);
      }
    },
    [onDayHeaderClick, today],
  );

  const renderHeaderContent = (day: SchedulerValidDate) => (
    <span className="TimeGridHeaderContent">
      {/* TODO: Add the 3 letter week day format to the adapter */}
      <span className="TimeGridHeaderDayName">{adapter.formatByString(day, 'ccc')}</span>
      <span className="TimeGridHeaderDayNumber">{adapter.format(day, 'dayOfMonth')}</span>
    </span>
  );

  return (
    <div ref={forwardedRef} className={clsx('TimeGridContainer', 'joy', className)} {...other}>
      <TimeGridPrimitive.Root className="TimeGridRoot">
        <div ref={headerWrapperRef} className="TimeGridHeader">
          <div className="TimeGridGridRow TimeGridHeaderRow" role="row">
            <div className="TimeGridAllDayEventsCell" />
            {days.map((day) => (
              <div
                key={day.day.toString()}
                id={`TimeGridHeaderCell-${day.day.toString()}`}
                role="columnheader"
                aria-label={`${adapter.format(day, 'weekday')} ${adapter.format(day, 'dayOfMonth')}`}
              >
                {onDayHeaderClick ? (
                  <button
                    type="button"
                    className="TimeGridHeaderButton"
                    onClick={handleHeaderClick}
                    onKeyDown={handleHeaderKeyDown}
                    tabIndex={0}
                  >
                    {renderHeaderContent(day)}
                  </button>
                ) : (
                  renderHeaderContent(day)
                )}
              </div>
            ))}
          </div>
          <div
            className={clsx('TimeGridGridRow', 'TimeGridAllDayEventsRow')}
            role="row"
            data-weekend={lastIsWeekend ? '' : undefined}
          >
            <div
              className="TimeGridAllDayEventsCell TimeGridAllDayEventsHeaderCell"
              role="columnheader"
            >
              {translations.allDay}
            </div>
            {days.map((day) => (
              <div
                key={day.day.toString()}
                className="TimeGridAllDayEventsCell"
                aria-labelledby={`TimeGridHeaderCell-${day.day.toString()}`}
                role="gridcell"
                data-weekend={isWeekend(adapter, day) ? '' : undefined}
              />
            ))}
          </div>
        </div>
        <div ref={bodyRef} className="TimeGridBody">
          <div className="TimeGridScrollableContent">
            <div className="TimeGridTimeAxis" aria-hidden="true">
              {Array.from({ length: 24 }, (_, hour) => (
                <div
                  key={hour}
                  className="TimeGridTimeAxisCell"
                  style={{ '--hour': hour } as React.CSSProperties}
                >
                  <time className="TimeGridTimeAxisText">
                    {hour === 0
                      ? null
                      : adapter.formatByString(adapter.setHours(today, hour), 'h:mm a')}
                  </time>
                </div>
              ))}
            </div>
            <div className="TimeGridGrid">
              {days.map((day) => {
                const dayKey = adapter.format(day, 'keyboardDate');
                const dayEvents = eventsByDay.get(dayKey) || [];
                return (
                  <TimeGridPrimitive.Column
                    key={day.day.toString()}
                    value={day}
                    className="TimeGridColumn"
                    data-weekend={isWeekend(adapter, day) ? '' : undefined}
                  >
                    {dayEvents.map((event: CalendarEvent) => (
                      <TimeGridPrimitive.Event
                        key={event.id}
                        start={event.start}
                        end={event.end}
                        className="TimeGridEvent"
                        aria-labelledby={`TimeGridHeaderCell-${day.day.toString()}`}
                      >
                        <time>
                          {adapter.formatByString(event.start, 'h:mma')} -{' '}
                          {adapter.formatByString(event.end, 'h:mma')}
                        </time>
                        <br />
                        <span>{event.title}</span>
                      </TimeGridPrimitive.Event>
                    ))}
                  </TimeGridPrimitive.Column>
                );
              })}
            </div>
          </div>
        </div>
      </TimeGridPrimitive.Root>
    </div>
  );
});
