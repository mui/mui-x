import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { timelineViewSelectors } from '@mui/x-scheduler-headless/timeline-selectors';
import { useFormatTime } from '../../../internals/hooks/useFormatTime';
import { formatWeekDayMonthAndDayOfMonth } from '../../../internals/utils/date-utils';
import './Headers.css';

export function TimeHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  // Context hooks
  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  // Selector hooks
  const viewConfig = useStore(store, timelineViewSelectors.config);

  // Feature hooks
  const formatTime = useFormatTime();

  const days = React.useMemo(
    () => getDayList({ adapter, start: viewConfig.start, end: viewConfig.end }),
    [adapter, viewConfig],
  );

  return (
    <div className={clsx('TimeHeader', props.className)} {...props}>
      {days.map((day) => (
        <div key={day.key} className="TimeHeaderCell">
          <time dateTime={day.key} className="DayLabel">
            {formatWeekDayMonthAndDayOfMonth(day.value, adapter)}
          </time>
          <div className="TimeCellsRow">
            {/* TODO: Make sure it works across DST */}
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className="TimeCell"
                style={{ '--hour': hour } as React.CSSProperties}
              >
                <time className="TimeLabel">{formatTime(adapter.setHours(day.value, hour))}</time>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
