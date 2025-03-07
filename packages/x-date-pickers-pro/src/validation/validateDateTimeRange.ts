import { DateTimeValidationProps, PickerRangeValue } from '@mui/x-date-pickers/internals';
import { validateDateTime, Validator } from '@mui/x-date-pickers/validation';
import { isRangeValid } from '../internals/utils/date-utils';
import { DateTimeRangeValidationError } from '../models';
import { rangeValueManager } from '../internals/utils/valueManagers';
import {
  ExportedValidateDateRangeProps,
  ValidateDateRangeProps,
  ValidateDateRangePropsToDefault,
} from './validateDateRange';
import {
  ExportedValidateTimeRangeProps,
  ValidateTimeRangeProps,
  ValidateTimeRangePropsToDefault,
} from './validateTimeRange';

/**
 * Validation props used by the Date Time Range Picker and Date Time Range Field.
 */
export interface ExportedValidateDateTimeRangeProps
  extends ExportedValidateDateRangeProps,
    ExportedValidateTimeRangeProps,
    DateTimeValidationProps {}

/**
 * Validation props as received by the validateDateTimeRange method.
 */
export interface ValidateDateTimeRangeProps
  extends ValidateDateRangeProps,
    ValidateTimeRangeProps {}

export type ValidateDateTimeRangePropsToDefault =
  | ValidateDateRangePropsToDefault
  | ValidateTimeRangePropsToDefault;

export const validateDateTimeRange: Validator<
  PickerRangeValue,
  DateTimeRangeValidationError,
  ValidateDateTimeRangeProps
> = ({ adapter, value, timezone, props }) => {
  const [start, end] = value;

  const { shouldDisableDate, ...otherProps } = props;

  const dateTimeValidations: DateTimeRangeValidationError = [
    validateDateTime({
      adapter,
      value: start,
      timezone,
      props: {
        ...otherProps,
        shouldDisableDate: (day) => !!shouldDisableDate?.(day, 'start'),
      },
    }),
    validateDateTime({
      adapter,
      value: end,
      timezone,
      props: {
        ...otherProps,
        shouldDisableDate: (day) => !!shouldDisableDate?.(day, 'end'),
      },
    }),
  ];

  if (dateTimeValidations[0] || dateTimeValidations[1]) {
    return dateTimeValidations;
  }

  // for partial input
  if (start === null || end === null) {
    return [null, null];
  }

  if (!isRangeValid(adapter.utils, value)) {
    return ['invalidRange', 'invalidRange'];
  }

  return [null, null];
};

validateDateTimeRange.valueManager = rangeValueManager;
