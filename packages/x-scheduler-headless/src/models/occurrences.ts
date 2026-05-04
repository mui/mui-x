import type { SchedulerEventOccurrence } from './event';

/**
 * Indexed snapshot of occurrences for the visible range, with a per-day key list.
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
   * Lanes occupied in this container. Precomputed for O(1) lane-availability lookups.
   */
  usedLanes: ReadonlySet<number>;
  /**
   * Largest lane used in this container.
   */
  maxLane: number;
}

/**
 * Atomic per-occurrence record inside a day-grid container.
 *
 * Bundles lane + cell-span + visibility into a single object so the layout cannot be
 * inconsistent (e.g. a key present in one map but missing from another).
 */
export interface DayGridContainerSlot extends OccurrenceLanePosition {
  /**
   * How many consecutive cells the occurrence spans starting at this container.
   * Always 1 for single-cell occurrences and for continuation cells.
   */
  cellSpan: number;
  /**
   * Whether this is a continuation marker that should render invisibly (it only reserves
   * its lane in this container; the visible block is rendered in the occurrence's
   * starting container).
   */
  isInvisible: boolean;
}

/**
 * Day-grid extension of `OccurrenceContainerLayout`.
 *
 * In a day-grid (Month view, all-day strip), an occurrence can span multiple cells
 * (multi-day events). On continuation cells the same lane is reserved invisibly.
 *
 * The `slotByKey` map is keyed identically to `orderedKeys` and carries the full
 * per-occurrence record. Every key in `orderedKeys` has an entry in `slotByKey`.
 */
export interface DayGridContainerLayout extends OccurrenceContainerLayout {
  /**
   * Per-occurrence day-grid record. Every key in `orderedKeys` has an entry.
   * Use this instead of `positionByKey` to read lane + span + visibility atomically.
   */
  slotByKey: ReadonlyMap<string, DayGridContainerSlot>;
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
