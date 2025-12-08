import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { Adapter, useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { SchedulerProcessedDate, TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { MONTHS_UNIT_COUNT } from '../../constants';
import { HeaderProps } from './Headers.types';
import './Headers.css';

export function MonthsHeader(props: HeaderProps) {
  const { className, amount = MONTHS_UNIT_COUNT, ...other } = props;

  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);

  const months = React.useMemo(
    () => getMonths(adapter, visibleDate, amount),
    [adapter, visibleDate, amount],
  );

  return (
    <div className={clsx('MonthsHeader', className)} {...other}>
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

function getMonths(adapter: Adapter, date: TemporalSupportedObject, amount: number) {
  const end = adapter.startOfMonth(adapter.addMonths(date, amount));
  let current = adapter.startOfYear(date);
  const years: SchedulerProcessedDate[] = [];

  while (adapter.isBefore(current, end)) {
    years.push(processDate(current, adapter));

    current = adapter.addMonths(current, 1);
  }

  return years;
}
