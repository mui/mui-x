import * as React from 'react';
import { clsx } from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter, Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { timelineViewSelectors } from '@mui/x-scheduler-headless/timeline-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { SchedulerProcessedDate, TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import './Headers.css';

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
    <div className={clsx('YearsHeader', props.className)} {...props}>
      {years.map((year) => (
        <div key={year.key} className="YearLabel">
          {adapter.getYear(year.value)}
        </div>
      ))}
    </div>
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
