'use client';
import * as React from 'react';
import { useDraggableDialog } from '@mui/x-scheduler-internals/use-draggable-dialog';
import { useAnchoredPosition } from './useAnchoredPosition';

/**
 * Positions a dialog paper next to `anchor` and lets the user drag it by `dragHandlerRef`.
 * Returns the ref to put on the paper.
 */
export function useDraggableAnchoredPaper(
  anchor: HTMLElement | null,
  dragHandlerRef: React.RefObject<HTMLElement | null>,
) {
  const paperRef = React.useRef<HTMLDivElement>(null);

  const mutateStyle = React.useCallback((style: string) => {
    if (paperRef.current) {
      paperRef.current.style.transform = style;
    }
  }, []);

  const resetDrag = useDraggableDialog(paperRef, dragHandlerRef, mutateStyle);

  useAnchoredPosition({ anchor, popupRef: paperRef, onReposition: resetDrag });

  return paperRef;
}
