import { PickerValidDate } from '@mui/x-date-pickers/models';
import { validateDate, Validator } from '@mui/x-date-pickers/validation';
import { BaseDateValidationProps } from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../internals/utils/date-utils';
import { DayRangeValidationProps } from '../internals/models/dateRange';
import { DateRangeValidationError, DateRange } from '../models';
import { rangeValueManager } from '../internals/utils/valueManagers';

/**
 * Validation props used by the Date Range Picker, Date Range Field and Date Range Calendar components.
 */
export interface ExportedValidateDateRangeProps<TDate extends PickerValidDate>
  extends DayRangeValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export interface ValidateDateRangeProps<TDate extends PickerValidDate>
  extends DayRangeValidationProps<TDate>,
    Required<BaseDateValidationProps<TDate>> {}

export const validateDateRange: Validator<
  DateRange<any>,
  any,
  DateRangeValidationError,
  ValidateDateRangeProps<any>
> = ({ adapter, value, timezone, props }) => {
  const [start, end] = value;

  const { shouldDisableDate, ...otherProps } = props;

  const dateValidations: DateRangeValidationError = [
    validateDate({
      adapter,
      value: start,
      timezone,
      props: {
        ...otherProps,
        shouldDisableDate: (day) => !!shouldDisableDate?.(day, 'start'),
      },
    }),
    validateDate({
      adapter,
      value: end,
      timezone,
      props: {
        ...otherProps,
        shouldDisableDate: (day) => !!shouldDisableDate?.(day, 'end'),
      },
    }),
  ];

  if (dateValidations[0] || dateValidations[1]) {
    return dateValidations;
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

validateDateRange.valueManager = rangeValueManager;
