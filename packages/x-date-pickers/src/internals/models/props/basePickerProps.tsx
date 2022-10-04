import { PickerStateProps } from '../../hooks/usePickerState';
import { UsePickerProps } from '../../hooks/usePicker';
import { CalendarOrClockPickerView } from '../views';
import { PickersInputLocaleText } from '@mui/x-date-pickers';

export interface BasePickerProps<TValue> extends PickerStateProps<TValue> {
  /**
   * className applied to the root component.
   */
  className?: string;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Format string.
   */
  inputFormat?: string;
  /**
   * Force rendering in particular orientation.
   */
  orientation?: 'portrait' | 'landscape';
  /**
   * Make picker read only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, show the toolbar even in desktop mode.
   */
  showToolbar?: boolean;
}

export interface BasePickerProps2<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends UsePickerProps<TValue, TView> {
  /**
   * Class name applied to the root element.
   */
  className?: string;
  /**
   * Format of the date when rendered in the input(s).
   */
  inputFormat?: string;
  /**
   * Locale for components texts
   */
  localeText?: PickersInputLocaleText<TDate>;
}
