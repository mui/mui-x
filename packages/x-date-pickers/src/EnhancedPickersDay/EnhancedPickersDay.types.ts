import { EnhancedPickersDayClasses } from './enhancedPickersDayClasses';
import { PickerDayOwnerState, PickersDayProps } from '../PickersDay';

export interface EnhancedPickersDayProps extends Omit<PickersDayProps, 'classes'> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<EnhancedPickersDayClasses>;
  /**
   * Indicates if the day should be visually selected.
   */
  isVisuallySelected?: boolean;
  /**
   * If `true`, the day can be dragged to change the current date range.
   * @default false
   */
  draggable?: boolean;
}

export interface EnhancedPickersDayOwnerState extends PickerDayOwnerState {
  /**
   * Whether the day is a filler day (its content is hidden).
   */
  isDayFillerCell: boolean;
}
