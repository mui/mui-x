import type * as React from 'react';
import type { TemporalAdapter, TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { WeekStartsOn } from '@mui/x-scheduler-internals/models';
import type { PlainDate } from '@mui/x-scheduler-internals/internals';

export type EventTimelinePremiumPreset =
  'dayAndHour' | 'dayAndMonth' | 'dayAndWeek' | 'monthAndYear' | 'year';

/**
 * Time unit a header row (or the tick grid) operates on.
 */
export type PresetHeaderUnit = 'hour' | 'day' | 'week' | 'month' | 'year';

/**
 * Output of `iterate()` — describes one header cell's position in the visible range.
 */
export interface IteratedCell {
  /**
   * Date of the aligned start of the cell at its unit boundary (e.g. the first day of the month
   * for a `month` row), on the wall clock of the axis. For a partial first cell, it's before the
   * visible range.
   */
  plainDate: PlainDate;
  /** First date of the cell within the visible range. */
  firstPlainDate: PlainDate;
  /** Last date of the cell within the visible range. */
  lastPlainDate: PlainDate;
  /** Cell width measured in `tickUnit` ticks. */
  spanInTicks: number;
  /** Stable key derived from the aligned start. */
  key: string;
  /** Index within the row. */
  index: number;
  /**
   * Wall-clock hour the cell stands for, set on `hour` cells only. The hour skipped by a
   * spring-forward transition has no instant, but keeps its cell.
   */
  wallClockHour?: number;
}

/**
 * State exposed to a header level's `renderCell`.
 */
export interface PresetHeaderCellState extends IteratedCell {
  /** Index of the row within the preset's `headers` array (0 = topmost). */
  level: number;
  /** The unit this row operates on. */
  unit: PresetHeaderUnit;
  /** The locale the labels are formatted in. */
  locale: string;
  /** `true` if hour labels should be rendered with AM/PM. */
  ampm: boolean;
}

interface PresetHeaderLevelConfigBase {
  /** The time unit this row divides the visible range into. */
  unit: PresetHeaderUnit;
  /** A custom class name to apply to the cells in this header row. */
  className?: string;
}

/**
 * Configuration for one header row of a preset. Each level must provide either
 * `format` (text-only label) or `renderCell` (full React render), never both.
 */
export type PresetHeaderLevelConfig = PresetHeaderLevelConfigBase &
  (
    | {
        /** Formats the date of the aligned start of the cell into a string label. */
        format: (locale: string, plainDate: PlainDate) => string;
        renderCell?: undefined;
      }
    | {
        format?: undefined;
        /**
         * Renders the cell label from the full cell state. Use this when the
         * label needs more than the date of the aligned start (e.g. a range, multiple
         * spans, or preferences such as `ampm`).
         */
        renderCell: (state: PresetHeaderCellState) => React.ReactNode;
      }
  );

/**
 * Full definition of a preset. Bundles header definitions with grid-sizing,
 * range computation, and navigation behavior.
 */
export interface PresetDefinition {
  /**
   * Header rows to render, ordered top → bottom. At least one row is required.
   * The last row's `unit` does not need to match the preset's `timeResolution`:
   * the grid ticks use `timeResolution`, while each header row iterates over
   * its own `unit`.
   */
  headers: readonly [PresetHeaderLevelConfig, ...PresetHeaderLevelConfig[]];
  /** Smallest unit the grid snaps to. A cell's `spanInTicks` is measured in this unit. */
  timeResolution: PresetHeaderUnit;
  /** CSS px per tick (i.e. per `timeResolution` unit). */
  tickWidth: number;
  /**
   * Step size of one navigation period, expressed in the preset's navigation
   * unit (e.g. `4` days for `dayAndHour`, `36` months for `monthAndYear`).
   * Passed to `navigate` on next/previous jumps and to `getEndPlainDate` to
   * compute the visible range; also used as the CSS tick count when
   * `getCssUnitCount` is not provided.
   */
  unitCount: number;
  /**
   * Returns the first date of the visible range, from the date of the visible date in the
   * display timezone.
   */
  getStartPlainDate: (visiblePlainDate: PlainDate, weekStartsOn: WeekStartsOn) => PlainDate;
  /**
   * Returns the date after the last date of the visible range, `unitCount` periods after its
   * first date.
   */
  getEndPlainDate: (startPlainDate: PlainDate, unitCount: number) => PlainDate;
  /**
   * Returns the exact number of CSS ticks for the visible range, sized for the
   * full day. Override `unitCount` whenever the grid width must differ from the
   * navigation step: either because the count varies (e.g. `monthAndYear`, where
   * days per month differ) or because it has to stay stable against runtime
   * drift (e.g. `dayAndHour` pins it to `4 × 24` so the grid width does not
   * shrink on DST days). The displayed hour window scales the result in the
   * preset selector, so presets never see it. `endPlainDate` is the date after the range.
   */
  getCssUnitCount?: (startPlainDate: PlainDate, endPlainDate: PlainDate) => number;
  /**
   * Adds `amount` units (of the preset's navigation unit) to `date`. Called by
   * `goToNextVisibleDate` / `goToPreviousVisibleDate` with `amount = ±unitCount`.
   */
  navigate: (
    adapter: TemporalAdapter,
    date: TemporalSupportedObject,
    amount: number,
  ) => TemporalSupportedObject;
}

/**
 * Per-preset user configuration for the hour-resolution presets.
 */
export interface EventTimelinePremiumHourPresetConfig {
  /**
   * Inclusive start of the displayed hour range.
   * Must be a whole hour between 0 and 24, lower than `endTime`; otherwise the
   * full day is displayed and a warning is logged in development.
   * @default 0
   */
  startTime?: number;
  /**
   * Exclusive end of the displayed hour range: the last rendered hour cell is
   * `endTime - 1`, so `{ startTime: 8, endTime: 20 }` renders the cells 8 AM through
   * 7 PM and displays the 08:00–20:00 window (an event ending exactly at 20:00 is
   * still fully visible).
   * Must be a whole hour between 0 and 24, greater than `startTime`; otherwise the
   * full day is displayed and a warning is logged in development.
   * @default 24
   */
  endTime?: number;
}

/**
 * User configuration applied to each preset, keyed by the preset name.
 */
export interface EventTimelinePremiumPresetConfig {
  /**
   * Configuration applied to the `dayAndHour` preset.
   */
  dayAndHour?: EventTimelinePremiumHourPresetConfig;
}
