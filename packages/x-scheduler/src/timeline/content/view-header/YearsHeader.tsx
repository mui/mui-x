import * as React from 'react';
import { clsx } from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter, Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { SchedulerProcessedDate, TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { HeaderProps } from './Headers.types';
import { YEARS_UNIT_COUNT } from '../../constants';
import './Headers.css';

export function YearHeader(props: HeaderProps) {
  const { className, amount = YEARS_UNIT_COUNT, ...other } = props;

  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);

  const years = React.useMemo(
    () => getYears(adapter, visibleDate, amount),
    [adapter, visibleDate, amount],
  );

  return (
    <div className={clsx('YearsHeader', className)} {...other}>
      {years.map((year) => (
        <div key={year.key} className="YearLabel">
          {adapter.getYear(year.value)}
        </div>
      ))}
    </div>
  );
}

function getYears(adapter: Adapter, date: TemporalSupportedObject, amount: number) {
  const end = adapter.startOfYear(adapter.addYears(date, amount));
  let current = adapter.startOfYear(date);
  const years: SchedulerProcessedDate[] = [];

  while (adapter.isBefore(current, end)) {
    years.push(processDate(current, adapter));

    current = adapter.addYears(current, 1);
  }

  return years;
}
