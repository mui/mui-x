import * as React from 'react';
import { clsx } from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter, Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { selectors } from '@mui/x-scheduler-headless/use-timeline';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { SchedulerValidDate } from '@mui/x-scheduler-headless/models';
import { HeaderProps } from './Headers.types';
import { YEARS_UNIT_COUNT } from '../../constants';
import './Headers.css';

const getYears = (adapter: Adapter, date: SchedulerValidDate, amount: number) => {
  const end = adapter.startOfYear(adapter.addYears(date, amount));

  let current = date;
  const years: SchedulerValidDate[] = [];

  while (adapter.isBefore(current, end)) {
    years.push(current);

    current = adapter.addYears(current, 1);
  }

  return years;
};

export function YearHeader(props: HeaderProps) {
  const { className, amount, ...other } = props;

  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, selectors.visibleDate);

  const years = React.useMemo(
    () => getYears(adapter, visibleDate, amount || YEARS_UNIT_COUNT),
    [adapter, visibleDate, amount],
  );

  return (
    <div className={clsx('YearsHeader', className)} {...other}>
      {years.map((year) => (
        <div key={`${adapter.getYear(year)}`} className="YearLabel">
          {adapter.getYear(year)}
        </div>
      ))}
    </div>
  );
}
