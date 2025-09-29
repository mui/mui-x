import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useDayList } from '../../../../primitives/use-day-list';
import { selectors } from '../../../../primitives/use-timeline';
import { useTimelineStoreContext } from '../../../../primitives/utils/useTimelineStoreContext';

import './Headers.css';

export function DaysHeader() {
  const adapter = useAdapter();
  const getDayList = useDayList();
  const store = useTimelineStoreContext();

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
        <div key={day.key} className="DayHeaderCell">
          {(adapter.startOfMonth(day.value).hasSame(day.value, 'day') || index === 0) && (
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
