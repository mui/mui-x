'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useForkRef } from '@base-ui-components/react/utils';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { MonthViewProps } from './MonthView.types';
import { useEventCalendarStore } from '../internals/hooks/useEventCalendarStore';
import { useSelector } from '../../base-ui-copy/utils/store';
import { selectors } from '../event-calendar/store';
import { useWeekList } from '../../primitives/use-week-list/useWeekList';
import { DayGrid } from '../../primitives/day-grid';
import { DayGridEvent } from '../internals/components/event/day-grid-event/DayGridEvent';
import { EventPopoverProvider } from '../internals/utils/EventPopoverProvider';
import { SchedulerValidDate } from '../../primitives/models';
import { isWeekend } from '../internals/utils/date-utils';
import { useTranslations } from '../internals/utils/TranslationsContext';
import './MonthView.css';

const adapter = getAdapter();
const EVENT_HEIGHT = 22;
const CELL_PADDING = 8;
const DAY_NUMBER_HEADER_HEIGHT = 18;
const HIDDEN_EVENTS_HEIGHT = 18;

export const MonthView = React.memo(
  React.forwardRef(function MonthView(
    props: MonthViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { className, onDayHeaderClick, onEventsChange, ...other } = props;
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useForkRef(forwardedRef, containerRef);
    const cellRef = React.useRef<HTMLDivElement>(null);
    const [maxEvents, setMaxEvents] = React.useState<number>(4);

    const store = useEventCalendarStore();
    const visibleDate = useSelector(store, selectors.visibleDate);
    const resourcesByIdMap = useSelector(store, selectors.resourcesByIdMap);
    // TODO: Temporary fake today until Issue 17698 is resolved.
    const today = adapter.date('2025-05-26');
    const translations = useTranslations();

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

    useResizeObserver(
      cellRef,
      () => {
        const cellHeight = cellRef.current!.clientHeight;
        const availableHeight =
          cellHeight - CELL_PADDING - DAY_NUMBER_HEADER_HEIGHT - HIDDEN_EVENTS_HEIGHT;
        const maxEventsCount = Math.floor(availableHeight / EVENT_HEIGHT);
        setMaxEvents(maxEventsCount);
      },
      true,
    );

    return (
      <div ref={handleRef} className={clsx('MonthViewContainer', 'joy', className)} {...other}>
        <EventPopoverProvider containerRef={containerRef} onEventsChange={onEventsChange}>
          {({ onEventClick }) => (
            <DayGrid.Root className="MonthViewRoot">
              <div className="MonthViewHeader">
                <div className="MonthViewWeekHeaderCell">{translations.weekAbbreviation}</div>
                {weeks[0].map((day) => (
                  <div
                    key={day.date.toString()}
                    id={`MonthViewHeaderCell-${day.date.toString()}`}
                    role="columnheader"
                    className="MonthViewHeaderCell"
                    aria-label={adapter.format(day.date, 'weekday')}
                  >
                    {adapter.formatByString(day.date, 'ccc')}
                  </div>
                ))}
              </div>
              <div className="MonthViewBody">
                {weeks.map((week, weekIdx) => {
                  const weekNumer = adapter.getWeekNumber(week[0].date);
                  return (
                    <DayGrid.Row key={weekNumer} className="MonthViewRow">
                      <div
                        className="MonthViewWeekNumberCell"
                        role="rowheader"
                        aria-label={`${translations.weekNumberAriaLabel}: ${weekNumer}`}
                      >
                        {weekNumer}
                      </div>
                      {week.map((day, dayIdx) => {
                        const isCurrentMonth = adapter.isSameMonth(day.date, visibleDate);
                        const isToday = adapter.isSameDay(day.date, today);

                        const visibleEvents = day.events.slice(0, maxEvents);
                        const hiddenCount = day.events.length - maxEvents;
                        return (
                          <DayGrid.Cell
                            ref={weekIdx === 0 && dayIdx === 0 ? cellRef : undefined}
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
                            {visibleEvents.map((eventProp) => (
                              <DayGridEvent
                                key={eventProp.id}
                                event={eventProp}
                                eventResource={resourcesByIdMap.get(eventProp.resource)}
                                variant="compact"
                                ariaLabelledBy={`MonthViewHeaderCell-${day.date.toString()}`}
                                onEventClick={onEventClick}
                              />
                            ))}
                            {hiddenCount > 0 && day.events.length > 0 && (
                              <p className="MonthViewMoreEvents">{hiddenCount} more...</p>
                            )}
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
