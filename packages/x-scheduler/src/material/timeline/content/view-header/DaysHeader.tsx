import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter, isWeekend } from '../../../../primitives/use-adapter';
import { useDayList } from '../../../../primitives/use-day-list';
import { selectors } from '../../../../primitives/use-timeline';
import { useTimelineStoreContext } from '../../../../primitives/use-timeline-store-context';
import { DAYS_UNIT_COUNT } from '../../constants';
import { HeaderProps } from './Headers.types';
import './Headers.css';

export function DaysHeader(props: HeaderProps) {
  const { className, amount, ...other } = props;
  const adapter = useAdapter();
  const getDayList = useDayList();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, selectors.visibleDate);

  const days = React.useMemo(
    () =>
      getDayList({
        date: visibleDate,
        amount: amount || DAYS_UNIT_COUNT,
      }),
    [getDayList, visibleDate, amount],
  );

  return (
    <div className={clsx('DaysHeader', className)} {...other}>
      {days.map((day, index) => (
        <div key={day.key} className="DayHeaderCell">
          {(adapter.getDate(day.value) === 1 || index === 0) && (
            <div className="MonthStart">
              <p className="MonthStartLabel">{adapter.format(day.value, 'monthShort')}</p>
            </div>
          )}
          <time dateTime={day.key} className="DayHeaderTime">
            <span className="WeekDay" data-weekend={isWeekend(adapter, day.value) ? '' : undefined}>
              {adapter.format(day.value, 'weekdayShort')}
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
