import { Adapter } from '../use-adapter';

export function getRenderTimezone(timezone?: string) {
  return timezone ?? 'default';
}

export function getNowInRenderTimezone(adapter: Adapter, timezone?: string) {
  return adapter.now(getRenderTimezone(timezone));
}

export function getStartOfTodayInRenderTimezone(adapter: Adapter, timezone?: string) {
  return adapter.startOfDay(getNowInRenderTimezone(adapter, timezone));
}
