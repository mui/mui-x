import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { selectors } from '../../../../primitives/use-timeline';
import { useTimelineStoreContext } from '../../../../primitives/utils/useTimelineStoreContext';
import { SchedulerValidDate } from '../../../../primitives/models';
import './Headers.css';

const adapter = getAdapter();

const getYears = (date: SchedulerValidDate, amount: number) => {
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
  const store = useTimelineStoreContext();

  const visibleDate = useStore(store, selectors.visibleDate);

  const years = getYears(visibleDate, 4);

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
