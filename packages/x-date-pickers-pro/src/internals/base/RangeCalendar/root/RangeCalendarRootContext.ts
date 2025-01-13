import * as React from 'react';
import { PickerRangeValue, RangePosition } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';

export interface RangeCalendarRootContext {
  value: PickerRangeValue;
  isDraggingRef: React.RefObject<boolean>;
  disableDragEditing: boolean;
  selectDateFromDrag: (valueOrElement: PickerValidDate | HTMLElement) => void;
  startDragging: (position: RangePosition) => void;
  stopDragging: () => void;
  setDragTarget: (valueOrElement: PickerValidDate | HTMLElement) => void;
  emptyDragImgRef: React.RefObject<HTMLImageElement | null>;
  selectedRange: PickerRangeValue;
  isDragging: boolean;
  setHoveredDate: (value: PickerValidDate | null) => void;
  previewRange: PickerRangeValue;
  registerCell: (element: HTMLElement, value: PickerValidDate) => () => void;
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
