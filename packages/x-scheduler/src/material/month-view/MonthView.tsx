'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { useInitializeView } from '../../primitives/utils/useInitializeView';
import { MonthViewProps } from './MonthView.types';
import { useEventCalendarStoreContext } from '../../primitives/utils/useEventCalendarStoreContext';
import { selectors } from '../../primitives/use-event-calendar';
import { useWeekList } from '../../primitives/use-week-list/useWeekList';
import { DayGrid } from '../../primitives/day-grid';
import { EventPopoverProvider } from '../internals/components/event-popover';
import { useTranslations } from '../internals/utils/TranslationsContext';
import MonthViewWeekRow from './month-view-row/MonthViewWeekRow';
import { useEventOccurrencesGroupedByDay } from '../../primitives/use-event-occurrences-grouped-by-day';
import './MonthView.css';
import { MoreEventsPopoverProvider } from '../internals/components/more-events-popover';

const adapter = getAdapter();
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

    const store = useEventCalendarStoreContext();
    const preferences = useStore(store, selectors.preferences);
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
        getDayList({ date: week, amount: 'week', excludeWeekends: !preferences.showWeekends }),
      );

      return { weeks: tempWeeks, days: tempWeeks.flat(1) };
    }, [getWeekList, getDayList, visibleDate, preferences.showWeekends]);

    const occurrencesMap = useEventOccurrencesGroupedByDay({ days, renderEventIn: 'every-day' });

    useInitializeView(() => ({
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
        <EventPopoverProvider containerRef={containerRef}>
          <MoreEventsPopoverProvider containerRef={containerRef}>
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
          </MoreEventsPopoverProvider>
        </EventPopoverProvider>
      </div>
    );
  }),
);
