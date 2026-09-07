import type {
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';

export interface DependencyTerminalDragData {
  eventId: SchedulerEventId;
  occurrenceKey: string;
  /**
   * The resource of the row appearance the gesture started from.
   */
  resourceId: SchedulerResourceId;
  /**
   * The edge of the source event the gesture started from. Combined with the drop
   * edge, it determines the created dependency's type.
   */
  sourceSide: SchedulerEventSide;
  source: 'TimelineGridEventDependencyTerminal';
  /**
   * The store of the timeline the gesture started in, compared by identity so
   * several timelines on one page don't react to each other's gestures.
   */
  storeContext: unknown;
}

/**
 * Narrows a drag payload to the dependency terminal's drag data — the one definition
 * shared by the creation monitor and the drop targets. A local narrow rather than a
 * `buildIsValidDropTarget` guard: the terminal drag never produces an occurrence
 * placeholder, so it does not register in `EventDropDataLookup`.
 */
export function isDependencyTerminalDrag(data: any): data is DependencyTerminalDragData {
  return data.source === 'TimelineGridEventDependencyTerminal';
}
