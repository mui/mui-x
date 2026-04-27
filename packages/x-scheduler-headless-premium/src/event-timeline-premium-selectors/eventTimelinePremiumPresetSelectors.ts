import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import { EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS } from '../internals/utils/preset-utils';

export const eventTimelinePremiumPresetSelectors = {
  preset: createSelector((state: State) => state.preset),
  presets: createSelector((state: State) => state.presets),
  config: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.visibleDate,
    (state: State) => state.preset,
    (adapter, visibleDate, preset) => {
      const { getStartDate, getEndDate, unitCount, getCssUnitCount, tickWidth, headers } =
        EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS[preset];
      const start = getStartDate(adapter, visibleDate);
      const end = getEndDate(adapter, start, unitCount);

      return {
        unitCount: getCssUnitCount ? getCssUnitCount(adapter, start, end) : unitCount,
        start,
        end,
        tickWidth,
        headers,
      };
    },
  ),
};
