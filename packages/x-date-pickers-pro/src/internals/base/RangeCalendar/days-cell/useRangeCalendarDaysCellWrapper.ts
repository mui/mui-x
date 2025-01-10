import * as React from 'react';
import { useUtils } from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-cell/useBaseCalendarDaysCellWrapper';
import type { useRangeCalendarDaysCell } from './useRangeCalendarDaysCell';
import { getDatePositionInRange } from '../../../utils/date-utils';
import { useRangeCalendarRootContext } from '../root/RangeCalendarRootContext';

export function useRangeCalendarDaysCellWrapper(
  parameters: useRangeCalendarDaysCellWrapper.Parameters,
) {
  const { value } = parameters;
  const { ref, ctx: baseCtx } = useBaseCalendarDaysCellWrapper(parameters);
  const utils = useUtils();
  const rootContext = useRangeCalendarRootContext();

  const positionInSelectedRange = React.useMemo(
    () => getDatePositionInRange(utils, value, rootContext.selectedRange),
    [utils, value, rootContext.selectedRange],
  );

  const positionInPreviewRange = React.useMemo(
    () => getDatePositionInRange(utils, value, rootContext.previewRange),
    [utils, value, rootContext.previewRange],
  );

  const ctx = React.useMemo<useRangeCalendarDaysCell.Context>(
    () => ({
      ...baseCtx,
      isSelected: positionInSelectedRange.isSelected,
      isSelectionStart: positionInSelectedRange.isSelectionStart,
      isSelectionEnd: positionInSelectedRange.isSelectionEnd,
      isPreviewed: positionInPreviewRange.isSelected,
      isPreviewStart: positionInPreviewRange.isSelectionStart,
      isPreviewEnd: positionInPreviewRange.isSelectionEnd,
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
      positionInSelectedRange,
      positionInPreviewRange,
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
