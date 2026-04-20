/**
 * The type of column in the timeline grid.
 * - `'title'` — the column displaying the resource name.
 * - `'events'` — the column displaying the event timeline.
 */
export type TimelineGridColumnType = 'title' | 'events';

/**
 * The coordinates of a focused cell in the timeline grid.
 */
export interface TimelineGridCellCoordinates {
  readonly columnType: TimelineGridColumnType;
  readonly rowIndex: number;
}
