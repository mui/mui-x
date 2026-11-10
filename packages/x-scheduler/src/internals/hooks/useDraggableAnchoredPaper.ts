'use client';
import { useDraggableDialog } from '@mui/x-scheduler-internals/use-draggable-dialog';
import { useAnchoredPosition } from './useAnchoredPosition';

/**
 * Positions a dialog paper next to `anchor` and lets the user drag it by the `Draggable.Handle`
 * rendered inside it.
 * Spread `draggableProps` on a `Draggable.Root`, render the paper with a `Draggable.Trigger`
 * inside it, and attach `paperRef` to the paper.
 */
export function useDraggableAnchoredPaper(anchor: HTMLElement | null) {
  const { elementRef: paperRef, resetDrag, draggableProps } = useDraggableDialog();

  useAnchoredPosition({ anchor, popupRef: paperRef, onReposition: resetDrag });

  return { paperRef, draggableProps };
}
