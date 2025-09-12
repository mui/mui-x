import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useDayList } from '../../../../primitives/use-day-list';
import { useMonthList } from '../../../../primitives/use-month-list';
import { selectors } from '../../../../primitives/use-event-calendar';
import { useEventCalendarContext } from '../../../internals/hooks/useEventCalendarContext';
import './Headers.css';

const adapter = getAdapter();

export function MonthsHeader() {
  const getMonthList = useMonthList();
  const { store } = useEventCalendarContext();

  const visibleDate = useStore(store, selectors.visibleDate);

  const months = React.useMemo(
    () =>
      getMonthList({
        date: visibleDate,
        amount: 12,
      }),
    [getMonthList],
  );

  return (
    <div className="MonthsHeader">
      {months.map((month, index) => {
        const monthNumber = adapter.getMonth(month);
        return (
          <React.Fragment key={`${adapter.format(month, 'monthShort')}-${adapter.getYear(month)}`}>
            {(monthNumber === 0 || index === 0) && (
              <div
                className="YearLabel"
                style={
                  {
                    '--grid-column': index + 1,
                    '--columns-span': Math.min(12, months.length - index - 1) - monthNumber + 1,
                  } as React.CSSProperties
                }
              >
                {adapter.getYear(month)}
              </div>
            )}
            <div className="MonthLabel">{adapter.format(month, 'monthShort')}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
