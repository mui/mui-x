'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useStore } from '@base-ui/utils/store';
import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-headless/use-event-occurrences-grouped-by-day';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { eventCalendarViewSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { SchedulerEventOccurrence, SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  schedulerNowSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { DayTimeGridProps } from './DayTimeGrid.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { EventPopoverProvider } from '../../../internals/components/event-popover/EventPopover';
import { TimeGridColumn } from './TimeGridColumn';
import { DayGridCell } from './DayGridCell';
import { useFormatTime } from '../../../internals/hooks/useFormatTime';
import { isOccurrenceAllDayOrMultipleDay } from '../../utils/event-utils';

const FIXED_CELL_WIDTH = 68;
const HOUR_HEIGHT = 46;
const HOURS_IN_DAY = 24;

// Helper functions for shared styles
const getDividerBorder = (theme: any) => `1px solid ${theme.palette.divider}`;
const getChildBorderRightStyle = (theme: any) => ({
  '& > *:not(:last-child)': {
    borderRight: getDividerBorder(theme),
  },
});

const DayTimeGridContainer = styled(CalendarGrid.Root, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridContainer',
})(({ theme }) => ({
  '--fixed-cell-width': `${FIXED_CELL_WIDTH}px`,
  '--hour-height': `${HOUR_HEIGHT}px`,
  '--has-scroll': 1,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  border: getDividerBorder(theme),
  borderRadius: theme.shape.borderRadius,
  maxHeight: '100%',
}));

const DayTimeGridRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridRoot',
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflowY: 'auto',
});

const DayTimeGridHeader = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridHeader',
})({
  display: 'flex',
  flexDirection: 'column',
});

const DayTimeGridHeaderRow = styled(CalendarGrid.HeaderRow, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridHeaderRow',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(var(--fixed-cell-width), auto) repeat(auto-fit, minmax(0, 1fr))',
  width: '100%',
  borderBottom: getDividerBorder(theme),
}));

const DayTimeGridAllDayEventsGrid = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventsGrid',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'var(--fixed-cell-width) repeat(var(--column-count), 1fr) fit-content(100%)',
  width: '100%',
  borderBottom: getDividerBorder(theme),
  /* Only show border on header cell when there's no scrollbar */
  '&:not([data-has-scroll]) .MuiEventCalendar-DayTimeGridAllDayEventsHeaderCell': {
    borderRight: getDividerBorder(theme),
  },
  '&[data-has-scroll] .ScrollablePlaceholder': {
    overflowY: 'scroll',
    scrollbarGutter: 'stable',
    height: '100%',
    gridColumn: '-1',
    /* Make scrollbar invisible by setting transparent colors */
    scrollbarColor: 'transparent transparent',
    background: 'transparent',
    /* Webkit browsers (Chrome, Safari, Edge) */
    '&::-webkit-scrollbar': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
  },
  /* Weekend columns show visible scrollbar for visual distinction */
  '&[data-weekend][data-has-scroll] .ScrollablePlaceholder': {
    background: theme.palette.action.hover,
    '&::-webkit-scrollbar': {
      background: theme.palette.action.hover,
    },
  },
}));

const DayTimeGridAllDayEventsRow = styled(CalendarGrid.DayRow, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventsRow',
})(({ theme }) => ({
  position: 'relative',
  backgroundColor: 'transparent',
  display: 'grid',
  gridTemplateColumns: 'subgrid',
  gridColumn: '2 / -1',
  gridRow: 1,
  width: '100%',
  height: '100%',
  ...getChildBorderRightStyle(theme),
}));

const DayTimeGridAllDayEventsCell = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventsCell',
})(({ theme }) => ({
  padding: theme.spacing(0.5),
  backgroundColor: theme.palette.background.paper,
}));

const DayTimeGridAllDayEventsHeaderCell = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventsHeaderCell',
})(({ theme }) => ({
  gridColumn: '1',
  gridRow: '1',
  fontSize: theme.typography.caption.fontSize,
  fontStyle: 'italic',
  padding: theme.spacing(1),
  textAlign: 'end',
  color: theme.palette.text.secondary,
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  hyphens: 'auto',
}));

const DayTimeGridHeaderContent = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridHeaderContent',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.25),
}));

