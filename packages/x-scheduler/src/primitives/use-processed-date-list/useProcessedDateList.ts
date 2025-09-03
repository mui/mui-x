import * as React from 'react';
import { CalendarProcessedDate, SchedulerValidDate } from '../models';
import { useAdapter } from '../utils/adapter/useAdapter';
import { processDate } from '../utils/event-utils';

/**
 * Processes a list of dates into a format that contains all the information frequently used by the Event Calendar.
 */
export function useProcessedDateList(dates: SchedulerValidDate[]): CalendarProcessedDate[] {
  const adapter = useAdapter();
  return React.useMemo(() => dates.map((date) => processDate(date, adapter)), [adapter, dates]);
}
