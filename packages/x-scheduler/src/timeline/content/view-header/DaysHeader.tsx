import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { timelineViewSelectors } from '@mui/x-scheduler-headless/timeline-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import './Headers.css';

export function DaysHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  // Context hooks
  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  // Selector hooks
  const viewConfig = useStore(store, timelineViewSelectors.config);

  // Feature hooks
  const days = React.useMemo(
    () => getDayList({ adapter, start: viewConfig.start, end: viewConfig.end }),
    [adapter, viewConfig],
  );

  return (
    <div className={clsx('DaysHeader', props.className)} {...props}>
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