const DayTimeGridHeaderButton = styled('button', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridHeaderButton',
})(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  font: 'inherit',
  color: 'inherit',
  padding: 0,
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: -2,
    borderRadius: theme.shape.borderRadius,
  },
}));

const DayTimeGridHeaderDayName = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridHeaderDayName',
})(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.text.secondary,
  lineHeight: 1,
}));

const DayTimeGridHeaderDayNumber = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridHeaderDayNumber',
})(({ theme }) => ({
  fontSize: theme.typography.h5.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  lineHeight: 1,
  padding: theme.spacing(0, 0.5),
  borderRadius: theme.shape.borderRadius,
  '[data-current] &': {
    backgroundColor: theme.palette.primary.light,
  },
}));

const DayTimeGridBody = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridBody',
})({
  flex: 1,
  height: '100%',
});

const DayTimeGridScrollableContent = styled(CalendarGrid.TimeScrollableContent, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridScrollableContent',
})({
  display: 'flex',
  height: `calc(var(--hour-height) * 24)`,
  position: 'relative',
  overflow: 'auto',
});

const DayTimeGridTimeAxis = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridTimeAxis',
})({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  width: 'var(--fixed-cell-width)',
});

const DayTimeGridTimeAxisCell = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridTimeAxisCell',
})(({ theme }) => ({
  height: `calc(100% / ${HOURS_IN_DAY})`,
  lineHeight: `calc(100% / ${HOURS_IN_DAY})`,
  paddingInline: theme.spacing(1),
  textAlign: 'end',
  '&:not(:first-of-type)::after': {
    content: '""',
    position: 'absolute',
    left: 'var(--fixed-cell-width)',
    right: 0,
    borderBottom: getDividerBorder(theme),
    top: 'calc(var(--hour) * var(--hour-height))',
    zIndex: 1,
  },
}));

const DayTimeGridTimeAxisText = styled('time', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridTimeAxisText',
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 'calc(100% / 24)',
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  '&.HiddenHourLabel': {
    opacity: 0,
  },
}));

const DayTimeGridGrid = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridGrid',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
  width: '100%',
  ...getChildBorderRightStyle(theme),
}));

// TODO: Replace with a proper loading overlay component that is shared across views
const DayTimeGridLoadingOverlay = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridLoadingOverlay',
})(({ theme }) => ({
  position: 'absolute',
  fontSize: theme.typography.body1.fontSize,
  padding: 2,
  color: theme.palette.text.secondary,
  zIndex: 1,
}));

