'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  schedulerNowSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { SchedulerProcessedDate, TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { MiniCalendarProps } from './MiniCalendar.types';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { useEventCalendarClasses } from '../EventCalendarClassesContext';

const MiniCalendarRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MiniCalendar',
})({
  width: '100%',
  userSelect: 'none',
});

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
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.5, 0),
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
  color: theme.palette.text.primary,
  padding: 0,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  '&[data-other-month]': {
    color: theme.palette.text.disabled,
  },
  '&[data-today]': {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.primary.main,
  },
  '&[data-active]': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
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

    const adapter = useAdapter();
    const store = useEventCalendarStoreContext();
    const translations = useTranslations();
    const classes = useEventCalendarClasses();

    const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);
    const now = useStore(store, schedulerNowSelectors.nowUpdatedEveryMinute);

    const [displayedMonth, setDisplayedMonth] = React.useState<TemporalSupportedObject>(() =>
      adapter.startOfMonth(visibleDate),
    );

    // Sync displayed month when visibleDate changes externally
    React.useEffect(() => {
      setDisplayedMonth(adapter.startOfMonth(visibleDate));
    }, [adapter, visibleDate]);

    // Generate days for the displayed month (including padding days from adjacent months)
    const days = React.useMemo(() => {
      const monthStart = adapter.startOfMonth(displayedMonth);
      const monthEnd = adapter.endOfMonth(displayedMonth);
      return getDayList({
        adapter,
        start: adapter.startOfWeek(monthStart),
        end: adapter.endOfWeek(monthEnd),
      });
    }, [adapter, displayedMonth]);

    // Group days into weeks
    const weeks = React.useMemo(() => {
      const result: SchedulerProcessedDate[][] = [];
      for (let i = 0; i < days.length; i += 7) {
        result.push(days.slice(i, i + 7));
      }
      return result;
    }, [days]);

    // Get weekday headers from first week
    const weekdays = weeks[0] ?? [];

    const handlePreviousMonth = React.useCallback(() => {
      setDisplayedMonth((prev) => adapter.addMonths(prev, -1));
    }, [adapter]);

    const handleNextMonth = React.useCallback(() => {
      setDisplayedMonth((prev) => adapter.addMonths(prev, 1));
    }, [adapter]);

    const handleDayClick = React.useCallback(
      (day: TemporalSupportedObject, event: React.MouseEvent) => {
        store.goToDate(day, event);
      },
      [store],
    );

    // Format month and year label (e.g., "May 2025")
    const monthYearLabel = React.useMemo(() => {
      const f = adapter.formats;
      return adapter.formatByString(displayedMonth, `${f.monthFullLetter} ${f.yearPadded}`);
    }, [adapter, displayedMonth]);

    return (
      <MiniCalendarRoot
        ref={forwardedRef}
        role="grid"
        aria-label={translations.miniCalendarLabel}
        className={clsx(classes.miniCalendar, className)}
        {...other}
      >
        <MiniCalendarHeader className={classes.miniCalendarHeader}>
          <MiniCalendarMonthLabel className={classes.miniCalendarMonthLabel}>
            {monthYearLabel}
          </MiniCalendarMonthLabel>
          <MiniCalendarNavigation className={classes.miniCalendarNavigation}>
            <IconButton
              size="small"
              aria-label={translations.miniCalendarGoToPreviousMonth}
              onClick={handlePreviousMonth}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label={translations.miniCalendarGoToNextMonth}
              onClick={handleNextMonth}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </MiniCalendarNavigation>
        </MiniCalendarHeader>

        <MiniCalendarWeekdayHeader role="row" className={classes.miniCalendarWeekdayHeader}>
          {weekdays.map((day) => (
            <MiniCalendarWeekdayCell
              key={day.key}
              role="columnheader"
              aria-label={adapter.formatByString(day.value, adapter.formats.weekday)}
              className={classes.miniCalendarWeekdayCell}
            >
              {adapter.formatByString(day.value, adapter.formats.weekday1Letter)}
            </MiniCalendarWeekdayCell>
          ))}
        </MiniCalendarWeekdayHeader>

        <MiniCalendarGrid role="rowgroup" className={classes.miniCalendarGrid}>
          {weeks.map((week, weekIndex) => (
            <MiniCalendarWeekRow key={weekIndex} role="row" className={classes.miniCalendarWeekRow}>
              {week.map((day) => {
                const isToday = adapter.isSameDay(day.value, now);
                const isActive = adapter.isSameDay(day.value, visibleDate);
                const isOtherMonth = !adapter.isSameMonth(day.value, displayedMonth);

                // Create a full date label for accessibility
                const fullDateLabel = adapter.formatByString(
                  day.value,
                  adapter.formats.localizedDateWithFullMonthAndWeekDay,
                );

                return (
                  <MiniCalendarDayCell
                    key={day.key}
                    role="gridcell"
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
                      onClick={(event) => handleDayClick(day.value, event)}
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
