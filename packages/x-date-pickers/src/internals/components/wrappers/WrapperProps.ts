import { DateInputProps } from '../PureDateInput';
import { PickersActionBarProps } from '../../../PickersActionBar';

export interface DateInputPropsLike
  extends Omit<DateInputProps<any, any>, 'renderInput' | 'validationError'> {
  renderInput: (...args: any) => JSX.Element;
  validationError?: any;
}

export interface PickersSlotsComponent {
  /**
   * The action bar placed bellow picker views.
   * @default PickersActionBar
   */
  ActionBar: React.ElementType<PickersActionBarProps>;
  /**
   * The content of the Paper wrapping views.
   * @default React.Fragment
   */
  PaperContent: React.ElementType<{ children: React.ReactNode }>;
}
