'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { MonthViewProps } from './MonthView.types';
import { useEventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { selectors } from '../event-calendar/store';
import { useWeekList } from '../../primitives/use-week-list/useWeekList';
import { DayGrid } from '../../primitives/day-grid';
import { EventPopoverProvider } from '../internals/components/event-popover';
import { useTranslations } from '../internals/utils/TranslationsContext';
import MonthViewWeekRow from './month-view-row/MonthViewWeekRow';
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
    const handleRef = useMergedRefs(forwardedRef, containerRef);
    const cellRef = React.useRef<HTMLDivElement>(null);
    const [maxEvents, setMaxEvents] = React.useState<number>(4);

    const { store } = useEventCalendarContext();
    const visibleDate = useStore(store, selectors.visibleDate);
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
      <div
        ref={handleRef}
        className={clsx('MonthViewContainer', 'mui-x-scheduler', className)}
        {...other}
      >
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
