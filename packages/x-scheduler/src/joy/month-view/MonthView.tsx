'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useForkRef } from '@base-ui-components/react/utils';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { MonthViewProps } from './MonthView.types';
import { useEventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { useSelector } from '../../base-ui-copy/utils/store';
import { selectors } from '../event-calendar/store';
import { useWeekList } from '../../primitives/use-week-list/useWeekList';
import { DayGrid } from '../../primitives/day-grid';
import { DayGridEvent } from '../internals/components/event/day-grid-event/DayGridEvent';
import { EventPopoverProvider, EventPopoverTrigger } from '../internals/components/event-popover';
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
    const { className, ...other } = props;
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useForkRef(forwardedRef, containerRef);
    const cellRef = React.useRef<HTMLDivElement>(null);
    const [maxEvents, setMaxEvents] = React.useState<number>(4);

    const { store } = useEventCalendarContext();
    const visibleDate = useSelector(store, selectors.visibleDate);
    const translations = useTranslations();

    const getDayList = useDayList();
    const getWeekList = useWeekList();
    const weeks = React.useMemo(
      () =>
        getWeekList({
          date: adapter.startOfMonth(visibleDate),
          amount: 'end-of-month',
        }),
      [getWeekList, visibleDate],
    );

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
        <EventPopoverProvider containerRef={containerRef}>
          <DayGrid.Root className="MonthViewRoot">
            <div className="MonthViewHeader">
              <div className="MonthViewWeekHeaderCell">{translations.weekAbbreviation}</div>
              {getDayList({ date: weeks[0], amount: 7 }).map((day) => (
                <div
                  key={day.toString()}
                  id={`MonthViewHeaderCell-${day.toString()}`}
                  role="columnheader"
                  className="MonthViewHeaderCell"
                  aria-label={adapter.format(day, 'weekday')}
                >
                  {adapter.formatByString(day, 'ccc')}
                </div>
              ))}
            </div>
            <div className="MonthViewBody">
              {weeks.map((week, weekIdx) => (
                <MonthViewWeekRow
                  key={weekIdx}
                  maxEvents={maxEvents}
                  week={week}
                  firstDayRef={weekIdx === 0 ? cellRef : undefined}
                />
              ))}
            </div>
          </DayGrid.Root>
        </EventPopoverProvider>
      </div>
    );
  }),
);

function MonthViewWeekRow(props: MonthViewWeekRowProps) {
  const { maxEvents, week, firstDayRef } = props;

  const { store, instance } = useEventCalendarContext();
  const resourcesByIdMap = useSelector(store, selectors.resourcesByIdMap);
  const hasDayView = useSelector(store, selectors.hasDayView);
  const visibleDate = useSelector(store, selectors.visibleDate);
  const today = adapter.date();
  const translations = useTranslations();

  const getDayList = useDayList();
  const days = React.useMemo(() => getDayList({ date: week, amount: 7 }), [getDayList, week]);

  const daysWithEvents = useSelector(store, selectors.eventsToRenderGroupedByDay, {
    days,
    shouldOnlyRenderEventInOneCell: false,
  });

  const weekNumber = adapter.getWeekNumber(week);

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
    <DayGrid.Row key={weekNumber} className="MonthViewRow">
      <div
        className="MonthViewWeekNumberCell"
        role="rowheader"
        aria-label={translations.weekNumberAriaLabel(weekNumber)}
      >
        {weekNumber}
      </div>
      {daysWithEvents.map(({ day, events }, dayIdx) => {
        const isCurrentMonth = adapter.isSameMonth(day, visibleDate);
        const isToday = adapter.isSameDay(day, today);

        const visibleEvents = events.slice(0, maxEvents);
        const hiddenCount = events.length - maxEvents;
        return (
          <DayGrid.Cell
            ref={dayIdx === 0 ? firstDayRef : undefined}
            key={day.toString()}
            className={clsx(
              'MonthViewCell',
              !isCurrentMonth && 'OtherMonth',
              isToday && 'Today',
              isWeekend(adapter, day) && 'Weekend',
            )}
          >
            {hasDayView ? (
              <button
                type="button"
                className="MonthViewCellNumberButton"
                onClick={(event) => instance.switchToDay(day, event)}
                tabIndex={0}
              >
                {renderCellNumberContent(day)}
              </button>
            ) : (
              renderCellNumberContent(day)
            )}
            {visibleEvents.map((event) => (
              <EventPopoverTrigger
                key={event.id}
                event={event}
                render={
                  <DayGridEvent
                    event={event}
                    eventResource={resourcesByIdMap.get(event.resource)}
                    variant="compact"
                    ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
                  />
                }
              />
            ))}
            {hiddenCount > 0 && events.length > 0 && (
              <p className="MonthViewMoreEvents">{translations.hiddenEvents(hiddenCount)}</p>
            )}
          </DayGrid.Cell>
        );
      })}
    </DayGrid.Row>
  );
}

interface MonthViewWeekRowProps {
  maxEvents: number;
  week: SchedulerValidDate;
  firstDayRef: React.Ref<HTMLDivElement | null> | undefined;
}
