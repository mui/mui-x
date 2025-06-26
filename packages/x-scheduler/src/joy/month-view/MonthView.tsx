'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useForkRef } from '@base-ui-components/react/utils';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { MonthViewProps } from './MonthView.types';
import { useEventCalendarStore } from '../internals/hooks/useEventCalendarStore';
import { useSelector } from '../../base-ui-copy/utils/store';
import { selectors } from '../event-calendar/store';
import { useWeekList } from '../../primitives/use-week-list/useWeekList';
import { DayGrid } from '../../primitives/day-grid';
import { EventPopoverProvider } from '../internals/utils/EventPopoverProvider';
import { SchedulerValidDate } from '../../primitives/models';
import { isWeekend } from '../internals/utils/date-utils';

import './MonthView.css';

const adapter = getAdapter();

export const MonthView = React.memo(
  React.forwardRef(function MonthView(
    props: MonthViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { className, onDayHeaderClick, onEventsChange, ...other } = props;
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useForkRef(forwardedRef, containerRef);

    const store = useEventCalendarStore();
    const visibleDate = useSelector(store, selectors.visibleDate);
    const today = adapter.date();

    const getWeekList = useWeekList();
    const getDayList = useDayList();
    const getEventsStartingInDay = useSelector(store, selectors.getEventsStartingInDay);

    const weeks = React.useMemo(() => {
      const weeksFirstDays = getWeekList({
        date: adapter.startOfMonth(visibleDate),
        amount: 'end-of-month',
      });

      return weeksFirstDays.map((weekStart) => {
        const weekDays = getDayList({ date: weekStart, amount: 7 });
        return weekDays.map((date) => ({
          date,
          events: getEventsStartingInDay(date),
        }));
      });
    }, [getWeekList, visibleDate, getDayList, getEventsStartingInDay]);

    const handleHeaderClick = React.useCallback(
      (day: SchedulerValidDate) => (event: React.MouseEvent) => {
        onDayHeaderClick?.(day, event);
      },
      [onDayHeaderClick],
    );

    const renderCellNumberContent = (day: SchedulerValidDate) => {
      const isFirstDayOfMonth = adapter.isSameDay(day, adapter.startOfMonth(day));
      return (
        <span className="MonthViewCellNumber">
          {isFirstDayOfMonth
            ? adapter.formatByString(day, adapter.formats.shortDate)
            : adapter.formatByString(day, adapter.formats.dayOfMonth)}
        </span>
      );
    };

    return (
      <div ref={handleRef} className={clsx('MonthViewContainer', 'joy', className)} {...other}>
        <EventPopoverProvider containerRef={containerRef} onEventsChange={onEventsChange}>
          {({ onEventClick }) => (
            <DayGrid.Root className="MonthViewRoot">
              <div className="MonthViewHeader">
                <div className="MonthViewWeekHeaderCell">W</div>
                {weeks[0].map((day) => (
                  <div
                    key={day.date.toString()}
                    id={`MonthViewHeaderCell-${day.date.toString()}`}
                    role="columnheader"
                    className="MonthViewHeaderCell"
                    aria-label={`${adapter.format(day.date, 'weekday')}`}
                  >
                    {adapter.formatByString(day.date, 'ccc')}
                  </div>
                ))}
              </div>
              <div className="MonthViewBody">
                {weeks.map((week) => {
                  const weekNumer = adapter.getWeekNumber(week[0].date);
                  return (
                    <DayGrid.Row key={weekNumer} className="MonthViewRow">
                      <div
                        className="MonthViewWeekNumberCell"
                        role="rowheader"
                        aria-label={`Week ${weekNumer}`}
                      >
                        {weekNumer}
                      </div>
                      {week.map((day) => {
                        const isCurrentMonth = adapter.isSameMonth(day.date, visibleDate);
                        const isToday = adapter.isSameDay(day.date, today);
                        return (
                          <DayGrid.Cell
                            key={day.date.toString()}
                            className={clsx(
                              'MonthViewCell',
                              !isCurrentMonth && 'OtherMonth',
                              isToday && 'Today',
                              isWeekend(adapter, day.date) && 'Weekend',
                            )}
                          >
                            {onDayHeaderClick ? (
                              <button
                                type="button"
                                className="MonthViewCellNumberButton"
                                onClick={handleHeaderClick(day.date)}
                                tabIndex={0}
                              >
                                {renderCellNumberContent(day.date)}
                              </button>
                            ) : (
                              renderCellNumberContent(day.date)
                            )}
                            {day.events.map((eventProp) => (
                              <DayGrid.Event
                                key={eventProp.id}
                                start={eventProp.start}
                                end={eventProp.end}
                                onClick={(event) => onEventClick(event, eventProp)}
                              >
                                <span data-resource={eventProp.resource} />
                                <span>{eventProp.title}</span>
                              </DayGrid.Event>
                            ))}
                          </DayGrid.Cell>
                        );
                      })}
                    </DayGrid.Row>
                  );
                })}
              </div>
            </DayGrid.Root>
          )}
        </EventPopoverProvider>
      </div>
    );
  }),
);
