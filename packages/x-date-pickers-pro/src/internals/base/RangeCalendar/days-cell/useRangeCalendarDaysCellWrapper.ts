import * as React from 'react';
import { useUtils } from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-cell/useBaseCalendarDaysCellWrapper';
import type { useRangeCalendarDaysCell } from './useRangeCalendarDaysCell';
import { useRangeCalendarRootContext } from '../root/RangeCalendarRootContext';
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
  const rangeRootContext = useRangeCalendarRootContext();
  const rangeRootDragContext = useRangeCalendarRootDragContext();

  const isSelected = React.useMemo(
    () =>
      isRangeValid(utils, rangeRootContext.value)
        ? isWithinRange(utils, value, rangeRootContext.value)
        : baseCtx.isSelected,
    [utils, value, rangeRootContext.value, baseCtx.isSelected],
  );

  const isSelectionStart = React.useMemo(
    () =>
      isRangeValid(utils, rangeRootContext.value)
        ? isStartOfRange(utils, value, rangeRootContext.value)
        : baseCtx.isSelected,
    [utils, value, rangeRootContext.value, baseCtx.isSelected],
  );

  const isSelectionEnd = React.useMemo(
    () =>
      isRangeValid(utils, rangeRootContext.value)
        ? isEndOfRange(utils, value, rangeRootContext.value)
        : baseCtx.isSelected,
    [utils, value, rangeRootContext.value, baseCtx.isSelected],
  );

  const ctx = React.useMemo<useRangeCalendarDaysCell.Context>(
    () => ({
      ...baseCtx,
      isSelected,
      isSelectionStart,
      isSelectionEnd,
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
    ctx: useRangeCalendarDaysCell.Context;
  }
}
