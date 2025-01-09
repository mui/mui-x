import * as React from 'react';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { RangePosition } from '@mui/x-date-pickers/internals';
import useEventCallback from '@mui/utils/useEventCallback';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-cell/useBaseCalendarDaysCell';
// eslint-disable-next-line no-restricted-imports
import { GenericHTMLProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { mergeReactProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeReactProps';
import type { RangeCalendarRootDragContext } from '../root/RangeCalendarRootDragContext';

export function useRangeCalendarDaysCell(parameters: useRangeCalendarDaysCell.Parameters) {
  const { ctx, value } = parameters;

  const startDragging = () => {
    ctx.startDragging(ctx.isSelectionStart ? 'start' : 'end');
  };

  const onTouchStart = useEventCallback(() => {
    ctx.setDragTarget(value);
  });

  const onDragEnter = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!ctx.isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    ctx.setDragTarget(parameters.value);
  });

  const onTouchMove = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
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
    startDragging();
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
    ctx.stopDragging();

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
    ctx.stopDragging();
    ctx.setDragTarget(null);
  });

  const onDrop = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!ctx.isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    ctx.stopDragging();
    ctx.setDragTarget(null);
    // make sure the focused element is the element where drop ended
    event.currentTarget.focus();
    if (isSameAsDraggingDate(event)) {
      return;
    }
    ctx.selectDayFromDrag(value);
  });

  const { baseProps, isCurrent } = useBaseCalendarDaysCell(parameters);

  const getDaysCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        ...baseProps,
        ...(ctx.isSelectionStart || ctx.isSelectionEnd ? { draggable: true } : {}),
        onDragStart,
        onDragEnter,
        onDragLeave,
        onDragOver,
        onDragEnd,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onDrop,
      });
    },
    [
      baseProps,
      ctx.isSelectionStart,
      ctx.isSelectionEnd,
      onDragStart,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDragEnd,
      onTouchStart,
      onTouchMove,
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

  export interface Context
    extends useBaseCalendarDaysCell.Context,
      Pick<
        RangeCalendarRootDragContext,
        | 'isDraggingRef'
        | 'selectDayFromDrag'
        | 'startDragging'
        | 'stopDragging'
        | 'setDragTarget'
        | 'emptyDragImgRef'
      > {
    isSelectionStart: boolean;
    isSelectionEnd: boolean;
  }
}
