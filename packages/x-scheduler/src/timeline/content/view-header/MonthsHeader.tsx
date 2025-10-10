import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useMonthList } from '@mui/x-scheduler-headless/use-month-list';
import { selectors } from '@mui/x-scheduler-headless/use-timeline';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { MONTHS_UNIT_COUNT } from '../../constants';
import { HeaderProps } from './Headers.types';
import './Headers.css';

export function MonthsHeader(props: HeaderProps) {
  const { className, amount, ...other } = props;

  const adapter = useAdapter();
  const getMonthList = useMonthList();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, selectors.visibleDate);

  const months = React.useMemo(
    () =>
      getMonthList({
        date: visibleDate,
        amount: amount || MONTHS_UNIT_COUNT,
      }),
    [getMonthList, visibleDate, amount],
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
            <div className="MonthLabel">{adapter.format(month.value, 'monthShort')}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
