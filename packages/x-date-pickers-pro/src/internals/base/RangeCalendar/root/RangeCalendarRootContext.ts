import * as React from 'react';
import { PickerRangeValue, RangePosition } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarSection } from '@mui/x-date-pickers/internals/base/utils/base-calendar/utils/types';

export interface RangeCalendarRootContext {
  /**
   * The current value of the Range Calendar.
   */
  value: PickerRangeValue;
  /**
   * A ref containing the section being dragged.
   * This is used to check if the user is dragging in event handlers without causing re-renders.
   */
  draggedSectionRef: React.RefObject<BaseCalendarSection | null>;
  disableDragEditing: boolean;
  selectDateFromDrag: (valueOrElement: PickerValidDate | HTMLElement) => void;
  startDragging: (position: RangePosition, section: BaseCalendarSection) => void;
  stopDragging: () => void;
  setDragTarget: (valueOrElement: PickerValidDate | HTMLElement) => void;
  emptyDragImgRef: React.RefObject<HTMLImageElement | null>;
  registerCell: (element: HTMLElement, value: PickerValidDate) => () => void;
  selectedRange: PickerRangeValue;
  setHoveredDate: (value: PickerValidDate | null, section: BaseCalendarSection) => void;
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
