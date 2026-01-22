import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store/useStore';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { timelinePremiumViewSelectors } from '@mui/x-scheduler-headless-premium/timeline-premium-selectors';
import { useTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-timeline-premium-store-context';

const DaysHeaderRoot = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'DaysHeaderRoot',
})({
  display: 'flex',
  width: 'calc(var(--unit-count) * var(--days-cell-width))',
});

const DayHeaderCell = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'DaysHeaderCell',
})(({ theme }) => ({
  width: 'var(--days-cell-width)',
  textAlign: 'center',
  padding: theme.spacing(1),
  boxSizing: 'border-box',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  '&:not(:last-child)': {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const DayHeaderTime = styled('time', {
  name: 'MuiEventTimeline',
  slot: 'DaysHeaderTime',
})({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const WeekDay = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'DaysHeaderWeekDay',
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.text.secondary,
  '&[data-weekend]': {
    color: theme.palette.error.main,
  },
}));

const DayNumber = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'DaysHeaderDayNumber',
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
}));

const MonthStart = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'DaysHeaderMonthStart',
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: theme.palette.text.secondary,
  background: theme.palette.grey[100],
  height: '100%',
  margin: 0,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  top: 0,
  bottom: 0,
  left: 0,
}));

const MonthStartLabel = styled('p', {
  name: 'MuiEventTimeline',
  slot: 'DaysHeaderMonthStartLabel',
})({
  transform: 'rotate(-90deg)',
});

export function DaysHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  // Context hooks
  const adapter = useAdapter();
  const store = useTimelinePremiumStoreContext();

  // Selector hooks
  const viewConfig = useStore(store, timelinePremiumViewSelectors.config);

  // Feature hooks
  const days = React.useMemo(
    () => getDayList({ adapter, start: viewConfig.start, end: viewConfig.end }),
    [adapter, viewConfig],
  );

  return (
    <DaysHeaderRoot {...props}>
      {days.map((day, index) => (
        <DayHeaderCell key={day.key}>
          {(adapter.getDate(day.value) === 1 || index === 0) && (
            <MonthStart>
              <MonthStartLabel>{adapter.format(day.value, 'month3Letters')}</MonthStartLabel>
            </MonthStart>
          )}
          <DayHeaderTime dateTime={day.key}>
            <WeekDay data-weekend={isWeekend(adapter, day.value) ? '' : undefined}>
              {adapter.format(day.value, 'weekday1Letter')}
            </WeekDay>
            <DayNumber data-weekend={isWeekend(adapter, day.value) ? '' : undefined}>
              {adapter.format(day.value, 'dayOfMonth')}
            </DayNumber>
          </DayHeaderTime>
        </DayHeaderCell>
      ))}
    </DaysHeaderRoot>
  );
}
