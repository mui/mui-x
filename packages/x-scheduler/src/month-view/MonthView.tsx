'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { createSelectorMemoized, useStore } from '@base-ui/utils/store';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import { EventCalendarViewConfig, SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import {
  useExtractEventCalendarParameters,
  EventCalendarState as State,
} from '@mui/x-scheduler-headless/use-event-calendar';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-headless/use-event-occurrences-grouped-by-day';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { MonthViewProps, StandaloneMonthViewProps } from './MonthView.types';
import { EventPopoverProvider } from '../internals/components/event-popover/EventPopover';
import { useTranslations } from '../internals/utils/TranslationsContext';
import MonthViewWeekRow from './month-view-row/MonthViewWeekRow';
import { MoreEventsPopoverProvider } from '../internals/components/more-events-popover';
import '../index.css';

const FIXED_CELL_WIDTH = 28;

const MonthViewRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MonthView',
})(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '100%',
}));

const MonthViewGrid = styled(CalendarGrid.Root, {
  name: 'MuiEventCalendar',
  slot: 'MonthViewGrid',
})({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '100%',
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
  borderBlockEnd: `1px solid ${theme.palette.divider}`,
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
    borderInlineStart: `1px solid ${theme.palette.divider}`,
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
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
}));

const MonthViewBody = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MonthViewBody',
})({
  flex: 1,
  display: 'grid',
  gridAutoRows: '1fr',
  maxHeight: '100%',
});

// TODO: Replace with a proper loading overlay component that is shared across views
const MonthViewLoadingOverlay = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'MonthViewLoadingOverlay',
})(({ theme }) => ({
  position: 'absolute',
  fontSize: theme.typography.body1.fontSize,
  padding: 2,
  color: theme.palette.text.secondary,
  zIndex: 1,
}));

const CELL_PADDING = 8;
const DAY_NUMBER_HEADER_HEIGHT = 18;
const EVENT_HEIGHT = 18;
const EVENT_GAP = 5;

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
    const adapter = useAdapter();
    const translations = useTranslations();
    const store = useEventCalendarStoreContext();

    // Ref hooks
    const containerRef = React.useRef<HTMLElement | null>(null);
    const handleRef = useMergedRefs(forwardedRef, containerRef);
    const cellRef = React.useRef<HTMLDivElement>(null);

    // Selector hooks
    const showWeekNumber = useStore(store, eventCalendarPreferenceSelectors.showWeekNumber);
    const isLoading = useStore(store, schedulerOtherSelectors.isLoading);

    // State hooks
    const [maxEvents, setMaxEvents] = React.useState<number>(4);

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

    const occurrencesMap = useEventOccurrencesGroupedByDay({ days });

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
      <MonthViewRoot {...props} ref={handleRef}>
        <EventPopoverProvider containerRef={containerRef}>
          <MoreEventsPopoverProvider containerRef={containerRef}>
            <MonthViewGrid>
              <MonthViewHeader ownerState={{ showWeekNumber }}>
                {showWeekNumber && (
                  <MonthViewWeekHeaderCell>{translations.weekAbbreviation}</MonthViewWeekHeaderCell>
                )}
                {weeks[0].map((weekDay) => (
                  <MonthViewHeaderCell key={weekDay.key} date={weekDay} skipDataCurrent>
                    {adapter.formatByString(weekDay.value, 'ccc')}
                  </MonthViewHeaderCell>
                ))}
              </MonthViewHeader>
              <MonthViewBody>
                {isLoading && (
                  <MonthViewLoadingOverlay>{translations.loading}</MonthViewLoadingOverlay>
                )}

                {weeks.map((week, weekIdx) => (
                  <MonthViewWeekRow
                    key={weekIdx}
                    maxEvents={maxEvents}
                    days={week}
                    occurrencesMap={occurrencesMap}
                    firstDayRef={weekIdx === 0 ? cellRef : undefined}
                  />
                ))}
              </MonthViewBody>
            </MonthViewGrid>
          </MoreEventsPopoverProvider>
        </EventPopoverProvider>
      </MonthViewRoot>
    );
  }),
);

/**
 * A Month View that can be used outside of the Event Calendar.
 */
export const StandaloneMonthView = React.forwardRef(function StandaloneMonthView<
  TEvent extends object,
  TResource extends object,
>(
  props: StandaloneMonthViewProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { parameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    typeof props
  >(props);

  return (
    <EventCalendarProvider {...parameters}>
      <MonthView ref={forwardedRef} {...forwardedProps} />
    </EventCalendarProvider>
  );
}) as StandaloneMonthViewComponent;

type StandaloneMonthViewComponent = <TEvent extends object, TResource extends object>(
  props: StandaloneMonthViewProps<TEvent, TResource> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.JSX.Element;
