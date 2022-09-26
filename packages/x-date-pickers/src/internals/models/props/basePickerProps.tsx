import { PickerStateProps, PickerStateValueManager } from '../../hooks/usePickerState';
import { PickerViewManagerProps } from '../../components/PickerViewManager';
import { PickerStateProps2 } from '../../hooks/usePickerState2';
import { CalendarOrClockPickerView } from '../views';
import { MuiPickersAdapter } from '@mui/x-date-pickers/internals';

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
  extends PickerStateProps2<TValue>,
    Omit<PickerViewManagerProps<TValue, TDate, TView>, 'value' | 'onChange'> {
  /**
   * Class name applied to the root element.
   */
  className?: string;
  /**
   * Get aria-label text for control that opens picker dialog. Aria-label text must include selected date. @DateIOType
   * @template TInputDate, TDate
   * @param {TInputDate} date The date from which we want to add an aria-text.
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @returns {string} The aria-text to render inside the dialog.
   * @default (date, utils) => `Choose date, selected date is ${utils.format(utils.date(date), 'fullDate')}`
   */
  getOpenDialogAriaText: (date: TDate, utils: MuiPickersAdapter<TDate>) => string;
  /**
   * Format of the date when rendered in the input(s).
   */
  inputFormat: string;
  valueManager: PickerStateValueManager<TValue, TDate>;
}

export interface ExportedBasePickerProps2<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends Omit<
    BasePickerProps2<TValue, TDate, TView>,
    'valueManager' | 'renderViews' | 'getOpenDialogAriaText'
  > {}
