import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { diffIn, isWeekend } from '../../../../primitives/utils/date-utils';
import { useDayList } from '../../../../primitives/use-day-list';
import { selectors } from '../../../../primitives/use-event-calendar';
import { useEventCalendarContext } from '../../../internals/hooks/useEventCalendarContext';
import './Headers.css';

const adapter = getAdapter();

export function TimeHeader({ start, end }) {
  const getDayList = useDayList();
  const { store } = useEventCalendarContext();

  const visibleDate = useStore(store, selectors.visibleDate);
  const ampm = useStore(store, selectors.ampm);

  const timeFormat = ampm ? 'hoursMinutes12h' : 'hoursMinutes24h';

  const daysDiff = diffIn(adapter, end, start, 'days');

  const days = React.useMemo(
    () =>
      getDayList({
        date: visibleDate,
        amount: daysDiff,
      }),
    [getDayList, visibleDate],
  );

  return (
    <div className="TimeHeader">
      {days.map((day) => (
        <div key={adapter.format(day, 'keyboardDate')} className="TimeHeaderCell">
          <div className="DayLabel">{adapter.format(day, 'normalDateWithWeekday')}</div>
          <div className="TimeCellsRow">
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className="TimeCell"
                style={{ '--hour': hour } as React.CSSProperties}
              >
                <time className="TimeLabel">
                  {adapter.format(adapter.setHours(day, hour), timeFormat)}
                </time>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