export const DayTimeGrid = React.forwardRef(function DayTimeGrid(
  props: DayTimeGridProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { days, ...other } = props;

  // Context hooks
  const adapter = useAdapter();
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();

  // Ref hooks
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const allDayHeaderWrapperRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  // Selector hooks
  const hasDayView = useStore(store, eventCalendarViewSelectors.hasDayView);
  const now = useStore(store, schedulerNowSelectors.nowUpdatedEveryMinute);
  const showCurrentTimeIndicator = useStore(store, schedulerNowSelectors.showCurrentTimeIndicator);
  const isLoading = useStore(store, schedulerOtherSelectors.isLoading);

  // Feature hooks
  const occurrencesMap = useEventOccurrencesGroupedByDay({ days });
  const occurrences = useEventOccurrencesWithDayGridPosition({
    days,
    occurrencesMap,
    shouldAddPosition: React.useCallback(
      (occurrence: SchedulerEventOccurrence) =>
        isOccurrenceAllDayOrMultipleDay(occurrence, adapter),
      [adapter],
    ),
  });

  const formatTime = useFormatTime();

  const [hasScroll, setHasScroll] = React.useState(false);

  const { start, end } = React.useMemo(
    () => ({
      start: days[0].value,
      end: adapter.endOfDay(days[days.length - 1].value),
    }),
    [adapter, days],
  );

  const isTodayInView = React.useMemo(
    () =>
      adapter.isWithinRange(now, [
        adapter.startOfDay(days[0].value),
        adapter.endOfDay(days[days.length - 1].value),
      ]),
    [adapter, days, now],
  );

  useIsoLayoutEffect(() => {
    const body = bodyRef.current;
    const allDayHeader = allDayHeaderWrapperRef.current;
    if (!body || !allDayHeader) {
      return;
    }
    setHasScroll(body.scrollHeight > body.clientHeight);
  }, [occurrencesMap]);

  const lastIsWeekend = isWeekend(adapter, days[days.length - 1].value);

  const shouldHideHour = (hour: number) => {
    if (!isTodayInView || !showCurrentTimeIndicator) {
      return false;
    }
    const slotCenter = adapter.setMinutes(adapter.setHours(now, hour), 0);
    return Math.abs(adapter.differenceInMinutes(now, slotCenter)) <= 25;
  };

  const template = adapter.date('2020-01-01T00:00:00', 'default');

  const renderHeaderContent = (day: SchedulerProcessedDate) => (
    <DayTimeGridHeaderContent>
      {/* TODO: Add the 3 letter week day format to the adapter */}
      <DayTimeGridHeaderDayName>
        {adapter.formatByString(day.value, 'ccc')}
      </DayTimeGridHeaderDayName>
      <DayTimeGridHeaderDayNumber>
        {adapter.format(day.value, 'dayOfMonth')}
      </DayTimeGridHeaderDayNumber>
    </DayTimeGridHeaderContent>
  );

  return (
    <DayTimeGridContainer ref={handleRef} {...other}>
      <EventPopoverProvider containerRef={containerRef}>
        <DayTimeGridHeader>
          <DayTimeGridHeaderRow as={CalendarGrid.HeaderRow}>
            <DayTimeGridAllDayEventsCell />
            {days.map((day) => (
              <CalendarGrid.HeaderCell
                key={day.key}
                date={day}
                ariaLabelFormat={`${adapter.formats.weekday} ${adapter.formats.dayOfMonth}`}
              >
                {hasDayView ? (
                  <DayTimeGridHeaderButton
                    type="button"
                    onClick={(event) => store.switchToDay(day.value, event)}
                    tabIndex={0}
                  >
                    {renderHeaderContent(day)}
                  </DayTimeGridHeaderButton>
                ) : (
                  renderHeaderContent(day)
                )}
              </CalendarGrid.HeaderCell>
            ))}
          </DayTimeGridHeaderRow>
        </DayTimeGridHeader>

        <DayTimeGridAllDayEventsGrid
          ref={allDayHeaderWrapperRef}
          data-weekend={lastIsWeekend || undefined}
          data-has-scroll={hasScroll || undefined}
          style={{ '--column-count': days.length } as React.CSSProperties}
        >
          <DayTimeGridAllDayEventsHeaderCell
            id="DayTimeGridAllDayEventsHeaderCell"
            role="columnheader"
          >
            {translations.allDay}
          </DayTimeGridAllDayEventsHeaderCell>
          <DayTimeGridAllDayEventsRow as={CalendarGrid.DayRow} start={start} end={end} role="row">
            {occurrences.days.map((day) => (
              <DayGridCell key={day.key} day={day} row={occurrences} />
            ))}
          </DayTimeGridAllDayEventsRow>
          <div className="ScrollablePlaceholder" />
        </DayTimeGridAllDayEventsGrid>

        <DayTimeGridRoot>
          <DayTimeGridBody ref={bodyRef}>
            <DayTimeGridScrollableContent as={CalendarGrid.TimeScrollableContent}>
              <DayTimeGridTimeAxis aria-hidden="true">
                {Array.from({ length: 24 }, (_, hour) => (
                  <DayTimeGridTimeAxisCell
                    key={hour}
                    style={{ '--hour': hour } as React.CSSProperties}
                  >
                    <DayTimeGridTimeAxisText
                      as="time"
                      data-hidden={shouldHideHour(hour) || undefined}
                    >
                      {hour === 0 ? null : formatTime(adapter.setHours(template, hour))}
                    </DayTimeGridTimeAxisText>
                  </DayTimeGridTimeAxisCell>
                ))}
              </DayTimeGridTimeAxis>

              <DayTimeGridGrid>
                {isLoading && (
                  <DayTimeGridLoadingOverlay>{translations.loading}</DayTimeGridLoadingOverlay>
                )}

                {occurrences.days.map((day, index) => (
                  <TimeGridColumn
                    key={day.key}
                    day={day}
                    index={index}
                    showCurrentTimeIndicator={showCurrentTimeIndicator && isTodayInView}
                  />
                ))}
              </DayTimeGridGrid>
            </DayTimeGridScrollableContent>
          </DayTimeGridBody>
        </DayTimeGridRoot>
      </EventPopoverProvider>
    </DayTimeGridContainer>
  );
});
