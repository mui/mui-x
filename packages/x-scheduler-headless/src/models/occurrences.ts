import type { SchedulerEventOccurrence } from './event';

/**
 * O(1)-indexed snapshot of the occurrences that should render in a calendar view,
 * along with a per-day key list for fast cell-level reads.
 */
export interface SchedulerOccurrencesByDay {
  /**
   * Lookup by occurrence key. Returns the full occurrence object.
   */
  byKey: ReadonlyMap<string, SchedulerEventOccurrence>;
  /**
   * For each day key, the list of occurrence keys that should render on that day.
   * Multi-day occurrences appear in each of their day's entries.
   */
  keysByDay: ReadonlyMap<string, readonly string[]>;
  /**
   * Day keys in render order.
   */
  dayKeys: readonly string[];
}

/**
 * Axis-agnostic lane span for a single occurrence inside its container.
 *
 * Whether `firstLane` becomes a CSS row index, a CSS column index or something else
 * is decided at the leaf component / CSS layer; the data layer doesn't know.
 *
 * Used by all three layouts: day-grid (Month + all-day strip), time-grid (Day/Week)
 * and timeline (premium).
 */
export interface OccurrenceLanePosition {
  /**
   * 1-based first lane occupied in the container.
   */
  firstLane: number;
  /**
   * 1-based last lane occupied in the container (>= `firstLane`).
   * For layouts that do not span lanes, this equals `firstLane`.
   */
  lastLane: number;
}

/**
 * Layout of all the occurrences inside a single container (a day cell, a day's time column,
 * or a resource row).
 */
export interface OccurrenceContainerLayout {
  /**
   * Occurrence keys in render order, sorted by lane.
   */
  orderedKeys: readonly string[];
  /**
   * Lane position for each occurrence in this container.
   */
  positionByKey: ReadonlyMap<string, OccurrenceLanePosition>;
  /**
   * Lanes already used in this container. Precomputed so placeholder hooks
   * don't have to rebuild this Set at read time.
   */
  usedLanes: ReadonlySet<number>;
  /**
   * Largest lane used in this container.
   */
  maxLane: number;
}

/**
 * Day-grid extension of `OccurrenceContainerLayout`.
 *
 * In a day-grid (Month view, all-day strip), an occurrence can span multiple cells
 * (multi-day events). On continuation cells the same lane is reserved invisibly.
 */
export interface DayGridContainerLayout extends OccurrenceContainerLayout {
  /**
   * For each occurrence visible in this container: how many consecutive cells the
   * occurrence spans starting at this container. Always 1 for single-cell occurrences.
   */
  cellSpanByKey: ReadonlyMap<string, number>;
  /**
   * Subset of `orderedKeys` that are continuation markers and should render invisibly
   * (they only reserve their lane in this container; the visible block is rendered in the
   * occurrence's starting container).
   */
  invisibleKeys: ReadonlySet<string>;
}

/**
 * Snapshot of the position information for a calendar view or timeline.
 *
 * Containers are keyed by `dayKey` for the day-grid and time-grid layouts,
 * and by `resourceId` for the timeline.
 */
export interface SchedulerOccurrencePositions<
  TLayout extends OccurrenceContainerLayout = OccurrenceContainerLayout,
> {
  /**
   * Global lookup of an occurrence's lane position by its key.
   * For day-grid layouts, this returns the position from the container the occurrence
   * starts in (continuation containers carry the same lane).
   */
  positionByKey: ReadonlyMap<string, OccurrenceLanePosition>;
  /**
   * Layout for each container in the view.
   */
  byContainer: ReadonlyMap<string, TLayout>;
  /**
   * Largest lane used across the entire view.
   */
  maxLane: number;
}
