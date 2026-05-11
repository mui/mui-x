import * as React from 'react';
import { TemporalAdapter, TemporalSupportedObject } from '@mui/x-scheduler-internals/base-ui-copy';

export type EventTimelinePremiumPreset =
  | 'dayAndHour'
  | 'dayAndMonth'
  | 'dayAndWeek'
  | 'monthAndYear'
  | 'year';

/**
 * Time unit a header row (or the tick grid) operates on.
 */
export type PresetHeaderUnit = 'hour' | 'day' | 'week' | 'month' | 'year';

/**
 * Output of `iterate()` — describes one header cell's position in the visible range.
 */
export interface IteratedCell {
  /**
   * Aligned start of the cell at its unit boundary (e.g. first day of month for a
   * `month` row). Always `<= start`; for a partial first cell it sits before the
   * visible range, so use `start` / `end` for layout math and `date` for labels.
   */
  date: TemporalSupportedObject;
  /** Clamped start, always within the visible range. */
  start: TemporalSupportedObject;
  /** Clamped end (exclusive), always within the visible range. */
  end: TemporalSupportedObject;
  /** Cell width measured in `tickUnit` ticks. */
  spanInTicks: number;
  /** Stable key derived from the aligned start. */
  key: string;
  /** Index within the row. */
  index: number;
}

/**
 * State exposed to a header level's `renderCell`.
 */
export interface PresetHeaderCellState extends IteratedCell {
  /** Index of the row within the preset's `headers` array (0 = topmost). */
  level: number;
  /** The unit this row operates on. */
  unit: PresetHeaderUnit;
  adapter: TemporalAdapter;
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
 * `formatDate` (text-only label) or `renderCell` (full React render), never both.
 */
export type PresetHeaderLevelConfig = PresetHeaderLevelConfigBase &
  (
    | {
        /** Formats the cell's aligned start date into a string label. */
        formatDate: (adapter: TemporalAdapter, date: TemporalSupportedObject) => string;
        renderCell?: undefined;
      }
    | {
        formatDate?: undefined;
        /**
         * Renders the cell label from the full cell state. Use this when the
         * label needs more than the aligned start date (e.g. a range, multiple
         * spans, or preferences such as `ampm`).
         */
        renderCell: (state: PresetHeaderCellState) => React.ReactNode;
      }
  );

/**
 * Full configuration of a preset. Bundles header definitions with grid-sizing,
 * range computation, and navigation behavior.
 */
export interface PresetConfig {
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
   * Passed to `navigate` on next/previous jumps and to `getEndDate` to
   * compute the visible range; also used as the CSS tick count when
   * `getCssUnitCount` is not provided.
   */
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
  /**
   * Returns the exact number of CSS ticks for the visible range. Override
   * `unitCount` whenever the grid width must differ from the navigation step:
   * either because the count varies (e.g. `monthAndYear`, where days per
   * month differ) or because it has to stay stable against runtime drift
   * (e.g. `dayAndHour` pins it to `4 × 24` so the grid width does not shrink
   * on DST days).
   */
  getCssUnitCount?: (
    adapter: TemporalAdapter,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ) => number;
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
