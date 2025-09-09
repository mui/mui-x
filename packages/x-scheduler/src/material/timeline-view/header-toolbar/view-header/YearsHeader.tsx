import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { useMonthList } from '../../../../primitives/use-month-list';
import { selectors } from '../../../../primitives/use-event-calendar';
import { useEventCalendarContext } from '../../../internals/hooks/useEventCalendarContext';
import { SchedulerValidDate } from '../../../../primitives/models';
import './Headers.css';

const adapter = getAdapter();

const getYears = ({ date, amount }) => {
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
  const { store } = useEventCalendarContext();

  const visibleDate = useStore(store, selectors.visibleDate);

  const years = getYears({
    date: visibleDate,
    amount: 4,
  });
  console.log(years);

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
