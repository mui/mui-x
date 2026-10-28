'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import {
  schedulerNowSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { getDayListFromPlainDates } from '@mui/x-scheduler-internals/get-day-list';
import {
  createLabelDate,
  getPlainDateWeekStart,
  isWeekendPlainDate,
} from '@mui/x-scheduler-internals/internals';
import type { PlainDate } from '@mui/x-scheduler-internals/internals';
import type { SchedulerProcessedDay } from '@mui/x-scheduler-internals/models';
import type { MiniCalendarProps } from './MiniCalendar.types';
import { useEventCalendarStyledContext } from '../EventCalendarStyledContext';
import { formatMonthFullLetterAndYear } from '../../internals/utils/date-utils';

const MiniCalendarRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MiniCalendar',
})(({ theme }) => ({
  userSelect: 'none',
  padding: theme.spacing(1),
}));

const MiniCalendarHeader = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MiniCalendarHeader',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

const MiniCalendarNavigation = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MiniCalendarNavigation',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const MiniCalendarMonthLabel = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'MiniCalendarMonthLabel',
})(({ theme }) => ({
  ...theme.typography.subtitle2,
  fontWeight: theme.typography.fontWeightMedium,
  paddingInlineStart: theme.spacing(1.25),
}));

const MiniCalendarWeekdayHeader = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MiniCalendarWeekdayHeader',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  textAlign: 'center',
  marginBottom: theme.spacing(0.5),
}));

const MiniCalendarWeekdayCell = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'MiniCalendarWeekdayCell',
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  padding: theme.spacing(0.5, 0),
  '&[data-weekend]': {
    color: (theme.vars || theme).palette.error.main,
  },
}));

const MiniCalendarGrid = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MiniCalendarGrid',
})({
  display: 'flex',
  flexDirection: 'column',
});

const MiniCalendarWeekRow = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MiniCalendarWeekRow',
})({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
});

const MiniCalendarDayCell = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MiniCalendarDayCell',
})({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  aspectRatio: '1',
});

