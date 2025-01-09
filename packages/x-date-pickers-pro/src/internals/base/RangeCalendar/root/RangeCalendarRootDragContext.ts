import * as React from 'react';
import { PickerValidDate } from '@mui/x-date-pickers/models';

export interface RangeCalendarRootDragContext {
  isDraggingRef: React.RefObject<boolean>;
  disableDragEditing: boolean;
  selectDay: (value: PickerValidDate) => void;
  setIsDragging: (value: boolean) => void;
  setDragTarget: (value: PickerValidDate | null) => void;
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
