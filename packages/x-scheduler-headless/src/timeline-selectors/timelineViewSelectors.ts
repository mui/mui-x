import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { TimelineState as State } from '../use-timeline';
import { TemporalSupportedObject, TimelineView } from '../models';
import { TemporalAdapter } from '../base-ui-copy/types/temporal-adapter';

const TIMELINE_VIEW_CONFIGS: Record<
  TimelineView,
  {
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
  }
> = {
  time: {
    unitCount: 3, // 3 days
    getStartDate: (adapter, visibleDate) => adapter.startOfDay(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfDay(adapter.addDays(start, unitCount - 1)),
  },
  days: {
    unitCount: 3 * 7, // 3 weeks
    getStartDate: (adapter, visibleDate) => adapter.startOfDay(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfDay(adapter.addDays(start, unitCount - 1)),
  },
  weeks: {
    unitCount: 12, // 12 weeks
    getStartDate: (adapter, visibleDate) => adapter.startOfWeek(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfWeek(adapter.addWeeks(start, unitCount - 1)),
  },
  months: {
    unitCount: 2 * 12, // 2 years
    getStartDate: (adapter, visibleDate) => adapter.startOfMonth(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfMonth(adapter.addMonths(start, unitCount - 1)),
  },
  years: {
    unitCount: 15, // 15 years
    getStartDate: (adapter, visibleDate) => adapter.startOfYear(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfYear(adapter.addYears(start, unitCount - 1)),
  },
};

export const timelineViewSelectors = {
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  config: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.visibleDate,
    (state: State) => state.view,
    (adapter, visibleDate, view) => {
      const { getStartDate, getEndDate, unitCount } = TIMELINE_VIEW_CONFIGS[view];
      const start = getStartDate(adapter, visibleDate);
      const end = getEndDate(adapter, start, unitCount);

      return {
        unitCount,
        start,
        end,
      };
    },
  ),
};
