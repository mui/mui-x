import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { useDayList } from '../../../../primitives/use-day-list';
import { selectors } from '../../../../primitives/use-timeline';
import { useTimelineStoreContext } from '../../../../primitives/utils/useTimelineStoreContext';

import './Headers.css';

export function TimeHeader() {
  const adapter = useAdapter();
  const getDayList = useDayList();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, selectors.visibleDate);
  const ampm = useStore(store, selectors.ampm);

  const timeFormat = ampm ? 'hoursMinutes12h' : 'hoursMinutes24h';

  const days = React.useMemo(
    () =>
      getDayList({
        date: visibleDate,
        amount: 3,
      }),
    [getDayList, visibleDate],
  );

  return (
    <div className="TimeHeader">
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
                <time className="TimeLabel">
                  {adapter.format(adapter.setHours(day.value, hour), timeFormat)}
                </time>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
