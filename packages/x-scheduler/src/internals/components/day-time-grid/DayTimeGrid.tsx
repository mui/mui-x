'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useStore } from '@base-ui/utils/store';
import {
  eventCalendarOccurrencePositionSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import { SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';
import { isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { schedulerNowSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import clsx from 'clsx';
import { DayTimeGridProps } from './DayTimeGrid.types';
import { TimeGridColumn } from './TimeGridColumn';
import { DayGridCell } from './DayGridCell';
import { useFormatTime } from '../../../internals/hooks/useFormatTime';
import { useEventCalendarStyledContext } from '../../../event-calendar/EventCalendarStyledContext';
import { eventCalendarClasses } from '../../../event-calendar/eventCalendarClasses';

const FIXED_CELL_WIDTH = 68;
const HOUR_HEIGHT = 46;
const HOURS_IN_DAY = 24;

const DayTimeGridContainer = styled(CalendarGrid.Root, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridContainer',
})(({ theme }) => ({
  '--fixed-cell-width': `${FIXED_CELL_WIDTH}px`,
  '--hour-height': `${HOUR_HEIGHT}px`,
  '--has-scroll': 1,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  maxHeight: '100%',
}));

const DayTimeGridRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGrid',
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflowY: 'auto',
});

const DayTimeGridHeader = styled(CalendarGrid.HeaderRow, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridHeader',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns:
    'minmax(var(--fixed-cell-width), auto) repeat(var(--column-count), minmax(0, 1fr)) fit-content(100%)',
  width: '100%',
  borderBlockEnd: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const DayTimeGridAllDayEventsGrid = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventsGrid',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'var(--fixed-cell-width) repeat(var(--column-count), 1fr) fit-content(100%)',
  width: '100%',
  borderBlockEnd: `1px solid ${(theme.vars || theme).palette.divider}`,
  /* Only show border on header cell when there's no scrollbar */
  [`&:not[data-has-scroll] .${eventCalendarClasses.dayTimeGridAllDayEventsHeaderCell}`]: {
    borderInlineEnd: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
  [`&[data-has-scroll] .${eventCalendarClasses.dayTimeGridScrollablePlaceholder}`]: {
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
  [`&[data-weekend][data-has-scroll] .${eventCalendarClasses.dayTimeGridScrollablePlaceholder}`]: {
    background: (theme.vars || theme).palette.action.hover,
    '&::-webkit-scrollbar': {
      background: (theme.vars || theme).palette.action.hover,
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
  '& > *': {
    borderInlineStart: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

const DayTimeGridAllDayEventsCell = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventsCell',
})(({ theme }) => ({
  padding: theme.spacing(0.5),
  backgroundColor: (theme.vars || theme).palette.background.paper,
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
  color: (theme.vars || theme).palette.text.secondary,
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

const DayTimeGridHeaderCell = styled(CalendarGrid.HeaderCell, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridHeaderCell',
})(({ theme }) => ({
  display: 'flex',
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: -2,
    borderRadius: theme.shape.borderRadius,
  },
  '&:last-of-type': {
    gridColumn: 'span 2',
  },
  '&[data-has-scroll]': {
    display: 'grid',
    gridTemplateColumns: 'subgrid',
  },
  [`&[data-has-scroll] .${eventCalendarClasses.dayTimeGridScrollablePlaceholder}`]: {
    overflowY: 'scroll',
    scrollbarGutter: 'stable',
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
}));

const DayTimeGridHeaderButton = styled('button', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridHeaderButton',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  font: 'inherit',
  color: 'inherit',
  padding: theme.spacing(0.25),
  flexGrow: 1,
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: -2,
    borderRadius: theme.shape.borderRadius,
  },
}));

const DayTimeGridHeaderDayName = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridHeaderDayName',
})(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  lineHeight: 1,
  '[data-current] &': {
    color: (theme.vars || theme).palette.primary.main,
  },
}));

const DayTimeGridHeaderDayNumber = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridHeaderDayNumber',
})(({ theme }) => ({
  fontSize: theme.typography.h5.fontSize,
  lineHeight: 1,
  width: 46,
  height: 46,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  'button:hover &': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '[data-current] &': {
    backgroundColor: (theme.vars || theme).palette.primary.main,
    color: (theme.vars || theme).palette.primary.contrastText,
  },
  '[data-current] button:hover &': {
    backgroundColor: (theme.vars || theme).palette.primary.dark,
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
  overflowY: 'auto',
  overflowX: 'clip',
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
    borderBlockEnd: `1px solid ${(theme.vars || theme).palette.divider}`,
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
  color: (theme.vars || theme).palette.text.secondary,
  whiteSpace: 'nowrap',
}));

const DayTimeGridGrid = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridGrid',
})({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
  width: '100%',
  position: 'relative',
});