const MiniCalendarDayButton = styled('button', {
  name: 'MuiEventCalendar',
  slot: 'MiniCalendarDayButton',
})(({ theme }) => ({
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: '50%',
  background: 'none',
  cursor: 'pointer',
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.primary,
  padding: 0,
  '&:hover': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.08),
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: 2,
  },
  '&[data-other-month]': {
    color: (theme.vars || theme).palette.text.disabled,
  },
  '&[data-today]:not([data-active])': {
    fontWeight: theme.typography.fontWeightBold,
    color: (theme.vars || theme).palette.primary.main,
    backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.15),
  },
  '&[data-active]': {
    backgroundColor: (theme.vars || theme).palette.primary.main,
    color: (theme.vars || theme).palette.primary.contrastText,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
  '&[data-today][data-active]': {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

/**
 * A compact month calendar for navigating to specific days.
 */
export const MiniCalendar = React.forwardRef<HTMLDivElement, MiniCalendarProps>(
  function MiniCalendar(props, forwardedRef) {
    const { className, ...other } = props;

    const adapter = useAdapterContext();
    const isRtl = useRtl();
    const PreviousIcon = isRtl ? ChevronRightIcon : ChevronLeftIcon;
    const NextIcon = isRtl ? ChevronLeftIcon : ChevronRightIcon;
    const store = useEventCalendarStoreContext();
    const { classes, localeText } = useEventCalendarStyledContext();

    const visiblePlainDate = useStore(store, schedulerOtherSelectors.visiblePlainDate);
    const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
    const nowDayNumber = useStore(store, schedulerNowSelectors.nowDayNumber);
    const weekStartsOn = useStore(store, eventCalendarPreferenceSelectors.weekStartsOn);

    // The first day of the displayed month.
    const [displayedMonth, setDisplayedMonth] = React.useState<PlainDate>(() =>
      visiblePlainDate.with({ day: 1 }),
    );

    // Sync displayed month when visibleDate changes externally
    React.useEffect(() => {
      const visibleMonth = visiblePlainDate.with({ day: 1 });
      setDisplayedMonth((prev) => (prev.equals(visibleMonth) ? prev : visibleMonth));
    }, [visiblePlainDate]);

    // Generate days for the displayed month (including padding days from adjacent months)
    // Always show 6 weeks (42 days) for consistent height
    const days = React.useMemo(() => {
      const gridStart = getPlainDateWeekStart(adapter, displayedMonth, weekStartsOn);
      return getDayListFromPlainDates({
        adapter,
        firstPlainDate: gridStart,
        // 6 weeks = 42 days, so end is 41 days after start
        lastPlainDate: gridStart.add({ days: 41 }),
        timezone: displayTimezone,
      });
    }, [adapter, displayedMonth, displayTimezone, weekStartsOn]);

    // Group days into weeks
    const weeks = React.useMemo(() => {
      const result: SchedulerProcessedDay[][] = [];
      for (let i = 0; i < days.length; i += 7) {
        result.push(days.slice(i, i + 7));
      }
      return result;
    }, [days]);

    // Get weekday headers from first week
    const weekdays = weeks[0] ?? [];

    const monthYearLabel = React.useMemo(
      () => formatMonthFullLetterAndYear(createLabelDate(adapter, displayedMonth), adapter),
      [adapter, displayedMonth],
    );

    return (
      <MiniCalendarRoot
        ref={forwardedRef}
        role="grid"
        aria-label={localeText.miniCalendarLabel}
        aria-rowcount={1 + weeks.length}
        aria-colcount={7}
        className={clsx(classes.miniCalendar, className)}
        {...other}
      >
        <MiniCalendarHeader className={classes.miniCalendarHeader}>
          <MiniCalendarMonthLabel className={classes.miniCalendarMonthLabel}>
            {monthYearLabel}
          </MiniCalendarMonthLabel>
          <MiniCalendarNavigation className={classes.miniCalendarNavigation}>
            <IconButton
              className={classes.miniCalendarPreviousButton}
              size="small"
              aria-label={localeText.miniCalendarGoToPreviousMonth}
              onClick={() => setDisplayedMonth((prev) => prev.add({ months: -1 }))}
            >
              <PreviousIcon fontSize="small" />
            </IconButton>
            <IconButton
              className={classes.miniCalendarNextButton}
              size="small"
              aria-label={localeText.miniCalendarGoToNextMonth}
              onClick={() => setDisplayedMonth((prev) => prev.add({ months: 1 }))}
            >
              <NextIcon fontSize="small" />
            </IconButton>
          </MiniCalendarNavigation>
        </MiniCalendarHeader>

        <MiniCalendarWeekdayHeader
          role="row"
          aria-rowindex={1}
          className={classes.miniCalendarWeekdayHeader}
        >
          {weekdays.map((day, dayIndex) => (
            <MiniCalendarWeekdayCell
              key={day.key}
              role="columnheader"
              aria-label={adapter.formatByString(day.value, adapter.formats.weekday)}
              aria-colindex={dayIndex + 1}
              className={classes.miniCalendarWeekdayCell}
              data-weekend={isWeekendPlainDate(day.plainDate) || undefined}
            >
              {adapter.formatByString(day.value, adapter.formats.weekday1Letter)}
            </MiniCalendarWeekdayCell>
          ))}
        </MiniCalendarWeekdayHeader>

        <MiniCalendarGrid role="rowgroup" className={classes.miniCalendarGrid}>
          {weeks.map((week, weekIndex) => (
            <MiniCalendarWeekRow
              key={weekIndex}
              role="row"
              aria-rowindex={weekIndex + 2}
              className={classes.miniCalendarWeekRow}
            >
              {week.map((day, dayIndex) => {
                const isToday = day.plainDate.dayNumber === nowDayNumber;
                const isActive = day.plainDate.dayNumber === visiblePlainDate.dayNumber;
                const isOtherMonth =
                  day.plainDate.year !== displayedMonth.year ||
                  day.plainDate.month !== displayedMonth.month;

                // Create a full date label for accessibility
                const fullDateLabel = adapter.formatByString(
                  day.value,
                  adapter.formats.localizedDateWithFullMonthAndWeekDay,
                );

                return (
                  <MiniCalendarDayCell
                    key={day.key}
                    role="gridcell"
                    aria-colindex={dayIndex + 1}
                    className={classes.miniCalendarDayCell}
                  >
                    <MiniCalendarDayButton
                      type="button"
                      className={classes.miniCalendarDayButton}
                      data-other-month={isOtherMonth || undefined}
                      data-today={isToday || undefined}
                      data-active={isActive || undefined}
                      aria-label={fullDateLabel}
                      aria-current={isToday ? 'date' : undefined}
                      aria-selected={isActive}
                      tabIndex={isActive ? 0 : -1}
                      onClick={(event) => store.goToDate(day.value, event)}
                    >
                      {adapter.formatByString(day.value, adapter.formats.dayOfMonth)}
                    </MiniCalendarDayButton>
                  </MiniCalendarDayCell>
                );
              })}
            </MiniCalendarWeekRow>
          ))}
        </MiniCalendarGrid>
      </MiniCalendarRoot>
    );
  },
);
