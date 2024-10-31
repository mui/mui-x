import { PickerValidDate } from '@mui/x-date-pickers/models';
import { DateTimeValidationProps } from '@mui/x-date-pickers/internals';
import { validateDateTime, Validator } from '@mui/x-date-pickers/validation';
import { isRangeValid } from '../internals/utils/date-utils';
import { DateTimeRangeValidationError, DateRange } from '../models';
import { rangeValueManager } from '../internals/utils/valueManagers';
import { ExportedValidateDateRangeProps, ValidateDateRangeProps } from './validateDateRange';
import { ExportedValidateTimeRangeProps, ValidateTimeRangeProps } from './validateTimeRange';

/**
 * Validation props used by the Date Time Range Picker and Date Time Range Field.
 */
export interface ExportedValidateDateTimeRangeProps<TDate extends PickerValidDate>
  extends ExportedValidateDateRangeProps<TDate>,
    ExportedValidateTimeRangeProps<TDate>,
    DateTimeValidationProps<TDate> {}

export interface ValidateDateTimeRangeProps<TDate extends PickerValidDate>
  extends ValidateDateRangeProps<TDate>,
    ValidateTimeRangeProps<TDate> {}

export const validateDateTimeRange: Validator<
  DateRange<any>,
  any,
  DateTimeRangeValidationError,
  ValidateDateTimeRangeProps<any>
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
