import { DateInputProps } from '../PureDateInput';

export interface DateInputPropsLike
  extends Omit<DateInputProps<any>, 'renderInput' | 'validationError'> {
  renderInput: (...args: any) => JSX.Element;
  validationError?: any;
}
