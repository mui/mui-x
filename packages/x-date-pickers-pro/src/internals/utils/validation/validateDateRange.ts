import { PickerValidDate, TimezoneProps } from '@mui/x-date-pickers/models';
import {
  Validator,
  validateDate,
  BaseDateValidationProps,
  DefaultizedProps,
} from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../date-utils';
import { DayRangeValidationProps } from '../../models/dateRange';
import { DateRangeValidationError, DateRange } from '../../../models';

export interface DateRangeComponentValidationProps<TDate extends PickerValidDate>
  extends DayRangeValidationProps<TDate>,
    Required<BaseDateValidationProps<TDate>>,
    DefaultizedProps<TimezoneProps, 'timezone'> {
      disableNonContiguousRanges?: boolean;
    }

export const validateDateRange: Validator<
  DateRange<any>,
  any,
  DateRangeValidationError,
  DateRangeComponentValidationProps<any>
> = ({ props, value, adapter }) => {
  const [start, end] = value;

  const { shouldDisableDate, disableNonContiguousRanges, ...otherProps } = props;
  if(!!start && !!end && disableNonContiguousRanges && shouldDisableDate) {
    let current = start;

    while (current.isBefore(adapter.utils.addDays(end, 1))) {
      if(shouldDisableDate(current, 'start')) {
        return ['nonContiguousRanges', 'nonContiguousRanges'];
      }
      current = adapter.utils.addDays(current, 1);
    }
  };

  const dateValidations: DateRangeValidationError = [
    validateDate({
      adapter,
      value: start,
      props: {
        ...otherProps,
        shouldDisableDate: (day) => !!shouldDisableDate?.(day, 'start'),
      },
    }),
    validateDate({
      adapter,
      value: end,
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
