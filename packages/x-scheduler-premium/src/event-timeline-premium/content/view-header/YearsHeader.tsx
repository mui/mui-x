import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store/useStore';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { eventTimelinePremiumPresetSelectors } from '@mui/x-scheduler-headless-premium/event-timeline-premium-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import { SchedulerProcessedDate, TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';

const YearsHeaderRoot = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'YearsHeader',
})({
  display: 'grid',
  gridTemplateColumns: 'repeat(var(--unit-count), minmax(var(--year-cell-width), 1fr))',
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
    borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

export function YearsHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventTimelinePremiumStoreContext();
  const { classes } = useEventTimelinePremiumStyledContext();

  // Selector hooks
  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);

  // Feature hooks
  const years = React.useMemo(
    () => getYears(adapter, presetConfig.start, presetConfig.end),
    [adapter, presetConfig],
  );

  return (
    <YearsHeaderRoot className={classes.yearsHeader} {...props}>
      {years.map((year) => (
        <YearLabel key={year.key} className={classes.yearsHeaderYearLabel}>
          {adapter.getYear(year.value)}
        </YearLabel>
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
