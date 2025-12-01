import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { HeaderProps } from './Headers.types';
import { TIME_UNIT_COUNT } from '../../constants';
import { useFormatTime } from '../../../internals/hooks/useFormatTime';
import { formatWeekDayMonthAndDayOfMonth } from '../../../internals/utils/date-utils';
import './Headers.css';

export function TimeHeader(props: HeaderProps) {
  const { className, amount, ...other } = props;

  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);
  const formatTime = useFormatTime();

  const days = React.useMemo(
    () =>
      getDayList({
        adapter,
        start: visibleDate,
        end: adapter.addDays(visibleDate, (amount || TIME_UNIT_COUNT) - 1),
      }),
    [adapter, visibleDate, amount],
  );

  return (
    <div className={clsx('TimeHeader', className)} {...other}>
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
