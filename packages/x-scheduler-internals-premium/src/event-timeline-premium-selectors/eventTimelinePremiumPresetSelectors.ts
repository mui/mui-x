import { createSelectorMemoized } from '@base-ui/utils/store';
import {
  schedulerOtherSelectors,
  schedulerPreferenceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  getDisplayedHourRange,
  getTimelineAxisDayMs,
  FULL_DAY_MINUTES,
  toEpochMs,
} from '@mui/x-scheduler-internals/internals';
import type { TimelineAxis } from '@mui/x-scheduler-internals/internals';
import type { EventTimelinePremiumPresetConfig } from '../models/preset';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import {
  EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS,
  getDayCount,
} from '../internals/utils/preset-utils';

export const eventTimelinePremiumPresetSelectors = {
  preset: (state: State) => state.preset,
  presets: (state: State) => state.presets,
  config: createSelectorMemoized(
    // Read in the display timezone, like the visible date of the Event Calendar views.
    schedulerOtherSelectors.visiblePlainDate,
    schedulerOtherSelectors.displayTimezone,
    (state: State) => state.preset,
    // Primitive inputs so an inline `presetConfig` literal cannot defeat the
    // memoization (the object identity changes on every parent render).
    (state: State) =>
      state.presetConfig[state.preset as keyof EventTimelinePremiumPresetConfig]?.startTime,
    (state: State) =>
      state.presetConfig[state.preset as keyof EventTimelinePremiumPresetConfig]?.endTime,
    schedulerPreferenceSelectors.weekStartsOn,
    (visiblePlainDate, displayTimezone, preset, presetStartTime, presetEndTime, weekStartsOn) => {
      const config = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS[preset];
      if (!config) {
        throw new Error(
          `MUI X Scheduler: No configuration registered for preset "${preset}". ` +
            `TimelineGridHeader cannot derive header rows or grid sizing without a config, so the timeline would render incorrectly. ` +
            `Use one of the built-in presets ("dayAndHour", "dayAndMonth", "dayAndWeek", "monthAndYear", "year").`,
        );
      }
      const {
        getStartPlainDate,
        getEndPlainDate,
        unitCount,
        getCssUnitCount,
        tickWidth,
        headers,
        timeResolution,
      } = config;
      const startPlainDate = getStartPlainDate(visiblePlainDate, weekStartsOn);
      const endPlainDate = getEndPlainDate(startPlainDate, unitCount);

      // Only hour-resolution presets can trim their visible hours. The range itself stays
      // midnight-based: the hour window is applied through `dayStartMinute` / `dayEndMinute`.
      const hourRange =
        timeResolution === 'hour'
          ? getDisplayedHourRange(presetStartTime, presetEndTime, `presetConfig.${preset}`)
          : { startTime: 0, endTime: 24 };
      const dayStartMinute = hourRange.startTime * 60;
      const dayEndMinute = hourRange.endTime * 60;

      // Preset callbacks size the grid for the full day; the hour window scales the
      // tick count once here instead of threading it through every preset.
      const fullDayTickCount = getCssUnitCount
        ? getCssUnitCount(startPlainDate, endPlainDate)
        : unitCount;
      const tickCount =
        timeResolution === 'hour'
          ? (fullDayTickCount * (dayEndMinute - dayStartMinute)) / FULL_DAY_MINUTES
          : fullDayTickCount;

      // The config is the axis of the timeline: the first instant of its first date, the last
      // instant before the date after it, and its hour window.
      const axis: TimelineAxis = {
        start: toEpochMs(startPlainDate, 0, displayTimezone),
        end: toEpochMs(endPlainDate, 0, displayTimezone) - 1,
        timezone: displayTimezone,
        dayStartMinute,
        dayEndMinute,
      };

      return {
        ...axis,
        // The dates of the range, which the header walks.
        startPlainDate,
        endPlainDate,
        tickCount,
        tickWidth,
        headers,
        timeResolution,
        // Precomputed once per config change: per-row hooks read it on every render. One day of
        // the window per date, like the header and the ticks, even for a date the timezone skips.
        durationMs: getDayCount(startPlainDate, endPlainDate) * getTimelineAxisDayMs(axis),
      };
    },
  ),
};
