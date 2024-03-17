import {
  useField,
  splitFieldInternalAndForwardedProps,
  useDefaultizedTimeField,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { UseSingleInputTimeRangeFieldProps } from './SingleInputTimeRangeField.types';
import { rangeValueManager, rangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateTimeRange } from '../internals/utils/validation/validateTimeRange';
import { RangeFieldSection, DateRange } from '../models';

export const useSingleInputTimeRangeField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedTimeField<
    TDate,
    UseSingleInputTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
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
    TEnableAccessibleFieldDOMStructure,
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
