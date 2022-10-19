import { PickerStateProps } from '../../hooks/usePickerState';
import { PickersInputComponentLocaleText } from '../../../locales/utils/pickersLocaleTextApi';

export interface BasePickerProps<TValue, TDate> extends PickerStateProps<TValue> {
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
  /**
   * Locale for components texts
   */
  localeText?: PickersInputComponentLocaleText<TDate>;
}
