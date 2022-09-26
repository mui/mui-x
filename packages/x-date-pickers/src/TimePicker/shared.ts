import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { Clock } from '../internals/components/icons';
import { ExportedClockPickerProps } from '../ClockPicker/ClockPicker';
import { useLocaleText, useUtils } from '../internals/hooks/useUtils';
import { ValidationCommonProps } from '../internals/hooks/validation/useValidation';
import { TimeValidationError } from '../internals/hooks/validation/useTimeValidation';
import { BasePickerProps } from '../internals/models/props/basePickerProps';
import { ExportedDateInputProps } from '../internals/components/PureDateInput';
import { ClockPickerView } from '../internals/models';
import { PickerStateValueManager } from '../internals/hooks/usePickerState';
import { BaseToolbarProps } from '../internals/models/props/baseToolbarProps';
import { DefaultizedProps } from '../internals/models/helpers';
import { replaceInvalidDateByNull } from '../internals/utils/date-utils';
import { BaseTimeValidationProps } from '../internals/hooks/validation/models';

export interface BaseTimePickerProps<TDate>
  extends ExportedClockPickerProps<TDate>,
    BasePickerProps<TDate | null>,
    ValidationCommonProps<TimeValidationError, TDate | null>,
    ExportedDateInputProps<TDate> {
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
   * Must be a valid option from `views` list
   * @default 'hours'
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
   * @default ['hours', 'minutes']
   */
  views?: readonly ClockPickerView[];
  components?: any;
}

export function useTimePickerDefaultizedProps<TDate, Props extends BaseTimePickerProps<TDate>>(
  props: Props,
  name: string,
): DefaultizedProps<
  Props,
  'openTo' | 'views' | keyof BaseTimeValidationProps,
  { inputFormat: string }
> {
  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({ props, name });

  const utils = useUtils<TDate>();
  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  const localeText = useLocaleText<TDate>();

  const getOpenDialogAriaText = localeText.openTimePickerDialogue;

  return {
    ampm,
    openTo: 'hours',
    views: ['hours', 'minutes'],
    acceptRegex: ampm ? /[\dapAP]/gi : /\d/gi,
    disableMaskedInput: false,
    disablePast: false,
    disableFuture: false,
    getOpenDialogAriaText,
    inputFormat: ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h,
    ...themeProps,
    components: {
      OpenPickerIcon: Clock,
      ...themeProps.components,
    },
  };
}

export const timePickerValueManager: PickerStateValueManager<any, any> = {
  emptyValue: null,
  getTodayValue: (utils) => utils.date()!,
  cleanValue: replaceInvalidDateByNull,
  areValuesEqual: (utils, a, b) => utils.isEqual(a, b),
  valueReducer: (utils, lastValidValue, newValue) => {
    if (!lastValidValue || !utils.isValid(newValue)) {
      return newValue;
    }

    return utils.mergeDateAndTime(lastValidValue, newValue);
  },
};
