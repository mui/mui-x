import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { Adapter, useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { SchedulerProcessedDate, TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { timelineViewSelectors } from '@mui/x-scheduler-headless/timeline-selectors';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import './Headers.css';

export function MonthsHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  // Context hooks
  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  // Selector hooks
  const viewConfig = useStore(store, timelineViewSelectors.config);

  // Feature hooks
  const months = React.useMemo(
    () => getMonths(adapter, viewConfig.start, viewConfig.end),
    [adapter, viewConfig],
  );

  return (
    <div className={clsx('MonthsHeader', props.className)} {...props}>
      {months.map((month, index) => {
        const monthNumber = adapter.getMonth(month.value);

        return (
          <React.Fragment key={month.key}>
            {(monthNumber === 0 || index === 0) && (
              <div
                className="YearLabel"
                style={
                  {
                    '--grid-column': index + 1,
                    '--columns-span': Math.min(12, months.length - index - 1) - monthNumber + 1,
                  } as React.CSSProperties
                }
              >
                {adapter.getYear(month.value)}
              </div>
            )}
            <div className="MonthLabel">{adapter.format(month.value, 'month3Letters')}</div>
          </React.Fragment>
        );
      })}
    </div>
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
