import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';
import { HeaderProps } from './Headers.types';
import { formatWeekDayMonthAndDayOfMonth } from '../../../internals/utils/date-utils';
import { WEEKS_UNIT_COUNT } from '../../constants';
import './Headers.css';

export function WeeksHeader(props: HeaderProps) {
  const { className, amount, ...other } = props;

  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);

  const weeks = React.useMemo(() => {
    const weekCount = amount || WEEKS_UNIT_COUNT;
    const days = getDayList({
      adapter,
      start: adapter.startOfWeek(visibleDate),
      end: adapter.endOfWeek(adapter.addWeeks(visibleDate, weekCount - 1)),
    });

    const tempWeeks: SchedulerProcessedDate[][] = [];
    let weekNumber: number | null = null;
    for (const day of days) {
      const lastWeek = tempWeeks[tempWeeks.length - 1];
      const dayWeekNumber = adapter.getWeekNumber(day.value);
      if (weekNumber !== dayWeekNumber) {
        weekNumber = dayWeekNumber;
        tempWeeks.push([day]);
      } else {
        lastWeek.push(day);
      }
    }
    return tempWeeks;
  }, [adapter, amount, visibleDate]);

  return (
    <div className={clsx('WeeksHeader', className)} {...other}>
      {weeks.map((week) => (
        <div key={`${week[0].key}-week`} className="TimeHeaderCell">
          <div className="DayLabel">
            {formatWeekDayMonthAndDayOfMonth(week[0].value, adapter)} -{' '}
            {formatWeekDayMonthAndDayOfMonth(week[6].value, adapter)}
          </div>
          <div className="WeekDaysRow">
            {week.map((day) => (
              <time
                dateTime={day.key}
                key={day.key}
                className="WeekDayCell WeekDay"
                data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
              >
                {adapter.format(day.value, 'weekday1Letter')}
              </time>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