export const DayTimeGrid = React.forwardRef(function DayTimeGrid(
  props: DayTimeGridProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { days, className, ...other } = props;

  // Context hooks
  const adapter = useAdapterContext();
  const { schedulerId, classes, localeText } = useEventCalendarStyledContext();
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

  // Selector hooks (continued)
  const dayGridPositions = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.dayGridPositions,
  );

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
  }, [dayGridPositions]);

  const lastIsWeekend = isWeekend(adapter, days[days.length - 1].value);

  const template = adapter.date('2020-01-01T00:00:00', 'default');

  const renderHeaderContent = (day: SchedulerProcessedDate) => (
    <DayTimeGridHeaderContent className={classes.dayTimeGridHeaderContent}>
      <DayTimeGridHeaderDayName className={classes.dayTimeGridHeaderDayName}>
        {adapter.format(day.value, 'weekday3Letters')}
      </DayTimeGridHeaderDayName>
      <DayTimeGridHeaderDayNumber className={classes.dayTimeGridHeaderDayNumber}>
        {adapter.format(day.value, 'dayOfMonth')}
      </DayTimeGridHeaderDayNumber>
    </DayTimeGridHeaderContent>
  );

  return (
    <DayTimeGridContainer
      ref={handleRef}
      {...other}
      className={clsx(className, classes.dayTimeGridContainer)}
    >
      <DayTimeGridHeader
        className={classes.dayTimeGridHeader}
        as={CalendarGrid.HeaderRow}
        style={{ '--column-count': days.length } as React.CSSProperties}
      >
        <DayTimeGridAllDayEventsCell className={classes.dayTimeGridAllDayEventsCell} />
        {days.map((day, index) => (
          <DayTimeGridHeaderCell
            key={day.key}
            className={classes.dayTimeGridHeaderCell}
            date={day}
            ariaLabelFormat={`${adapter.formats.weekday} ${adapter.formats.dayOfMonth}`}
            data-has-scroll={(index === days.length - 1 && hasScroll) || undefined}
          >
            {hasDayView ? (
              <DayTimeGridHeaderButton
                className={classes.dayTimeGridHeaderButton}
                type="button"
                onClick={(event) => store.switchToDay(day.value, event)}
                tabIndex={-1}
              >
                {renderHeaderContent(day)}
              </DayTimeGridHeaderButton>
            ) : (
              renderHeaderContent(day)
            )}
            {index === days.length - 1 && (
              <div className={classes.dayTimeGridScrollablePlaceholder} />
            )}
          </DayTimeGridHeaderCell>
        ))}
      </DayTimeGridHeader>

      <DayTimeGridAllDayEventsGrid
        className={classes.dayTimeGridAllDayEventsGrid}
        ref={allDayHeaderWrapperRef}
        data-weekend={lastIsWeekend || undefined}
        data-has-scroll={hasScroll || undefined}
        style={{ '--column-count': days.length } as React.CSSProperties}
      >
        <DayTimeGridAllDayEventsHeaderCell
          className={classes.dayTimeGridAllDayEventsHeaderCell}
          id={`${schedulerId}-DayTimeGridAllDayEventsHeaderCell`}
          role="columnheader"
        >
          {localeText.allDay}
        </DayTimeGridAllDayEventsHeaderCell>
        <DayTimeGridAllDayEventsRow
          as={CalendarGrid.DayRow}
          start={start}
          end={end}
          role="row"
          className={classes.dayTimeGridAllDayEventsRow}
        >
          {days.map((day) => (
            <DayGridCell key={day.key} day={day} />
          ))}
        </DayTimeGridAllDayEventsRow>
        <div className={classes.dayTimeGridScrollablePlaceholder} />
      </DayTimeGridAllDayEventsGrid>

      <DayTimeGridRoot className={classes.dayTimeGrid}>
        <DayTimeGridBody className={classes.dayTimeGridBody} ref={bodyRef}>
          <DayTimeGridScrollableContent
            className={classes.dayTimeGridScrollableContent}
            as={CalendarGrid.TimeScrollableContent}
          >
            <DayTimeGridTimeAxis className={classes.dayTimeGridTimeAxis} aria-hidden="true">
              {Array.from({ length: 24 }, (_, hour) => (
                <DayTimeGridTimeAxisCell
                  className={classes.dayTimeGridTimeAxisCell}
                  key={hour}
                  style={{ '--hour': hour } as React.CSSProperties}
                >
                  <DayTimeGridTimeAxisText className={classes.dayTimeGridTimeAxisText} as="time">
                    {hour === 0 ? null : formatTime(adapter.setHours(template, hour))}
                  </DayTimeGridTimeAxisText>
                </DayTimeGridTimeAxisCell>
              ))}
            </DayTimeGridTimeAxis>

            <DayTimeGridGrid className={classes.dayTimeGridGrid}>
              {days.map((day, index) => (
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
    </DayTimeGridContainer>
  );
});
