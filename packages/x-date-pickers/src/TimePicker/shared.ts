import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { Clock } from '../internals/components/icons';
import { ExportedClockPickerProps } from '../ClockPicker/ClockPicker';
import { useUtils } from '../internals/hooks/useUtils';
import { ValidationProps } from '../internals/hooks/validation/useValidation';
import { TimeValidationError } from '../internals/hooks/validation/useTimeValidation';
import { BasePickerProps } from '../internals/models/props/basePickerProps';
import { ExportedDateInputProps } from '../internals/components/PureDateInput';
import { ClockPickerView, MuiPickersAdapter } from '../internals/models';
import { PickerStateValueManager } from '../internals/hooks/usePickerState';
import { parsePickerInputValue } from '../internals/utils/date-utils';
import { BaseToolbarProps } from '../internals/models/props/baseToolbarProps';

export interface BaseTimePickerProps<TInputDate, TDate>
  extends ExportedClockPickerProps<TDate>,
    BasePickerProps<TInputDate | null, TDate | null>,
    ValidationProps<TimeValidationError, TInputDate | null>,
    ExportedDateInputProps<TInputDate, TDate> {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
  /**
   * Callback fired on view change.
   * @param {ClockPickerView} view The new view.
   */
  onViewChange?: (view: ClockPickerView) => void;
  /**
   * First view to show.
   */
  openTo?: ClockPickerView;
  /**
   * Component that will replace default toolbar renderer.
   * @default TimePickerToolbar
   */
  ToolbarComponent?: React.JSXElementConstructor<BaseToolbarProps<TDate, TDate | null>>;
  /**
   * Mobile picker title, displaying in the toolbar.
   * @default 'Select time'
   */
  toolbarTitle?: React.ReactNode;
  /**
   * Array of views to show.
   */
  views?: readonly ClockPickerView[];
}

function getTextFieldAriaText<TDate>(value: any, utils: MuiPickersAdapter<TDate>) {
  return value && utils.isValid(utils.date(value))
    ? `Choose time, selected time is ${utils.format(utils.date(value) as TDate, 'fullTime')}`
    : 'Choose time';
}

type DefaultizedProps<Props> = Props & { inputFormat: string };
export function useTimePickerDefaultizedProps<
  TInputDate,
  TDate,
  Props extends BaseTimePickerProps<TInputDate, TDate>,
>(
  props: Props,
  name: string,
): DefaultizedProps<Props> &
  Required<Pick<BaseTimePickerProps<TInputDate, TDate>, 'openTo' | 'views'>> {
  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({ props, name });

  const utils = useUtils<TDate>();
  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  return {
    ampm,
    openTo: 'hours',
    views: ['hours', 'minutes'],
    acceptRegex: ampm ? /[\dapAP]/gi : /\d/gi,
    mask: ampm ? '__:__ _m' : '__:__',
    disableMaskedInput: false,
    getOpenDialogAriaText: getTextFieldAriaText,
    inputFormat: ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h,
    ...themeProps,
    components: {
      OpenPickerIcon: Clock,
      ...themeProps.components,
    },
  };
}

export const timePickerValueManager: PickerStateValueManager<any, any, any> = {
  emptyValue: null,
  parseInput: parsePickerInputValue,
  getTodayValue: (utils) => utils.date()!,
  areValuesEqual: (utils, a, b) => utils.isEqual(a, b),
  valueReducer: (utils, lastValidValue, newValue) => {
    if (!lastValidValue || !utils.isValid(newValue)) {
      return newValue;
    }

    return utils.mergeDateAndTime(lastValidValue, newValue);
  },
};
