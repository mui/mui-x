import * as React from 'react';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import useEventCallback from '@mui/utils/useEventCallback';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-cell/useBaseCalendarDaysCell';
// eslint-disable-next-line no-restricted-imports
import { GenericHTMLProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { mergeReactProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeReactProps';

export function useRangeCalendarDaysCell(parameters: useRangeCalendarDaysCell.Parameters) {
  const { ctx } = parameters;

  const onDragStart = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (emptyDragImgRef.current) {
      event.dataTransfer.setDragImage(emptyDragImgRef.current, 0, 0);
    }
    ctx.setDragTarget(newDate);
    event.dataTransfer.effectAllowed = 'move';
    ctx.setIsDragging(true);
    const buttonDataset = (event.target as HTMLButtonElement).dataset;
    if (buttonDataset.timestamp) {
      event.dataTransfer.setData('draggingDate', buttonDataset.timestamp);
    }
    if (buttonDataset.position) {
      onDatePositionChange(buttonDataset.position as RangePosition);
    }
  });

  const onTouchStart = useEventCallback(() => {
    ctx.setDragTarget(newDate);
  });

  const onDragEnter = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!ctx.isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    ctx.setDragTarget(resolveDateFromTarget(event.target, utils, timezone));
  });

  const onDragMove = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    const target = resolveElementFromTouch(event);
    if (!target) {
      return;
    }

    const newDate = resolveDateFromTarget(target, utils, timezone);
    if (newDate) {
      ctx.setDragTarget(newDate);
    }

    // this prevents initiating drag when user starts touchmove outside and then moves over a draggable element
    const targetsAreIdentical = target === event.changedTouches[0].target;
    if (!targetsAreIdentical || !isElementDraggable(newDate)) {
      return;
    }

    // on mobile we should only initialize dragging state after move is detected
    ctx.setIsDragging(true);

    const button = event.target as HTMLButtonElement;
    const buttonDataset = button.dataset;
    if (buttonDataset.position) {
      onDatePositionChange(buttonDataset.position as RangePosition);
    }
  });

  const onDragLeave = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!ctx.isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  });

  const onDragOver = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!ctx.isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  });

  const onTouchEnd = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    if (!ctx.isDraggingRef.current) {
      return;
    }

    ctx.setDragTarget(null);
    ctx.setIsDragging(false);

    const target = resolveElementFromTouch(event, true);
    if (!target) {
      return;
    }

    // make sure the focused element is the element where touch ended
    target.focus();
    const newDate = resolveDateFromTarget(target, utils, timezone);
    if (newDate) {
      ctx.selectDayFromDrag(newDate);
    }
  });

  const onDragEnd = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!ctx.isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    ctx.setIsDragging(false);
    ctx.setDragTarget(null);
  });

  const onDrop = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!ctx.isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    ctx.setIsDragging(false);
    ctx.setDragTarget(null);
    // make sure the focused element is the element where drop ended
    event.currentTarget.focus();
    if (isSameAsDraggingDate(event)) {
      return;
    }
    const newDate = resolveDateFromTarget(event.target, utils, timezone);
    if (newDate) {
      ctx.selectDayFromDrag(newDate);
    }
  });

  const { baseProps, isCurrent } = useBaseCalendarDaysCell(parameters);

  const getDaysCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        ...baseProps,
        ...(ctx.isDraggable ? { draggable: true, onDragStart, onTouchStart } : {}),
        onDragEnter,
        onDragLeave,
        onDragMove,
        onDragOver,
        onDragEnd,
        onTouchEnd,
        onDrop,
      });
    },
    [
      baseProps,
      ctx.isDraggable,
      onDragStart,
      onTouchStart,
      onDragEnter,
      onDragLeave,
      onDragMove,
      onDragOver,
      onDragEnd,
      onTouchEnd,
      onDrop,
    ],
  );

  return React.useMemo(() => ({ getDaysCellProps, isCurrent }), [getDaysCellProps, isCurrent]);
}

export namespace useRangeCalendarDaysCell {
  export interface Parameters extends Omit<useBaseCalendarDaysCell.Parameters, 'ctx'> {
    ctx: Context;
  }

  export interface Context extends useBaseCalendarDaysCell.Context {
    isSelectionStart: boolean;
    isSelectionEnd: boolean;
    isDraggable: boolean;
    isDraggingRef: React.RefObject<boolean>;
    selectDayFromDrag: (date: PickerValidDate) => void;
    setIsDragging: (value: boolean) => void;
    setDragTarget: (value: PickerValidDate | null) => void;
  }
}
