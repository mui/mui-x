import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useDayList } from '@mui/x-scheduler-headless/use-day-list';
import { useWeekList } from '@mui/x-scheduler-headless/use-week-list';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { CalendarProcessedDate } from '@mui/x-scheduler-headless/models';
import { HeaderProps } from './Headers.types';
import { WEEKS_UNIT_COUNT } from '../../constants';
import './Headers.css';

export function WeeksHeader(props: HeaderProps) {
  const { className, amount, ...other } = props;

  const adapter = useAdapter();
  const getDayList = useDayList();
  const getWeekList = useWeekList();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);

  const weeks = React.useMemo(() => {
    const weeksFirstDays = getWeekList({
      date: visibleDate,
      amount: amount || WEEKS_UNIT_COUNT,
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
  }, [getWeekList, getDayList, visibleDate, amount]);

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
