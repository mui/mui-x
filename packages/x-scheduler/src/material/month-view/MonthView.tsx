'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import { CalendarProcessedDate, CalendarViewConfig } from '../../primitives/models';
import { useInitializeView } from '../../primitives/utils/useInitializeView';
import { MonthViewProps } from './MonthView.types';
import { useEventCalendarStoreContext } from '../../primitives/utils/useEventCalendarStoreContext';
import { selectors } from '../../primitives/use-event-calendar';
import { DayGrid } from '../../primitives/day-grid';
import { EventPopoverProvider } from '../internals/components/event-popover';
import { useTranslations } from '../internals/utils/TranslationsContext';
import MonthViewWeekRow from './month-view-row/MonthViewWeekRow';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';
import { getDayList } from '../../primitives/utils/date-utils';
import './MonthView.css';

const CELL_PADDING = 8;
const DAY_NUMBER_HEADER_HEIGHT = 18;
const EVENT_HEIGHT = 18;
const EVENT_GAP = 5;

const viewConfig: CalendarViewConfig = {
  renderEventIn: 'every-day',
  siblingVisibleDateGetter: ({ adapter, date, delta }) =>
    adapter.addWeeks(adapter.startOfWeek(date), delta),
  getVisibleDays: ({ adapter, visibleDate, showWeekends }) =>
    getDayList({
      adapter,
      showWeekends,
      firstDay: adapter.startOfMonth(visibleDate),
      lastDay: adapter.endOfMonth(visibleDate),
    }),
};

export const MonthView = React.memo(
  React.forwardRef(function MonthView(
    props: MonthViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { className, ...other } = props;

    const adapter = useAdapter();
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useMergedRefs(forwardedRef, containerRef);
    const cellRef = React.useRef<HTMLDivElement>(null);
    const [maxEvents, setMaxEvents] = React.useState<number>(4);
    const store = useEventCalendarStoreContext();
    const preferences = useStore(store, selectors.preferences);
    const occurrencesMap = useStore(store, selectors.occurrencesByDayMap);
    const translations = useTranslations();
    const { days } = useInitializeView(viewConfig);

    const weeks = React.useMemo(() => {
      const tempWeeks: CalendarProcessedDate[][] = [];
      let lastDayWeekNumber: number | null = null;
      for (let i = 0; i < days.length; i += 1) {
        const lastWeek = tempWeeks[tempWeeks.length - 1];
        const day = days[i];
        const dayWeekNumber = adapter.getWeekNumber(day.value);
        const isNewWeek = lastDayWeekNumber !== dayWeekNumber;
        if (isNewWeek) {
          lastDayWeekNumber = dayWeekNumber;
          tempWeeks.push([day]);
        } else {
          lastWeek.push(day);
        }
      }
      return tempWeeks;
    }, [adapter, days]);

    useResizeObserver(
      cellRef,
      () => {
        const cellHeight = cellRef.current!.clientHeight;
        const eventContainerHeight = cellHeight - CELL_PADDING - DAY_NUMBER_HEADER_HEIGHT;
        const maxEventsCount = Math.floor(
          (eventContainerHeight + EVENT_GAP) / (EVENT_HEIGHT + EVENT_GAP),
        );
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
            <div
              className={clsx(
                'MonthViewHeader',
                'MonthViewRowGrid',
                preferences.showWeekNumber ? 'WithWeekNumber' : undefined,
              )}
            >
              {preferences.showWeekNumber && (
                <div className="MonthViewWeekHeaderCell">{translations.weekAbbreviation}</div>
              )}
              {weeks[0].map((weekDay) => (
                <div
                  key={weekDay.key}
                  id={`MonthViewHeaderCell-${weekDay.key}`}
                  role="columnheader"
                  className="MonthViewHeaderCell"
                  aria-label={adapter.format(weekDay.value, 'weekday')}
                >
                  {adapter.formatByString(weekDay.value, 'ccc')}
                </div>
              ))}
            </div>
            <div className="MonthViewBody">
              {weeks.map((week, weekIdx) => (
                <MonthViewWeekRow
                  key={weekIdx}
                  maxEvents={maxEvents}
                  days={week}
                  occurrencesMap={occurrencesMap}
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
