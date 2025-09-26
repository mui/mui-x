import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { Adapter } from '../../../../primitives/utils/adapter/types';
import { selectors } from '../../../../primitives/use-timeline';
import { useTimelineStoreContext } from '../../../../primitives/utils/useTimelineStoreContext';
import { SchedulerValidDate } from '../../../../primitives/models';
import './Headers.css';

const getYears = (adapter: Adapter, date: SchedulerValidDate, amount: number) => {
  const end = adapter.startOfYear(adapter.addYears(date, amount));

  let current = date;
  const years: SchedulerValidDate[] = [];

  while (adapter.isBefore(current, end)) {
    years.push(current);

    current = adapter.addYears(current, 1);
  }

  return years;
};

export function YearHeader() {
  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, selectors.visibleDate);

  const years = getYears(adapter, visibleDate, 4);

  return (
    <div className="YearsHeader">
      {years.map((year) => (
        <div key={`${adapter.getYear(year)}`} className="YearLabel">
          {adapter.getYear(year)}
        </div>
      ))}
    </div>
  );
}
