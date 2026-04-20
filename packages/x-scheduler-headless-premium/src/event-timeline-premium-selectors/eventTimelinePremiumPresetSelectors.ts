import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { TemporalAdapter } from '@mui/x-scheduler-headless/base-ui-copy';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import { TemporalSupportedObject, EventTimelinePremiumPreset } from '../models';

interface PresetConfig {
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
  // For presets like 'monthAndYear' where the number of days (and therefore CSS units) can vary, we need a way to calculate the exact number of units to display in the grid.
  getCssUnitCount?: (
    adapter: TemporalAdapter,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ) => number;
}

export const EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS: Record<
  EventTimelinePremiumPreset,
  PresetConfig
> = {
  dayAndHour: {
    unitCount: 4, // 4 days
    getStartDate: (adapter, visibleDate) => adapter.startOfDay(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfDay(adapter.addDays(start, unitCount - 1)),
    // Each CSS unit is 1 hour (--dayAndHour-cell-width), so we need days × 24 hours
    getCssUnitCount: () => 4 * 24,
  },
  day: {
    unitCount: 8 * 7, // 8 weeks
    getStartDate: (adapter, visibleDate) => adapter.startOfDay(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfDay(adapter.addDays(start, unitCount - 1)),
  },
  dayAndWeek: {
    unitCount: 16, // 16 weeks
    getStartDate: (adapter, visibleDate) => adapter.startOfWeek(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfWeek(adapter.addWeeks(start, unitCount - 1)),
  },
  monthAndYear: {
    unitCount: 3 * 12, // 3 years
    getStartDate: (adapter, visibleDate) => adapter.startOfMonth(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfMonth(adapter.addMonths(start, unitCount - 1)),
    getCssUnitCount: (adapter, start, end) => adapter.differenceInDays(end, start) + 1,
  },
  year: {
    unitCount: 30, // 30 years
    getStartDate: (adapter, visibleDate) => adapter.startOfYear(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfYear(adapter.addYears(start, unitCount - 1)),
  },
};

export const eventTimelinePremiumPresetSelectors = {
  preset: createSelector((state: State) => state.preset),
  presets: createSelector((state: State) => state.presets),
  config: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.visibleDate,
    (state: State) => state.preset,
    (adapter, visibleDate, preset) => {
      const { getStartDate, getEndDate, unitCount, getCssUnitCount } =
        EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS[preset];
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
