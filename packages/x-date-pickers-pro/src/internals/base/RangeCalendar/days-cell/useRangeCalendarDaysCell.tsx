import * as React from 'react';
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

  const isDraggable = ctx.isSelectionStart || ctx.isSelectionEnd;

  const startDragging = () => {
    ctx.startDragging(ctx.isSelectionStart ? 'start' : 'end');
  };

  /**
   * Mouse events
   */
  const onDragStart = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (ctx.emptyDragImgRef.current) {
      event.dataTransfer.setDragImage(ctx.emptyDragImgRef.current, 0, 0);
    }
    ctx.setDragTarget(value);
    event.dataTransfer.effectAllowed = 'move';
    startDragging();
    const buttonDataset = (event.target as HTMLButtonElement).dataset;
    if (buttonDataset.timestamp) {
      event.dataTransfer.setData('draggingDate', buttonDataset.timestamp);
    }
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

  const onDragEnd = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!ctx.isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    ctx.stopDragging();
  });

  const onDrop = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!ctx.isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    ctx.stopDragging();
    // make sure the focused element is the element where drop ended
    event.currentTarget.focus();
    ctx.selectDayFromDrag(value);
  });

  /**
   * Touch events
   */

  const onTouchStart = useEventCallback(() => {
    ctx.setDragTarget(value);
  });

  const onTouchEnd = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    if (!ctx.isDraggingRef.current) {
      return;
    }

    ctx.stopDragging();

    // make sure the focused element is the element where touch ended
    ctx.selectDayFromDrag(value);

    const target = resolveElementFromTouch(event, true);
    if (target) {
      target.focus();
    }
  });

  const onTouchMove = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    ctx.setDragTarget(value);

    // this prevents initiating drag when user starts touchmove outside and then moves over a draggable element
    const target = resolveElementFromTouch(event);
    if (target == null || target !== event.changedTouches[0].target || !isDraggable) {
      return;
    }

    // on mobile we should only initialize dragging state after move is detected
    startDragging();
  });

  const { getDaysCellProps: getBaseDaysCellProps, isCurrent } = useBaseCalendarDaysCell(parameters);

  const getDaysCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, getBaseDaysCellProps(externalProps), {
        ...(isDraggable ? { draggable: true } : {}),
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
      getBaseDaysCellProps,
      isDraggable,
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
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
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

function resolveButtonElement(element: Element | null): HTMLButtonElement | null {
  if (element) {
    if (element instanceof HTMLButtonElement && !element.disabled) {
      return element;
    }
    if (element.children.length) {
      return resolveButtonElement(element.children[0]);
    }
    return null;
  }
  return element;
}

function resolveElementFromTouch(
  event: React.TouchEvent<HTMLButtonElement>,
  ignoreTouchTarget?: boolean,
) {
  // don't parse multi-touch result
  if (event.changedTouches?.length === 1 && event.touches.length <= 1) {
    const element = document.elementFromPoint(
      event.changedTouches[0].clientX,
      event.changedTouches[0].clientY,
    );
    // `elementFromPoint` could have resolved preview div or wrapping div
    // might need to recursively find the nested button
    const buttonElement = resolveButtonElement(element);
    if (ignoreTouchTarget && buttonElement === event.changedTouches[0].target) {
      return null;
    }
    return buttonElement;
  }
  return null;
}
