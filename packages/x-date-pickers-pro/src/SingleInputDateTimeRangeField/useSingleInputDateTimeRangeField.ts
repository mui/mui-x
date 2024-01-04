import {
  useField,
  splitFieldInternalAndForwardedProps,
  useDefaultizedDateTimeField,
} from '@mui/x-date-pickers/internals';
import { FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import { UseSingleInputDateTimeRangeFieldProps } from './SingleInputDateTimeRangeField.types';
import { rangeValueManager, rangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateDateTimeRange } from '../internals/utils/validation/validateDateTimeRange';
import { DateRange } from '../internals/models';
import { RangeFieldSection } from '../models';

export const useSingleInputDateTimeRangeField = <
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TAllProps extends UseSingleInputDateTimeRangeFieldProps<TDate, TTextFieldVersion>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateTimeField<
    TDate,
    UseSingleInputDateTimeRangeFieldProps<TDate, TTextFieldVersion>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseSingleInputDateTimeRangeFieldProps<any, any>
  >(props, 'date-time');

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
    validator: validateDateTimeRange,
    valueType: 'date-time',
  });
};
