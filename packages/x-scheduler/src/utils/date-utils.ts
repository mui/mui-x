import { TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';

/**
 * @example "Sun, Jul 13"
 */
export function formatWeekDayMonthAndDayOfMonth(date: TemporalSupportedObject, adapter: Adapter) {
  const f = adapter.formats;
  const dateFormat = `${f.weekday3Letters}, ${f.month3Letters} ${f.dayOfMonth}`;

  return adapter.formatByString(date, dateFormat);
}
