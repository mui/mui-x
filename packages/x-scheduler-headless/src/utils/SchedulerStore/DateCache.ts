import { SchedulerProcessedDate } from '../../models';
import { SchedulerStore } from './SchedulerStore';

export class DateCache {
  /**
   * The keys of the outer map are timezones, the keys of the inner map are date keys.
   */
  private startOfDayCache = new Map<string, Map<string, SchedulerProcessedDate>>();

  private store: SchedulerStore<any, any, any, any>;

  constructor(store: SchedulerStore<any, any, any, any>) {
    this.store = store;
  }

  public startOfDay(date: SchedulerProcessedDate): SchedulerProcessedDate {
    let timezoneCache = this.startOfDayCache.get(date.timezone);
    if (!timezoneCache) {
      timezoneCache = new Map<string, SchedulerProcessedDate>();
      this.startOfDayCache.set(date.timezone, timezoneCache);
    }

    const cachedDate = timezoneCache.get(date.key);
    if (cachedDate) {
      return cachedDate;
    }

    const startOfDayDate = this.store.state.adapter.startOfDay(date.value);
    timezoneCache.set(date.key, startOfDayDate);
    return startOfDayDate;
  }
}
