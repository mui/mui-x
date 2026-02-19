import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { TemporalAdapter } from '@mui/x-scheduler-headless/base-ui-copy';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import { TemporalSupportedObject, EventTimelinePremiumView } from '../models';

interface ViewConfig {
  unitCount: number;
  getStartDate: (
    adapter: TemporalAdapter,
    visibleDate: TemporalSupportedObject,
  ) => TemporalSupportedObject;
  getEndDate: (
    adapter: TemporalAdapter,
    start: TemporalSupportedObject,
    unitCount: number,
  ) => TemporalSupportedObject;
  // For views like 'months' where the number of days (and therefore CSS units) can vary, we need a way to calculate the exact number of units to display in the grid.
  getCssUnitCount?: (
    adapter: TemporalAdapter,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ) => number;
}

const EVENT_TIMELINE_PREMIUM_VIEW_CONFIGS: Record<EventTimelinePremiumView, ViewConfig> = {
  time: {
    unitCount: 4, // 4 days
    getStartDate: (adapter, visibleDate) => adapter.startOfDay(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfDay(adapter.addDays(start, unitCount - 1)),
  },
  days: {
    unitCount: 8 * 7, // 8 weeks
    getStartDate: (adapter, visibleDate) => adapter.startOfDay(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfDay(adapter.addDays(start, unitCount - 1)),
  },
  weeks: {
    unitCount: 16, // 16 weeks
    getStartDate: (adapter, visibleDate) => adapter.startOfWeek(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfWeek(adapter.addWeeks(start, unitCount - 1)),
  },
  months: {
    unitCount: 3 * 12, // 3 years
    getStartDate: (adapter, visibleDate) => adapter.startOfMonth(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfMonth(adapter.addMonths(start, unitCount - 1)),
    getCssUnitCount: (adapter, start, end) => adapter.differenceInDays(end, start) + 1,
  },
  years: {
    unitCount: 30, // 30 years
    getStartDate: (adapter, visibleDate) => adapter.startOfYear(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfYear(adapter.addYears(start, unitCount - 1)),
  },
};

export const eventTimelinePremiumViewSelectors = {
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  config: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.visibleDate,
    (state: State) => state.view,
    (adapter, visibleDate, view) => {
      const { getStartDate, getEndDate, unitCount, getCssUnitCount } =
        EVENT_TIMELINE_PREMIUM_VIEW_CONFIGS[view];
      const start = getStartDate(adapter, visibleDate);
      const end = getEndDate(adapter, start, unitCount);

      return {
        unitCount: getCssUnitCount ? getCssUnitCount(adapter, start, end) : unitCount,
        start,
        end,
      };
    },
  ),
};
