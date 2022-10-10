import {
  BasePickerProps,
  PickerStateValueManager,
  useDefaultDates,
  useUtils,
  ValidationCommonProps,
  DefaultizedProps,
  applyDefaultDate,
  BaseDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { useThemeProps } from '@mui/material/styles';
import {
  DateRangePickerViewSlotsComponent,
  DateRangePickerViewSlotsComponentsProps,
  ExportedDateRangePickerViewProps,
} from './DateRangePickerView';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';
import { DateRange } from '../internal/models';
import { ExportedDateRangePickerInputProps } from './DateRangePickerInput';
import { replaceInvalidDatesByNull } from '../internal/utils/date-utils';
import { DateRangePickerToolbar } from './DateRangePickerToolbar';

export interface BaseDateRangePickerSlotsComponent<TDate>
  extends DateRangePickerViewSlotsComponent<TDate> {}

export interface BaseDateRangePickerSlotsComponentsProps<TDate>
  extends DateRangePickerViewSlotsComponentsProps<TDate> {}

export interface BaseDateRangePickerProps<TDate>
  extends Omit<BasePickerProps<DateRange<TDate>>, 'orientation'>,
    ExportedDateRangePickerViewProps<TDate>,
    BaseDateValidationProps<TDate>,
    ValidationCommonProps<DateRangeValidationError, DateRange<TDate>>,
    ExportedDateRangePickerInputProps<TDate> {
  /**
   * Custom mask. Can be used to override generate from format. (e.g. `__/__/____ __:__` or `__/__/____ __:__ _M`).
   * @default '__/__/____'
   */
  mask?: ExportedDateRangePickerInputProps<TDate>['mask'];
  /**
   * Callback fired when the value (the selected date range) changes @DateIOType.
   * @template TDate
   * @param {DateRange<TDate>} date The new date range.
   * @param {string} keyboardInputValue The current value of the keyboard input.
   */
  onChange: (date: DateRange<TDate>, keyboardInputValue?: string) => void;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<BaseDateRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<BaseDateRangePickerSlotsComponentsProps<TDate>>;
}

export function useDateRangePickerDefaultizedProps<
  TDate,
  Props extends BaseDateRangePickerProps<TDate>,
>(
  props: Props,
  name: string,
): DefaultizedProps<
  Props,
  'calendars' | keyof BaseDateValidationProps<TDate>,
  { inputFormat: string }
> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({
    props,
    name,
  });

  return {
    disableFuture: false,
    disablePast: false,
    calendars: 2,
    inputFormat: utils.formats.keyboardDate,
    ...themeProps,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    components: { Toolbar: DateRangePickerToolbar, ...themeProps.components },
    componentsProps: {
      ...themeProps.componentsProps,
      toolbar: { toolbarTitle: themeProps.label, ...themeProps.componentsProps?.toolbar },
    },
  };
}

export const dateRangePickerValueManager: PickerStateValueManager<[any, any], any> = {
  emptyValue: [null, null],
  getTodayValue: (utils) => [utils.date()!, utils.date()!],
  cleanValue: replaceInvalidDatesByNull,
  areValuesEqual: (utils, a, b) => utils.isEqual(a[0], b[0]) && utils.isEqual(a[1], b[1]),
};
