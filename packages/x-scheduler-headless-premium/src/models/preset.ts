import * as React from 'react';
import { TemporalAdapter, TemporalSupportedObject } from '@mui/x-scheduler-headless/base-ui-copy';

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
 * State exposed to a header level's `renderCell`.
 */
export interface PresetHeaderCellState {
  /** Aligned start of the cell (may sit before the visible range). */
  date: TemporalSupportedObject;
  /** Clamped start of the cell, guaranteed to be within the visible range. */
  start: TemporalSupportedObject;
  /** Clamped end of the cell (exclusive), guaranteed to be within the visible range. */
  end: TemporalSupportedObject;
  /** Stable key derived from the cell's aligned start. */
  key: string;
  /** Index of the cell within its row. */
  index: number;
  /** Index of the row within the preset's `headers` array (0 = topmost). */
  level: number;
  /** The unit this row operates on. */
  unit: PresetHeaderUnit;
  /** How many ticks (of the preset's `timeResolution`) the cell spans. */
  spanInTicks: number;
  adapter: TemporalAdapter;
  /** `true` if hour labels should be rendered with AM/PM. */
  ampm: boolean;
}

/**
 * Configuration for one header row of a preset.
 */
export interface PresetHeaderLevelConfig {
  /** The time unit this row divides the visible range into. */
  unit: PresetHeaderUnit;
  /**
   * Formats the cell's aligned start date into a string label.
   * Ignored when `renderCell` is provided.
   */
  formatDate?: (adapter: TemporalAdapter, date: TemporalSupportedObject) => string;
  /**
   * Overrides the default label rendering. Receives the cell state and returns
   * any React node (string, fragment, element).
   */
  renderCell?: (state: PresetHeaderCellState) => React.ReactNode;
  /**
   * A custom class name to apply to the cells in this header row.
   */
  className?: string;
}

/**
 * Full configuration of a preset. Bundles header definitions with grid-sizing,
 * range computation, and navigation behavior.
 */
export interface PresetConfig {
  /**
   * Header rows to render, ordered top → bottom. The last row's `unit` does not
   * need to match the preset's `timeResolution`: the grid ticks use
   * `timeResolution`, while each header row iterates over its own `unit`.
   */
  headers: PresetHeaderLevelConfig[];
  /** Smallest unit the grid snaps to. A cell's `spanInTicks` is measured in this unit. */
  timeResolution: PresetHeaderUnit;
  /** CSS px per tick (i.e. per `timeResolution` unit). */
  tickWidth: number;
  /** Number of navigation units per period. Used by `navigate` and by the default tick count. */
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
   * For presets where the number of CSS ticks across the visible range varies
   * (e.g. `monthAndYear`, where the number of days depends on which months are
   * displayed), returns the exact tick count to use for CSS width.
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
