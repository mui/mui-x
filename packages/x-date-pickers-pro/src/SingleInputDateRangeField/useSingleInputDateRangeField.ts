import {
  useField,
  splitFieldInternalAndForwardedProps,
  useDefaultizedDateField,
} from '@mui/x-date-pickers/internals';
import { FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import { UseSingleInputDateRangeFieldProps } from './SingleInputDateRangeField.types';
import { rangeValueManager, rangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateDateRange } from '../internals/utils/validation/validateDateRange';
import { RangeFieldSection, DateRange } from '../models';

export const useSingleInputDateRangeField = <
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TAllProps extends UseSingleInputDateRangeFieldProps<TDate, TTextFieldVersion>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateField<
    TDate,
    UseSingleInputDateRangeFieldProps<TDate, TTextFieldVersion>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseSingleInputDateRangeFieldProps<TDate, TTextFieldVersion>
  >(props, 'date');

  return useField<
    DateRange<TDate>,
    TDate,
    RangeFieldSection,
    TTextFieldVersion,
    typeof forwardedProps,
    typeof internalProps
  >({
    forwardedProps,
    internalProps,
    valueManager: rangeValueManager,
    fieldValueManager: rangeFieldValueManager,
    validator: validateDateRange,
    valueType: 'date',
  });
};
