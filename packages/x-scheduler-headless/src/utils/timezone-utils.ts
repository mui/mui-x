import { TemporalTimezone } from '../base-ui-copy/types';
import { Adapter } from '../use-adapter';

export function getNowInRenderTimezone(adapter: Adapter, timezone: TemporalTimezone) {
  return adapter.now(timezone);
}

export function getStartOfTodayInRenderTimezone(adapter: Adapter, timezone: TemporalTimezone) {
  return adapter.startOfDay(getNowInRenderTimezone(adapter, timezone));
}
