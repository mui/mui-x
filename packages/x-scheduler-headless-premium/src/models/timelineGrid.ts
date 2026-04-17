/**
 * The type of column in the timeline grid.
 * - `'title'` — the resource name column on the left
 * - `'events'` — the events column on the right
 */
export type TimelineGridColumnType = 'title' | 'events';

/**
 * The coordinates of a focused cell in the timeline grid.
 */
export interface TimelineGridCellCoordinates {
  readonly columnType: TimelineGridColumnType;
  readonly rowIndex: number;
}
