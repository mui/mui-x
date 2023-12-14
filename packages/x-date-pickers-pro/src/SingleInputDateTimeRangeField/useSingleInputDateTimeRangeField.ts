import {
  useField,
  splitFieldInternalAndForwardedProps,
  useDefaultizedDateTimeField,
} from '@mui/x-date-pickers/internals';
import { UseSingleInputDateTimeRangeFieldProps } from './SingleInputDateTimeRangeField.types';
import { rangeValueManager, rangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateDateTimeRange } from '../internals/utils/validation/validateDateTimeRange';
import { DateRange } from '../internals/models';
import { RangeFieldSection } from '../models';

export const useSingleInputDateTimeRangeField = <
  TDate,
  TUseV6TextField extends boolean,
  TAllProps extends UseSingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateTimeField<
    TDate,
    UseSingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField>,
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
    TUseV6TextField,
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
