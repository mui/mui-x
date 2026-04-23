import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store/useStore';
import { isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { eventTimelinePremiumPresetSelectors } from '@mui/x-scheduler-headless-premium/event-timeline-premium-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import { SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';
import { formatWeekDayMonthAndDayOfMonth } from '@mui/x-scheduler/internals';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';

const WeeksHeaderRoot = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'WeeksHeader',
})({
  display: 'flex',
  // TODO: update this calculation when we add the option to hide weekends
  minWidth: 'calc(var(--unit-count) * var(--dayAndWeek-cell-width))',
});

const TimeHeaderCell = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'WeeksHeaderCell',
})(({ theme }) => ({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  '&:not(:last-child)': {
    borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

const DayLabel = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'WeeksHeaderDayLabel',
})(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  display: 'flex',
  justifyContent: 'center',
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const WeekDaysRow = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'WeeksHeaderDaysRow',
})({
  display: 'grid',
  // Intentionally borrows the `dayAndHour` preset's cell width (64px) to size the 7-day sub-row:
  // `--dayAndWeek-cell-width` (the week column) equals `7 × 64px`, so each day takes 64px.
  // This cross-preset token will go away with the generic header in #21827.
  gridTemplateColumns: 'repeat(7, var(--dayAndHour-cell-width))',
});

const WeekDayCell = styled('time', {
  name: 'MuiEventTimeline',
  slot: 'WeeksHeaderDayCell',
})(({ theme }) => ({
  padding: theme.spacing(0.5),
  textAlign: 'center',
  margin: 0,
  fontSize: theme.typography.body2.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  '&[data-weekend]': {
    color: (theme.vars || theme).palette.error.main,
  },
  '&:not(:last-child)': {
    borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

export function WeeksHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventTimelinePremiumStoreContext();
  const { classes } = useEventTimelinePremiumStyledContext();

  // Selector hooks
  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);

  // Feature hooks
  const weeks = React.useMemo(() => {
    const days = getDayList({
      adapter,
      start: presetConfig.start,
      end: adapter.endOfWeek(presetConfig.end),
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
  }, [adapter, presetConfig]);

  return (
    <WeeksHeaderRoot className={classes.weeksHeader} {...props}>
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
