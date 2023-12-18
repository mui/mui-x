import {
  useField,
  splitFieldInternalAndForwardedProps,
  useDefaultizedTimeField,
} from '@mui/x-date-pickers/internals';
import { UseSingleInputTimeRangeFieldProps } from './SingleInputTimeRangeField.types';
import { rangeValueManager, rangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateTimeRange } from '../internals/utils/validation/validateTimeRange';
import { DateRange } from '../internals/models';
import { RangeFieldSection } from '../models';

export const useSingleInputTimeRangeField = <
  TDate,
  TUseV6TextField extends boolean,
  TAllProps extends UseSingleInputTimeRangeFieldProps<TDate, TUseV6TextField>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedTimeField<
    TDate,
    UseSingleInputTimeRangeFieldProps<TDate, TUseV6TextField>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseSingleInputTimeRangeFieldProps<any, any>
  >(props, 'time');

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
    validator: validateTimeRange,
    valueType: 'time',
  });
};
