import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store/useStore';
import { useAdapter, Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { timelineViewSelectors } from '@mui/x-scheduler-headless/timeline-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { SchedulerProcessedDate, TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { processDate } from '@mui/x-scheduler-headless/process-date';

const YearsHeaderRoot = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'YearsHeaderRoot',
})({
  display: 'grid',
  gridTemplateColumns: 'repeat(var(--unit-count), minmax(var(--years-cell-width), 1fr))',
  gridTemplateRows: 'auto',
  height: '100%',
});

const YearLabel = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'YearsHeaderYearLabel',
})(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  '&:not(:last-child)': {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export function YearsHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  // Context hooks
  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  // Selector hooks
  const viewConfig = useStore(store, timelineViewSelectors.config);

  // Feature hooks
  const years = React.useMemo(
    () => getYears(adapter, viewConfig.start, viewConfig.end),
    [adapter, viewConfig],
  );

  return (
    <YearsHeaderRoot {...props}>
      {years.map((year) => (
        <YearLabel key={year.key}>{adapter.getYear(year.value)}</YearLabel>
      ))}
    </YearsHeaderRoot>
  );
}

function getYears(adapter: Adapter, start: TemporalSupportedObject, end: TemporalSupportedObject) {
  let current = adapter.startOfYear(start);
  const years: SchedulerProcessedDate[] = [];

  while (adapter.isBefore(current, end)) {
    years.push(processDate(current, adapter));

    current = adapter.addYears(current, 1);
  }

  return years;
}
