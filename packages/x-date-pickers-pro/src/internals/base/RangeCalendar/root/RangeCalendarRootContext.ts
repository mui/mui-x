import * as React from 'react';
import { PickerRangeValue, RangePosition } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';

export interface RangeCalendarRootContext {
  /**
   * The current value of the Range Calendar.
   */
  value: PickerRangeValue;
  /**
   * A ref containing `true` if the user is currently dragging.
   * This is used to check if the user is dragging in event handlers without causing re-renders.
   */
  isDraggingRef: React.RefObject<boolean>;
  disableDragEditing: boolean;
  selectDateFromDrag: (valueOrElement: PickerValidDate | HTMLElement) => void;
  startDragging: (position: RangePosition) => void;
  stopDragging: () => void;
  setDragTarget: (valueOrElement: PickerValidDate | HTMLElement) => void;
  emptyDragImgRef: React.RefObject<HTMLImageElement | null>;
  registerCell: (element: HTMLElement, value: PickerValidDate) => () => void;
  selectedRange: PickerRangeValue;
  setHoveredDate: (value: PickerValidDate | null) => void;
  previewRange: PickerRangeValue;
}

export const RangeCalendarRootContext = React.createContext<RangeCalendarRootContext | undefined>(
  undefined,
);

if (process.env.NODE_ENV !== 'production') {
  RangeCalendarRootContext.displayName = 'RangeCalendarRootContext';
}

export function useRangeCalendarRootContext() {
  const context = React.useContext(RangeCalendarRootContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: RangeCalendarRootContext is missing. Range Calendar parts must be placed within <RangeCalendar.Root />.',
    );
  }
  return context;
}
