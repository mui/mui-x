import {
  Validator,
  DateValidationError,
  validateDate,
  BaseDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../../utils/date-utils';
import { DateRange, DayRangeValidationProps } from '../../models';

export interface DateRangeComponentValidationProps<TDate>
  extends DayRangeValidationProps<TDate>,
    Required<BaseDateValidationProps<TDate>> {}

export const validateDateRange: Validator<
  DateRange<any>,
  any,
  DateRangeValidationError,
  DateRangeComponentValidationProps<any>
> = ({ props, value, adapter }) => {
  const [start, end] = value;

  const { shouldDisableDate, ...otherProps } = props;

  const dateValidations: [DateRangeValidationErrorValue, DateRangeValidationErrorValue] = [
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

type DateRangeValidationErrorValue = DateValidationError | 'invalidRange' | null;

export type DateRangeValidationError = [
  DateRangeValidationErrorValue,
  DateRangeValidationErrorValue,
];
