import type { MakeRequired } from '@mui/x-internals/types';
import { validateTime, Validator } from '@mui/x-date-pickers/validation';
import {
  TimeValidationProps,
  BaseTimeValidationProps,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../internals/utils/date-utils';
import { TimeRangeValidationError } from '../models';
import { rangeValueManager } from '../internals/utils/valueManagers';

/**
 * Validation props used by the Time Range Picker and Time Range Field.
 */
export interface ExportedValidateTimeRangeProps
  extends BaseTimeValidationProps,
    TimeValidationProps {}

/**
 * Validation props as received by the validateTimeRange method.
 */
export interface ValidateTimeRangeProps
  extends MakeRequired<ExportedValidateTimeRangeProps, ValidateTimeRangePropsToDefault> {}

/**
 * Name of the props that should be defaulted before being passed to the validateTimeRange method.
 */
export type ValidateTimeRangePropsToDefault = keyof BaseTimeValidationProps;

export const validateTimeRange: Validator<
  PickerRangeValue,
  TimeRangeValidationError,
  ValidateTimeRangeProps
> = ({ adapter, value, timezone, props }) => {
  const [start, end] = value;

  const dateTimeValidations: TimeRangeValidationError = [
    validateTime({
      adapter,
      value: start,
      timezone,
      props,
    }),
    validateTime({
      adapter,
      value: end,
      timezone,
      props,
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

validateTimeRange.valueManager = rangeValueManager;
