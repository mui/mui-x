import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useDayList } from '../../../../primitives/use-day-list';
import { useWeekList } from '../../../../primitives/use-week-list';
import { selectors } from '../../../../primitives/use-timeline';
import { useTimelineStoreContext } from '../../../../primitives/utils/useTimelineStoreContext';
import { CalendarProcessedDate } from '../../../../primitives';
import './Headers.css';

export function WeeksHeader() {
  const adapter = useAdapter();
  const getDayList = useDayList();
  const getWeekList = useWeekList();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, selectors.visibleDate);

  const weeks = React.useMemo(() => {
    const weeksFirstDays = getWeekList({
      date: visibleDate,
      amount: 8,
    });

    const tempWeeks: { date: CalendarProcessedDate }[][] = [];
    for (let i = 0; i < weeksFirstDays.length; i += 1) {
      const weekStart = weeksFirstDays[i];
      const weekDays = getDayList({ date: weekStart, amount: 'week' });
      const processedWeekDays = weekDays.map((date) => ({
        date,
      }));
      tempWeeks.push(processedWeekDays);
    }

    return tempWeeks;
  }, [getWeekList, getDayList, visibleDate]);

  return (
    <div className="WeeksHeader">
      {weeks.map((week) => (
        <div key={`${week[0].date.key}-week`} className="TimeHeaderCell">
          <div className="DayLabel">
            {adapter.format(week[0].date.value, 'normalDateWithWeekday')} -{' '}
            {adapter.format(week[6].date.value, 'normalDateWithWeekday')}
          </div>
          <div className="WeekDaysRow">
            {week.map((day) => (
              <div
                className="WeekDayCell WeekDay"
                data-weekend={isWeekend(adapter, day.date.value) ? '' : undefined}
              >
                {adapter.format(day.date.value, 'weekdayShort')}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
