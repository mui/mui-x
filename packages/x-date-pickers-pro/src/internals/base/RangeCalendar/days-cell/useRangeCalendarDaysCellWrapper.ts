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
import { useRangeCalendarRootContext } from '../root/RangeCalendarRootContext';

export function useRangeCalendarDaysCellWrapper(
  parameters: useRangeCalendarDaysCellWrapper.Parameters,
) {
  const { value } = parameters;
  const { ref, ctx: baseCtx } = useBaseCalendarDaysCellWrapper(parameters);
  const utils = useUtils();
  const rootContext = useRangeCalendarRootContext();

  const isSelected = React.useMemo(() => {
    if (!isRangeValid(utils, rootContext.highlightedRange)) {
      return baseCtx.isSelected;
    }
    return isWithinRange(utils, value, rootContext.highlightedRange);
  }, [utils, value, rootContext.highlightedRange, baseCtx.isSelected]);

  const isSelectionStart = React.useMemo(
    () => isStartOfRange(utils, value, rootContext.highlightedRange),
    [utils, value, rootContext.highlightedRange],
  );

  const isSelectionEnd = React.useMemo(
    () => isEndOfRange(utils, value, rootContext.highlightedRange),
    [utils, value, rootContext.highlightedRange],
  );

  const isPreviewed = React.useMemo(() => {
    return isWithinRange(utils, value, rootContext.previewRange);
  }, [utils, value, rootContext.previewRange]);

  const isPreviewStart = React.useMemo(
    () => isStartOfRange(utils, value, rootContext.previewRange),
    [utils, value, rootContext.previewRange],
  );

  const isPreviewEnd = React.useMemo(
    () => isEndOfRange(utils, value, rootContext.previewRange),
    [utils, value, rootContext.previewRange],
  );

  const ctx = React.useMemo<useRangeCalendarDaysCell.Context>(
    () => ({
      ...baseCtx,
      isSelected,
      isSelectionStart,
      isSelectionEnd,
      isPreviewed,
      isPreviewStart,
      isPreviewEnd,
      isDraggingRef: rootContext.isDraggingRef,
      selectDayFromDrag: rootContext.selectDayFromDrag,
      startDragging: rootContext.startDragging,
      stopDragging: rootContext.stopDragging,
      setDragTarget: rootContext.setDragTarget,
      setHoveredDate: rootContext.setHoveredDate,
      emptyDragImgRef: rootContext.emptyDragImgRef,
    }),
    [
      baseCtx,
      isSelected,
      isSelectionStart,
      isSelectionEnd,
      isPreviewed,
      isPreviewStart,
      isPreviewEnd,
      rootContext.isDraggingRef,
      rootContext.selectDayFromDrag,
      rootContext.startDragging,
      rootContext.stopDragging,
      rootContext.setDragTarget,
      rootContext.setHoveredDate,
      rootContext.emptyDragImgRef,
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
