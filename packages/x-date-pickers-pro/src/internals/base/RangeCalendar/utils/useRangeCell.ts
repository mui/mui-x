import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '@mui/x-date-pickers/models';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarSection } from '@mui/x-date-pickers/internals/base/utils/base-calendar/utils/types';
import { RangeCalendarRootContext } from '../root/RangeCalendarRootContext';

/**
 * Add support for drag and drop and hover preview to the cell components of the Range Calendar.
 */
export function useRangeCell(parameters: useRangeCell.Parameters) {
  const { ctx, value, section } = parameters;

  const startDragging = () => {
    ctx.startDragging(ctx.isSelectionStart ? 'start' : 'end', section);
  };

  const isDraggingCurrentSection = () => ctx.draggedSectionRef.current === section;

  /**
   * Drag events
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
    if (!isDraggingCurrentSection()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    ctx.setDragTarget(parameters.value);
  });

  const onDragLeave = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDraggingCurrentSection()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  });

  const onDragOver = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDraggingCurrentSection()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  });

  const onDragEnd = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDraggingCurrentSection()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    ctx.stopDragging();
  });

  const onDrop = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDraggingCurrentSection()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    ctx.stopDragging();
    // make sure the focused element is the element where drop ended
    event.currentTarget.focus();
    ctx.selectDateFromDrag(value);
  });

  /**
   * Touch events
   */
  const onTouchStart = useEventCallback(() => {
    ctx.setDragTarget(value);
  });

  const onTouchMove = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    const target = resolveElementFromTouch(event);
    if (!target) {
      return;
    }

    ctx.setDragTarget(target);

    // this prevents initiating drag when user starts touchmove outside and then moves over a draggable element
    if (target !== event.changedTouches[0].target || !ctx.isDraggable) {
      return;
    }

    // on mobile we should only initialize dragging state after move is detected
    startDragging();
  });

  const onTouchEnd = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    if (!isDraggingCurrentSection()) {
      return;
    }

    ctx.stopDragging();
    const target = resolveElementFromTouch(event, true);
    if (!target) {
      return;
    }

    // make sure the focused element is the element where touch ended
    target.focus();
    ctx.selectDateFromDrag(target);
  });

  /**
   * Mouse events
   */
  const onMouseEnter = useEventCallback(() => {
    if (!ctx.isSelected) {
      ctx.setHoveredDate(value, section);
    } else {
      ctx.setHoveredDate(null, section);
    }
  });

  return React.useMemo(
    () => ({
      ...(ctx.isDraggable ? { draggable: true, onDragStart, onDrop, onTouchStart } : {}),
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDragEnd,
      onTouchMove,
      onTouchEnd,
      onMouseEnter,
    }),
    [
      ctx.isDraggable,
      onDragStart,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDragEnd,
      onDrop,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseEnter,
    ],
  );
}

export namespace useRangeCell {
  export interface Parameters {
    value: PickerValidDate;
    ctx: Context;
    section: BaseCalendarSection;
  }

  export interface Context
    extends Pick<
      RangeCalendarRootContext,
      | 'draggedSectionRef'
      | 'selectDateFromDrag'
      | 'startDragging'
      | 'stopDragging'
      | 'setDragTarget'
      | 'setHoveredDate'
      | 'emptyDragImgRef'
    > {
    isDraggable: boolean;
    isSelectionStart: boolean;
    isSelectionEnd: boolean;
    isPreviewed: boolean;
    isPreviewStart: boolean;
    isPreviewEnd: boolean;
    isSelected: boolean;
  }
}

function resolveButtonElement(element: Element | null): HTMLButtonElement | null {
  if (!element) {
    return null;
  }

  if (element instanceof HTMLButtonElement && !element.disabled) {
    return element;
  }

  if (element.children.length) {
    const allButtons = element.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');

    // If there are several buttons inside the element,
    // Then we the coordinates probably point between two cells and the element is probably a parent that we don't want to drop on.
    if (allButtons.length > 1) {
      return null;
    }

    return allButtons[0] ?? null;
  }

  return null;
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
