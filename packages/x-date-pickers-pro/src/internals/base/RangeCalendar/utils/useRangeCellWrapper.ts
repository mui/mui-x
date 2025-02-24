import * as React from 'react';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { useUtils } from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarSection } from '@mui/x-date-pickers/internals/base/utils/base-calendar/utils/types';
import { useRangeCalendarRootContext } from '../root/RangeCalendarRootContext';
import { useRangeCell } from './useRangeCell';
import { getDatePositionInRange } from './range';

/**
 * Add support for drag&drop and preview to the cell components of the Range Calendar.
 * Should be called by the wrapper component.
 */
export function useRangeCellWrapper(parameters: useRangeCellWrapper.Parameters) {
  const { value, section } = parameters;
  const utils = useUtils();
  const rootContext = useRangeCalendarRootContext();
  const cellRef = React.useRef<HTMLElement | null>(null);

  const registerCell = rootContext.registerCell;
  React.useEffect(() => {
    return registerCell(cellRef.current!, value);
  }, [registerCell, value]);

  const positionInSelectedRange = React.useMemo(
    () => getDatePositionInRange({ utils, section, date: value, range: rootContext.selectedRange }),
    [utils, section, value, rootContext.selectedRange],
  );

  const positionInPreviewRange = React.useMemo(
    () => getDatePositionInRange({ utils, section, date: value, range: rootContext.previewRange }),
    [utils, section, value, rootContext.previewRange],
  );

  const ctx = React.useMemo<useRangeCell.Context>(
    () => ({
      isDraggable:
        (!rootContext.disableDragEditing && positionInSelectedRange.isSelectionStart) ||
        positionInSelectedRange.isSelectionEnd,
      isSelected: positionInSelectedRange.isSelected,
      isSelectionStart: positionInSelectedRange.isSelectionStart,
      isSelectionEnd: positionInSelectedRange.isSelectionEnd,
      isPreviewed: positionInPreviewRange.isSelected,
      isPreviewStart: positionInPreviewRange.isSelectionStart,
      isPreviewEnd: positionInPreviewRange.isSelectionEnd,
      draggedSectionRef: rootContext.draggedSectionRef,
      selectDateFromDrag: rootContext.selectDateFromDrag,
      startDragging: rootContext.startDragging,
      stopDragging: rootContext.stopDragging,
      setDragTarget: rootContext.setDragTarget,
      setHoveredDate: rootContext.setHoveredDate,
      emptyDragImgRef: rootContext.emptyDragImgRef,
    }),
    [
      positionInSelectedRange,
      positionInPreviewRange,
      rootContext.disableDragEditing,
      rootContext.draggedSectionRef,
      rootContext.selectDateFromDrag,
      rootContext.startDragging,
      rootContext.stopDragging,
      rootContext.setDragTarget,
      rootContext.setHoveredDate,
      rootContext.emptyDragImgRef,
    ],
  );

  return { cellRef, ctx };
}

namespace useRangeCellWrapper {
  export interface Parameters {
    value: PickerValidDate;
    section: BaseCalendarSection;
  }
}
