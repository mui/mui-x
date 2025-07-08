import { PickerDay2Classes } from './pickerDay2Classes';
import { PickerDayOwnerState, PickersDayProps } from '../PickersDay';

export interface PickerDay2Props extends Omit<PickersDayProps, 'classes'> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickerDay2Classes>;
  /**
   * Indicates if the day should be visually selected.
   */
  isVisuallySelected?: boolean;
}

export interface PickerDay2OwnerState extends PickerDayOwnerState {
  /**
   * Whether the day is a filler day (its content is hidden).
   */
  isDayFillerCell: boolean;
}
