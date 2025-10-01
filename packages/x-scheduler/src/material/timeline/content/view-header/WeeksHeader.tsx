import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useDayList } from '../../../../primitives/use-day-list';
import { useWeekList } from '../../../../primitives/use-week-list';
import { selectors } from '../../../../primitives/use-timeline';
import { useTimelineStoreContext } from '../../../../primitives/utils/useTimelineStoreContext';
import { CalendarProcessedDate } from '../../../../primitives';
import { HeaderProps } from './Headers.types';
import { MONTHS_UNIT_COUNT } from '../../constants';
import './Headers.css';

export function WeeksHeader(props: HeaderProps) {
  const { className, amount, ...other } = props;

  const adapter = useAdapter();
  const getDayList = useDayList();
  const getWeekList = useWeekList();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, selectors.visibleDate);

  const weeks = React.useMemo(() => {
    const weeksFirstDays = getWeekList({
      date: visibleDate,
      amount: amount || MONTHS_UNIT_COUNT,
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
    <div className={clsx('WeeksHeader', className)} {...other}>
      {weeks.map((week) => (
        <div key={`${week[0].date.key}-week`} className="TimeHeaderCell">
          <div className="DayLabel">
            {adapter.format(week[0].date.value, 'normalDateWithWeekday')} -{' '}
            {adapter.format(week[6].date.value, 'normalDateWithWeekday')}
          </div>
          <div className="WeekDaysRow">
            {week.map((day) => (
              <time
                dateTime={day.date.key}
                key={day.date.key}
                className="WeekDayCell WeekDay"
                data-weekend={isWeekend(adapter, day.date.value) ? '' : undefined}
              >
                {adapter.format(day.date.value, 'weekdayShort')}
              </time>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
