import { DateInputProps } from '../PureDateInput';
import { PickersActionBarProps } from '../../../PickersActionBar';

export interface DateInputPropsLike
  extends Omit<DateInputProps<any, any>, 'renderInput' | 'validationError'> {
  renderInput: (...args: any) => JSX.Element;
  validationError?: any;
}

export interface PickersSlotsComponent {
  ActionBar: React.ElementType<PickersActionBarProps>;
  PaperContent: React.ElementType<{ children: React.ReactNode }>;
}
