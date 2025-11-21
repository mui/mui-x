import { TemporalTimezone } from '../base-ui-copy/types';
import { Adapter } from '../use-adapter';

export function getRenderTimezone(timezone?: TemporalTimezone) {
  return timezone ?? 'default';
}

export function getNowInRenderTimezone(adapter: Adapter, timezone?: TemporalTimezone) {
  return adapter.now(getRenderTimezone(timezone));
}

export function getStartOfTodayInRenderTimezone(adapter: Adapter, timezone?: TemporalTimezone) {
  return adapter.startOfDay(getNowInRenderTimezone(adapter, timezone));
}
