import * as React from 'react';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { PickerRangeValue, RangePosition } from '@mui/x-date-pickers/internals';

export interface RangeCalendarRootDragContext {
  isDraggingRef: React.RefObject<boolean>;
  disableDragEditing: boolean;
  selectDayFromDrag: (value: PickerValidDate) => void;
  startDragging: (position: RangePosition) => void;
  stopDragging: () => void;
  setDragTarget: (value: PickerValidDate) => void;
  emptyDragImgRef: React.RefObject<HTMLImageElement | null>;
  highlightedRange: PickerRangeValue;
  isDragging: boolean;
}

export const RangeCalendarRootDragContext = React.createContext<
  RangeCalendarRootDragContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  RangeCalendarRootDragContext.displayName = 'RangeCalendarRootDragContext';
}

export function useRangeCalendarRootDragContext() {
  const context = React.useContext(RangeCalendarRootDragContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: RangeCalendarRootDragContext is missing. Range Calendar parts must be placed within <RangeCalendar.Root />.',
    );
  }
  return context;
}
