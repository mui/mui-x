import { Adapter } from '@mui/x-scheduler/primitives/utils/adapter/types';
import { DateTime } from 'luxon';

export function isWeekend(adapter: Adapter, value: DateTime): boolean {
  const dayOfWeek = adapter.getDayOfWeek(value);

  return dayOfWeek === 6 || dayOfWeek === 7;
}
