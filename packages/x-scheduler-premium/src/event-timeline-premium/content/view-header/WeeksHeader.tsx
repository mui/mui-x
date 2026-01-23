import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store/useStore';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { eventTimelinePremiumViewSelectors } from '@mui/x-scheduler-headless-premium/event-timeline-premium-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import { SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';
import { formatWeekDayMonthAndDayOfMonth } from '@mui/x-scheduler/internals';
import { useEventTimelineClasses } from '../../EventTimelineClassesContext';

const WeeksHeaderRoot = styled('div', {
  name: 'MuiEventTimelinePremium',
  slot: 'WeeksHeaderRoot',
})({
  display: 'flex',
  // TODO: update this calculation when we add the option to hide weekends
  minWidth: 'calc(var(--unit-count) * 7 * var(--weeks-cell-width))',
});

const TimeHeaderCell = styled('div', {
  name: 'MuiEventTimelinePremium',
  slot: 'WeeksHeaderCell',
})(({ theme }) => ({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  '&:not(:last-child)': {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const DayLabel = styled('div', {
  name: 'MuiEventTimelinePremium',
  slot: 'WeeksHeaderDayLabel',
})(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  display: 'flex',
  justifyContent: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const WeekDaysRow = styled('div', {
  name: 'MuiEventTimelinePremium',
  slot: 'WeeksHeaderDaysRow',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  columnGap: theme.spacing(0.5),
}));

const WeekDayCell = styled('time', {
  name: 'MuiEventTimelinePremium',
  slot: 'WeeksHeaderDayCell',
})(({ theme }) => ({
  padding: theme.spacing(0.5),
  textAlign: 'center',
  margin: 0,
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.text.secondary,
  '&[data-weekend]': {
    color: theme.palette.error.main,
  },
  '&:not(:last-child)': {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export function WeeksHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  // Context hooks
  const adapter = useAdapter();
  const store = useEventTimelinePremiumStoreContext();
  const classes = useEventTimelineClasses();

  // Selector hooks
  const viewConfig = useStore(store, eventTimelinePremiumViewSelectors.config);

  // Feature hooks
  const weeks = React.useMemo(() => {
    const days = getDayList({
      adapter,
      start: viewConfig.start,
      end: adapter.endOfWeek(viewConfig.end),
    });
    const tempWeeks: SchedulerProcessedDate[][] = [];
    let weekNumber: number | null = null;
    for (const day of days) {
      const lastWeek = tempWeeks[tempWeeks.length - 1];
      const dayWeekNumber = adapter.getWeekNumber(day.value);
      if (weekNumber !== dayWeekNumber) {
        weekNumber = dayWeekNumber;
        tempWeeks.push([day]);
      } else {
        lastWeek.push(day);
      }
    }
    return tempWeeks;
  }, [adapter, viewConfig]);

  return (
    <WeeksHeaderRoot className={classes.weeksHeaderRoot} {...props}>
      {weeks.map((week) => (
        <TimeHeaderCell key={`${week[0].key}-week`} className={classes.weeksHeaderCell}>
          <DayLabel className={classes.weeksHeaderDayLabel}>
            {formatWeekDayMonthAndDayOfMonth(week[0].value, adapter)} -{' '}
            {formatWeekDayMonthAndDayOfMonth(week[6].value, adapter)}
          </DayLabel>
          <WeekDaysRow className={classes.weeksHeaderDaysRow}>
            {week.map((day) => (
              <WeekDayCell
                dateTime={day.key}
                key={day.key}
                className={classes.weeksHeaderDayCell}
                data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
              >
                {adapter.format(day.value, 'weekday1Letter')}
              </WeekDayCell>
            ))}
          </WeekDaysRow>
        </TimeHeaderCell>
      ))}
    </WeeksHeaderRoot>
  );
}
