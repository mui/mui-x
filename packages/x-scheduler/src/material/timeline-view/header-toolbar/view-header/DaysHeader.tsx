import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useDayList } from '../../../../primitives/use-day-list';
import { selectors } from '../../../../primitives/use-event-calendar';
import { useEventCalendarContext } from '../../../internals/hooks/useEventCalendarContext';
import './Headers.css';

const adapter = getAdapter();

export function DaysHeader() {
  const getDayList = useDayList();
  const { store } = useEventCalendarContext();

  const visibleDate = useStore(store, selectors.visibleDate);

  const days = React.useMemo(
    () =>
      getDayList({
        date: visibleDate,
        amount: 21,
      }),
    [getDayList, visibleDate],
  );

  return (
    <div className="DaysHeader">
      {days.map((day, index) => (
        <div key={adapter.format(day, 'keyboardDate')} className="DayHeaderCell">
          {(adapter.startOfMonth(day).hasSame(day, 'day') || index === 0) && (
            <div className="MonthStart">
              <p className="MonthStartLabel">{adapter.format(day, 'monthShort')}</p>
            </div>
          )}
          <p className="WeekDay" data-weekend={isWeekend(adapter, day) ? '' : undefined}>
            {adapter.format(day, 'weekdayShort')}
          </p>
          <p className="DayNumber" data-weekend={isWeekend(adapter, day) ? '' : undefined}>
            {adapter.format(day, 'dayOfMonth')}
          </p>
        </div>
      ))}
    </div>
  );
}
