'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import { useDayList } from '@mui/x-scheduler-headless/use-day-list';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { useWeekList } from '@mui/x-scheduler-headless/use-week-list';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-headless/use-event-occurrences-grouped-by-day';
import { MonthViewProps } from './MonthView.types';
import { EventPopoverProvider } from '../internals/components/event-popover';
import { useTranslations } from '../internals/utils/TranslationsContext';
import MonthViewWeekRow from './month-view-row/MonthViewWeekRow';
import './MonthView.css';
import { RecurringScopeDialogProvider } from '../internals/components/scope-popover/ScopeDialog';

const CELL_PADDING = 8;
const DAY_NUMBER_HEADER_HEIGHT = 18;
const EVENT_HEIGHT = 18;
const EVENT_GAP = 5;

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

    const adapter = useAdapter();
    const store = useEventCalendarStoreContext();
    const showWeekends = useStore(store, selectors.showWeekends);
    const showWeekNumber = useStore(store, selectors.showWeekNumber);
    const visibleDate = useStore(store, selectors.visibleDate);
    const translations = useTranslations();

    const getDayList = useDayList();
    const getWeekList = useWeekList();
    const { weeks, days } = React.useMemo(() => {
      const weekFirstDays = getWeekList({
        date: adapter.startOfMonth(visibleDate),
        amount: 'end-of-month',
      });
      const tempWeeks = weekFirstDays.map((week) =>
        getDayList({ date: week, amount: 'week', excludeWeekends: !showWeekends }),
      );

      return { weeks: tempWeeks, days: tempWeeks.flat(1) };
    }, [adapter, getWeekList, getDayList, visibleDate, showWeekends]);

    const occurrencesMap = useEventOccurrencesGroupedByDay({ days, renderEventIn: 'every-day' });

    useEventCalendarView(() => ({
      siblingVisibleDateGetter: (date, delta) =>
        adapter.addMonths(adapter.startOfMonth(date), delta),
    }));

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
        <RecurringScopeDialogProvider containerRef={containerRef}>
          <EventPopoverProvider containerRef={containerRef}>
            <CalendarGrid.Root className="MonthViewRoot">
              <CalendarGrid.HeaderRow
                className={clsx(
                  'MonthViewHeader',
                  'MonthViewRowGrid',
                  showWeekNumber ? 'WithWeekNumber' : undefined,
                )}
              >
                {showWeekNumber && (
                  <div className="MonthViewWeekHeaderCell">{translations.weekAbbreviation}</div>
                )}
                {weeks[0].map((weekDay) => (
                  <CalendarGrid.HeaderCell
                    key={weekDay.key}
                    date={weekDay}
                    skipDataCurrent
                    className="MonthViewHeaderCell"
                  >
                    {adapter.formatByString(weekDay.value, 'ccc')}
                  </CalendarGrid.HeaderCell>
                ))}
              </CalendarGrid.HeaderRow>
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
            </CalendarGrid.Root>
          </EventPopoverProvider>
        </RecurringScopeDialogProvider>
      </div>
    );
  }),
);
