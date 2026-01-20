import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store/useStore';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless-premium/use-timeline-store-context';
import { timelineViewSelectors } from '@mui/x-scheduler-headless-premium/timeline-selectors';
import { formatWeekDayMonthAndDayOfMonth } from '@mui/x-scheduler/utils';
import { useFormatTime } from '@mui/x-scheduler/hooks';

const TimeHeaderRoot = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'TimeHeaderRoot',
})({
  display: 'flex',
  minWidth: 'calc(var(--unit-count) * var(--time-cell-width))',
});

const TimeHeaderCell = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'TimeHeaderCell',
})(({ theme }) => ({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  '&:not(:last-child)': {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const DayLabel = styled('time', {
  name: 'MuiEventTimeline',
  slot: 'TimeHeaderDayLabel',
})(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  display: 'flex',
  justifyContent: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const TimeCellsRow = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'TimeHeaderCellsRow',
})(({ theme }) => ({
  padding: theme.spacing(0, 1),
  display: 'grid',
  gridTemplateColumns: 'repeat(24, var(--time-cell-width))',
}));

const TimeCell = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'TimeHeaderTimeCell',
})(({ theme }) => ({
  padding: theme.spacing(1, 0),
  textAlign: 'center',
}));

const TimeLabel = styled('time', {
  name: 'MuiEventTimeline',
  slot: 'TimeHeaderTimeLabel',
})(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.text.secondary,
}));

export function TimeHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  // Context hooks
  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  // Selector hooks
  const viewConfig = useStore(store, timelineViewSelectors.config);

  // Feature hooks
  const formatTime = useFormatTime();

  const days = React.useMemo(
    () => getDayList({ adapter, start: viewConfig.start, end: viewConfig.end }),
    [adapter, viewConfig],
  );

  const template = adapter.date('2020-01-01T00:00:00', 'default');

  return (
    <TimeHeaderRoot {...props}>
      {days.map((day) => (
        <TimeHeaderCell key={day.key}>
          <DayLabel dateTime={day.key}>
            {formatWeekDayMonthAndDayOfMonth(day.value, adapter)}
          </DayLabel>
          <TimeCellsRow>
            {Array.from({ length: 24 }, (_, hour) => (
              <TimeCell key={hour} style={{ '--hour': hour } as React.CSSProperties}>
                <TimeLabel>{formatTime(adapter.setHours(template, hour))}</TimeLabel>
              </TimeCell>
            ))}
          </TimeCellsRow>
        </TimeHeaderCell>
      ))}
    </TimeHeaderRoot>
  );
}
