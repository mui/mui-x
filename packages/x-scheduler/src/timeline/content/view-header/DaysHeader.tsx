import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { DAYS_UNIT_COUNT } from '../../constants';
import { HeaderProps } from './Headers.types';
import './Headers.css';

export function DaysHeader(props: HeaderProps) {
  const { className, amount, ...other } = props;
  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);

  const days = React.useMemo(
    () =>
      getDayList({
        adapter,
        start: visibleDate,
        end: adapter.addDays(visibleDate, (amount || DAYS_UNIT_COUNT) - 1),
      }),
    [adapter, visibleDate, amount],
  );

  return (
    <div className={clsx('DaysHeader', className)} {...other}>
      {days.map((day, index) => (
        <div key={day.key} className="DayHeaderCell">
          {(adapter.getDate(day.value) === 1 || index === 0) && (
            <div className="MonthStart">
              <p className="MonthStartLabel">{adapter.format(day.value, 'month3Letters')}</p>
            </div>
          )}
          <time dateTime={day.key} className="DayHeaderTime">
            <span className="WeekDay" data-weekend={isWeekend(adapter, day.value) ? '' : undefined}>
              {adapter.format(day.value, 'weekday1Letter')}
            </span>
            <span
              className="DayNumber"
              data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
            >
              {adapter.format(day.value, 'dayOfMonth')}
            </span>
          </time>
        </div>
      ))}
    </div>
  );
}
