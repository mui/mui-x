import * as React from 'react';
import { useUtils } from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-cell/useBaseCalendarDaysCellWrapper';
import type { useRangeCalendarDaysCell } from './useRangeCalendarDaysCell';
import {
  isWithinRange,
  isStartOfRange,
  isEndOfRange,
  isRangeValid,
} from '../../../utils/date-utils';
import { useRangeCalendarRootDragContext } from '../root/RangeCalendarRootDragContext';

export function useRangeCalendarDaysCellWrapper(
  parameters: useRangeCalendarDaysCellWrapper.Parameters,
) {
  const { value } = parameters;
  const { ref, ctx: baseCtx } = useBaseCalendarDaysCellWrapper(parameters);
  const utils = useUtils();
  const rangeRootDragContext = useRangeCalendarRootDragContext();

  const isSelectionStart = React.useMemo(
    () => isStartOfRange(utils, value, rangeRootDragContext.highlightedRange),
    [utils, value, rangeRootDragContext.highlightedRange],
  );

  const isSelectionEnd = React.useMemo(
    () => isEndOfRange(utils, value, rangeRootDragContext.highlightedRange),
    [utils, value, rangeRootDragContext.highlightedRange],
  );

  const isSelected = React.useMemo(() => {
    if (!isRangeValid(utils, rangeRootDragContext.highlightedRange)) {
      return baseCtx.isSelected;
    }
    return isWithinRange(utils, value, rangeRootDragContext.highlightedRange);
  }, [utils, value, rangeRootDragContext.highlightedRange, baseCtx.isSelected]);

  const ctx = React.useMemo<useRangeCalendarDaysCell.Context>(
    () => ({
      ...baseCtx,
      isSelected,
      isSelectionStart: isSelectionStart && !isSelectionEnd,
      isSelectionEnd: isSelectionEnd && !isSelectionStart,
      isDraggingRef: rangeRootDragContext.isDraggingRef,
      selectDayFromDrag: rangeRootDragContext.selectDayFromDrag,
      startDragging: rangeRootDragContext.startDragging,
      stopDragging: rangeRootDragContext.stopDragging,
      setDragTarget: rangeRootDragContext.setDragTarget,
      emptyDragImgRef: rangeRootDragContext.emptyDragImgRef,
    }),
    [
      baseCtx,
      isSelected,
      isSelectionStart,
      isSelectionEnd,
      rangeRootDragContext.isDraggingRef,
      rangeRootDragContext.selectDayFromDrag,
      rangeRootDragContext.startDragging,
      rangeRootDragContext.stopDragging,
      rangeRootDragContext.setDragTarget,
      rangeRootDragContext.emptyDragImgRef,
    ],
  );

  return { ref, ctx };
}

export namespace useRangeCalendarDaysCellWrapper {
  export interface Parameters extends useBaseCalendarDaysCellWrapper.Parameters {}

  export interface ReturnValue extends Omit<useBaseCalendarDaysCellWrapper.ReturnValue, 'ctx'> {
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useRangeCalendarDaysCell.Context;
  }
}
