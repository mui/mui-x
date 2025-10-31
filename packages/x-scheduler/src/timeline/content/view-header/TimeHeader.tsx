import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useDayList } from '@mui/x-scheduler-headless/use-day-list';
import { selectors } from '@mui/x-scheduler-headless/use-timeline';

import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { HeaderProps } from './Headers.types';
import { TIME_UNITS_COUNT } from '../../constants';
import { useFormatTime } from '../../../internals/hooks/useFormatTime';
import './Headers.css';

export function TimeHeader(props: HeaderProps) {
  const { className, amount, ...other } = props;

  const adapter = useAdapter();
  const getDayList = useDayList();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, selectors.visibleDate);
  const formatTime = useFormatTime();

  const days = React.useMemo(
    () =>
      getDayList({
        date: visibleDate,
        amount: amount || TIME_UNITS_COUNT,
      }),
    [getDayList, visibleDate, amount],
  );

  return (
    <div className={clsx('TimeHeader', className)} {...other}>
      {days.map((day) => (
        <div key={day.key} className="TimeHeaderCell">
          <time dateTime={day.key} className="DayLabel">
            {adapter.format(day.value, 'normalDateWithWeekday')}
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
