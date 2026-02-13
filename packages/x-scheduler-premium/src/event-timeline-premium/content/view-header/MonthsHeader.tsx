import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store/useStore';
import { Adapter, useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { SchedulerProcessedDate, TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { eventTimelinePremiumViewSelectors } from '@mui/x-scheduler-headless-premium/event-timeline-premium-selectors';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';

const MonthsHeaderRoot = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'MonthsHeader',
})({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(var(--months-cell-width), 1fr))',
  minWidth: 'calc(var(--unit-count) * var(--months-cell-width))',
  gridTemplateRows: 'auto auto',
});

const YearLabel = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'MonthsHeaderYearLabel',
})(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  gridRow: 1,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const MonthLabel = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'MonthsHeaderMonthLabel',
})(({ theme }) => ({
  gridRow: 2,
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRight: `1px solid ${theme.palette.divider}`,
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.text.secondary,
}));

export function MonthsHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  // Context hooks
  const adapter = useAdapter();
  const store = useEventTimelinePremiumStoreContext();
  const { classes } = useEventTimelinePremiumStyledContext();

  // Selector hooks
  const viewConfig = useStore(store, eventTimelinePremiumViewSelectors.config);

  // Feature hooks
  const months = React.useMemo(
    () => getMonths(adapter, viewConfig.start, viewConfig.end),
    [adapter, viewConfig],
  );

  return (
    <MonthsHeaderRoot className={classes.monthsHeader} {...props}>
      {months.map((month, index) => {
        const monthNumber = adapter.getMonth(month.value);

        return (
          <React.Fragment key={month.key}>
            {(monthNumber === 0 || index === 0) && (
              <YearLabel
                className={classes.monthsHeaderYearLabel}
                style={
                  {
                    gridColumn: `${index + 1} / span ${Math.min(12, months.length - index - 1) - monthNumber + 1}`,
                  } as React.CSSProperties
                }
              >
                {adapter.getYear(month.value)}
              </YearLabel>
            )}
            <MonthLabel className={classes.monthsHeaderMonthLabel}>
              {adapter.format(month.value, 'month3Letters')}
            </MonthLabel>
          </React.Fragment>
        );
      })}
    </MonthsHeaderRoot>
  );
}

function getMonths(adapter: Adapter, start: TemporalSupportedObject, end: TemporalSupportedObject) {
  let current = start;
  const years: SchedulerProcessedDate[] = [];

  while (adapter.isBefore(current, end)) {
    years.push(processDate(current, adapter));

    current = adapter.addMonths(current, 1);
  }

  return years;
}
