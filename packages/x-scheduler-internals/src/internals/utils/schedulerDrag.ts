import { Draggable } from '@base-ui/react/draggable';
import type { DragDropManager, RegisterDraggableParameters } from '@base-ui/react/draggable';

// Shared across calendar, timeline, and standalone events, including separate providers.
export const schedulerDragKind =
  Draggable.createGlobalKind<Record<string, unknown>>('@mui/x-scheduler/event');

export const schedulerDropTargetKind =
  Draggable.createGlobalKind<Record<string, unknown>>('@mui/x-scheduler/target');

/** Captures the Scheduler's position-dependent data when a gesture starts. */
export function registerSchedulerDraggable(
  manager: DragDropManager,
  element: HTMLElement,
  parameters: Omit<RegisterDraggableParameters<Record<string, unknown>>, 'kind' | 'payload'> & {
    getDragData: (input: { clientX: number; clientY: number }) => Record<string, unknown>;
  },
) {
  const { getDragData, onBeforeMoveStart, ...other } = parameters;
  const payload: Record<string, unknown> = {};
  return manager.registerDraggable(element, () => ({
    ...other,
    kind: schedulerDragKind,
    payload,
    dragPreview: { disabled: true },
    onBeforeMoveStart: (context, details) => {
      onBeforeMoveStart?.(context, details);
      if (!details.isCanceled) {
        Object.keys(payload).forEach((key) => delete payload[key]);
        Object.assign(payload, getDragData(context.input));
      }
    },
  }));
}
