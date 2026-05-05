'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { createSelectorMemoized, useStore } from '@base-ui/utils/store';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import {
  EventCalendarViewConfig,
  GridRowType,
  SchedulerProcessedDate,
} from '@mui/x-scheduler-internals/models';
import { getDayList } from '@mui/x-scheduler-internals/get-day-list';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import type { EventCalendarState as State } from '@mui/x-scheduler-internals/use-event-calendar';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-internals/use-event-occurrences-grouped-by-day';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import clsx from 'clsx';
import { MonthViewProps } from './MonthView.types';
import MonthViewWeekRow from './month-view-row/MonthViewWeekRow';
import { MoreEventsPopoverProvider } from '../internals/components/more-events-popover';
import { useEventCalendarStyledContext } from '../event-calendar/EventCalendarStyledContext';

const FIXED_CELL_WIDTH = 28;

const MonthViewRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MonthView',
})(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '100%',
  overflowY: 'auto',
}));

const MonthViewGrid = styled(CalendarGrid.Root, {
  name: 'MuiEventCalendar',
  slot: 'MonthViewGrid',
})({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
});

interface MonthViewRowGridProps {
  showWeekNumber?: boolean;
}

const MonthViewHeader = styled(CalendarGrid.HeaderRow, {
  name: 'MuiEventCalendar',
  slot: 'MonthViewHeader',
})<{ ownerState: MonthViewRowGridProps }>(({ theme, ownerState }) => ({
  display: 'grid',
  gridTemplateColumns: ownerState.showWeekNumber
    ? `${FIXED_CELL_WIDTH}px repeat(auto-fit, minmax(0, 1fr))`
    : 'repeat(auto-fit, minmax(0, 1fr))',
  borderBlockEnd: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const MonthViewHeaderCell = styled(CalendarGrid.HeaderCell, {
  name: 'MuiEventCalendar',
  slot: 'MonthViewHeaderCell',
})(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  fontSize: theme.typography.body2.fontSize,
  lineHeight: '18px',
  '&:not(:first-of-type)': {
    borderInlineStart: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
  '&:focus-visible': {
    outline: 'none',
    borderRadius: theme.shape.borderRadius,
    boxShadow: `inset 0 0 0 2px ${(theme.vars || theme).palette.primary.main}`,
  },
}));

const MonthViewWeekHeaderCell = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MonthViewWeekHeaderCell',
})(({ theme }) => ({
  padding: theme.spacing(1, 0),
  textAlign: 'center',
  fontSize: theme.typography.caption.fontSize,
  lineHeight: '18px',
  color: (theme.vars || theme).palette.text.secondary,
  fontStyle: 'italic',
}));

const MonthViewBody = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MonthViewBody',
})({
  flex: 1,
  display: 'grid',
  gridAutoRows: 'minmax(0, 1fr)',
  position: 'relative',
  flexGrow: 1,
  overflow: 'hidden',
});

const MONTH_VIEW_ROW_TYPES: GridRowType[] = ['header', 'day-grid'];

const CELL_PADDING = 5; // theme.spacing(0.5) * 2
const DAY_NUMBER_HEADER_HEIGHT = 22; // event height (18px) + gap (4px)
const EVENT_HEIGHT = 18;
const EVENT_GAP = 4; // theme.spacing(0.5) = 4px

const MONTH_VIEW_CONFIG: EventCalendarViewConfig = {
  siblingVisibleDateGetter: ({ state, delta }) =>
    state.adapter.addMonths(
      state.adapter.startOfMonth(schedulerOtherSelectors.visibleDate(state)),
      delta,
    ),
  visibleDaysSelector: createSelectorMemoized(
    (state: State) => state.adapter,
    schedulerOtherSelectors.visibleDate,
    eventCalendarPreferenceSelectors.showWeekends,
    (adapter, visibleDate, showWeekends) =>
      getDayList({
        adapter,
        start: adapter.startOfWeek(adapter.startOfMonth(visibleDate)),
        end: adapter.endOfWeek(adapter.endOfMonth(visibleDate)),
        excludeWeekends: !showWeekends,
      }),
  ),
};

