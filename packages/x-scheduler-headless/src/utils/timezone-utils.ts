import { TemporalTimezone } from '../base-ui-copy/types';
import { Adapter } from '../use-adapter';

export function getStartOfTodayInRenderTimezone(adapter: Adapter, timezone: TemporalTimezone) {
  return adapter.startOfDay(adapter.now(timezone));
}
