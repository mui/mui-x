import { Draggable } from '@base-ui/react/draggable';

// Shared across calendar, timeline, and standalone events, including separate providers.
export const schedulerDragKind =
  Draggable.createGlobalKind<Record<string, unknown>>('@mui/x-scheduler/event');

export const schedulerDropTargetKind =
  Draggable.createGlobalKind<Record<string, unknown>>('@mui/x-scheduler/target');