/**
 * A Month View to use inside the Event Calendar.
 */
export const MonthView = React.memo(
  React.forwardRef(function MonthView(
    props: MonthViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Context hooks
    const adapter = useAdapterContext();
    const { classes, localeText } = useEventCalendarStyledContext();
    const store = useEventCalendarStoreContext();

    // Ref hooks
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useMergedRefs(forwardedRef, containerRef);
    const cellRef = React.useRef<HTMLDivElement>(null);

    // Selector hooks
    const showWeekNumber = useStore(store, eventCalendarPreferenceSelectors.showWeekNumber);

    // State hooks
    const [maxEvents, setMaxEvents] = React.useState<number>(2);

    // Feature hooks
    const { days } = useEventCalendarView(MONTH_VIEW_CONFIG);

    const weeks = React.useMemo(() => {
      const tempWeeks: SchedulerProcessedDate[][] = [];
      let weekNumber: number | null = null;
      for (const day of days) {
        const prevWeek = tempWeeks[tempWeeks.length - 1];
        const dayWeekNumber = adapter.getWeekNumber(day.value);
        if (weekNumber !== dayWeekNumber) {
          weekNumber = dayWeekNumber;
          tempWeeks.push([day]);
        } else {
          prevWeek.push(day);
        }
      }
      return tempWeeks;
    }, [adapter, days]);

    const monthViewRowsPerType = React.useMemo(
      () => ({ 'day-grid': weeks.length }) as const,
      [weeks.length],
    );

    const occurrencesMap = useEventOccurrencesGroupedByDay({ days });

    useResizeObserver(
      cellRef,
      () => {
        const cellHeight = cellRef.current!.clientHeight;
        const eventContainerHeight = cellHeight - CELL_PADDING - DAY_NUMBER_HEADER_HEIGHT;
        const maxEventsCount = Math.floor(eventContainerHeight / (EVENT_HEIGHT + EVENT_GAP));
        setMaxEvents(Math.max(1, maxEventsCount));
      },
      true,
    );

    return (
      <MonthViewRoot
        {...props}
        ref={handleRef}
        className={clsx(props.className, classes.monthView)}
      >
        <MoreEventsPopoverProvider>
          <MonthViewGrid
            className={classes.monthViewGrid}
            rowTypes={MONTH_VIEW_ROW_TYPES}
            rowsPerType={monthViewRowsPerType}
          >
            <MonthViewHeader className={classes.monthViewHeader} ownerState={{ showWeekNumber }}>
              {showWeekNumber && (
                <MonthViewWeekHeaderCell className={classes.monthViewWeekHeaderCell}>
                  {localeText.weekAbbreviation}
                </MonthViewWeekHeaderCell>
              )}
              {weeks[0].map((weekDay) => (
                <MonthViewHeaderCell
                  className={classes.monthViewHeaderCell}
                  key={weekDay.key}
                  date={weekDay}
                  skipDataCurrent
                >
                  {adapter.formatByString(weekDay.value, 'ccc')}
                </MonthViewHeaderCell>
              ))}
            </MonthViewHeader>
            <MonthViewBody className={classes.monthViewBody}>
              {weeks.map((week, weekIdx) => (
                <MonthViewWeekRow
                  key={weekIdx}
                  rowIndex={weekIdx}
                  maxEvents={maxEvents}
                  days={week}
                  occurrencesMap={occurrencesMap}
                  firstDayRef={weekIdx === 0 ? cellRef : undefined}
                />
              ))}
            </MonthViewBody>
          </MonthViewGrid>
        </MoreEventsPopoverProvider>
      </MonthViewRoot>
    );
  }),
);
