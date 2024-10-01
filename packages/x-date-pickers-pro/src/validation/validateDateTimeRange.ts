import { PickerValidDate } from '@mui/x-date-pickers/models';
import { validateDateTime, Validator } from '@mui/x-date-pickers/validation';
import { BaseDateValidationProps, TimeValidationProps } from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../internals/utils/date-utils';
import { DayRangeValidationProps } from '../internals/models/dateRange';
import { DateTimeRangeValidationError, DateRange } from '../models';
import { rangeValueManager } from '../internals/utils/valueManagers';

export interface ValidateDateTimeRangeProps<TDate extends PickerValidDate>
  extends DayRangeValidationProps<TDate>,
    TimeValidationProps<TDate>,
    Required<BaseDateValidationProps<TDate>> {}

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
