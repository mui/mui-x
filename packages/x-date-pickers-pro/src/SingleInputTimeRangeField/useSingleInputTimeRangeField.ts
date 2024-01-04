import {
  useField,
  splitFieldInternalAndForwardedProps,
  useDefaultizedTimeField,
} from '@mui/x-date-pickers/internals';
import { FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import { UseSingleInputTimeRangeFieldProps } from './SingleInputTimeRangeField.types';
import { rangeValueManager, rangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateTimeRange } from '../internals/utils/validation/validateTimeRange';
import { DateRange } from '../internals/models';
import { RangeFieldSection } from '../models';

export const useSingleInputTimeRangeField = <
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TAllProps extends UseSingleInputTimeRangeFieldProps<TDate, TTextFieldVersion>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedTimeField<
    TDate,
    UseSingleInputTimeRangeFieldProps<TDate, TTextFieldVersion>,
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
    TTextFieldVersion,
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
