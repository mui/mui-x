import {
  useField,
  splitFieldInternalAndForwardedProps,
  useDefaultizedDateTimeField,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { UseSingleInputDateTimeRangeFieldProps } from './SingleInputDateTimeRangeField.types';
import { rangeValueManager, rangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateDateTimeRange } from '../internals/utils/validation/validateDateTimeRange';
import { RangeFieldSection, DateRange } from '../models';

export const useSingleInputDateTimeRangeField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputDateTimeRangeFieldProps<
    TDate,
    TEnableAccessibleFieldDOMStructure
  >,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateTimeField<
    TDate,
    UseSingleInputDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
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
    TEnableAccessibleFieldDOMStructure,
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
