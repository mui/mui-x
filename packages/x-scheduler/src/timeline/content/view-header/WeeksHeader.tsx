import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { timelineViewSelectors } from '@mui/x-scheduler-headless/timeline-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';
import { formatWeekDayMonthAndDayOfMonth } from '../../../internals/utils/date-utils';
import './Headers.css';

export function WeeksHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  // Context hooks
  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  // Selector hooks
  const viewConfig = useStore(store, timelineViewSelectors.config);

  // Feature hooks
  const weeks = React.useMemo(() => {
    const days = getDayList({
      adapter,
      start: viewConfig.start,
      end: adapter.endOfWeek(viewConfig.end),
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
  }, [adapter, viewConfig]);

  return (
    <div className={clsx('WeeksHeader', props.className)} {...props}>
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
