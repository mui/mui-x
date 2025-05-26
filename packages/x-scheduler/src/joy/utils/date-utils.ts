import { getAdapter } from '@mui/x-scheduler/primitives/utils/adapter/getAdapter';
import { DateTime } from 'luxon';

export function isWeekend(value: DateTime): boolean {
  const adapter = getAdapter();
  const dayOfWeek = adapter.getDayOfWeek(value);

  return dayOfWeek === 6 || dayOfWeek === 7;
}
