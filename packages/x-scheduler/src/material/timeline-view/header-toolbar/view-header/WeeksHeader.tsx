import * as React from 'react';
import { DateTime } from 'luxon';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useDayList } from '../../../../primitives/use-day-list';
import { useWeekList } from '../../../../primitives/use-week-list';
import { selectors } from '../../../../primitives/use-event-calendar';
import { useEventCalendarStoreContext } from '../../../../primitives/utils/useEventCalendarStoreContext';
import './Headers.css';

const adapter = getAdapter();

export function WeeksHeader() {
  const getDayList = useDayList();
  const getWeekList = useWeekList();
  const store = useEventCalendarStoreContext();

  const visibleDate = useStore(store, selectors.visibleDate);

  const weeks = React.useMemo(() => {
    const weeksFirstDays = getWeekList({
      date: visibleDate,
      amount: 8,
    });

    const tempWeeks: { date: DateTime }[][] = [];
    for (let i = 0; i < weeksFirstDays.length; i += 1) {
      const weekStart = weeksFirstDays[i];
      const weekDays = getDayList({ date: weekStart, amount: 'week' });
      const weekDaysWithEvents = weekDays.map((date) => ({
        date: date.value,
      }));
      tempWeeks.push(weekDaysWithEvents);
    }

    return tempWeeks;
  }, [getWeekList, getDayList, visibleDate]);

  return (
    <div className="WeeksHeader">
      {weeks.map((week) => (
        <div
          key={`${adapter.format(week[0].date, 'keyboardDate')}-week`}
          className="TimeHeaderCell"
        >
          <div className="DayLabel">
            {adapter.format(week[0].date, 'normalDateWithWeekday')} -{' '}
            {adapter.format(week[6].date, 'normalDateWithWeekday')}
          </div>
          <div className="WeekDaysRow">
            {week.map((day) => (
              <div
                className="WeekDayCell WeekDay"
                data-weekend={isWeekend(adapter, day.date) ? '' : undefined}
              >
                {adapter.format(day.date, 'weekdayShort')}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
