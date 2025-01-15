'use client';
import {
  useField,
  PickerRangeValue,
  PickerManagerFieldInternalProps,
  PickerManagerFieldInternalPropsWithDefaults,
} from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { UseSingleInputDateTimeRangeFieldProps } from './SingleInputDateTimeRangeField.types';
import { useDateTimeRangeManager } from '../managers';
import { DateTimeRangeValidationError } from '../models';

export const useSingleInputDateTimeRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputDateTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useDateTimeRangeManager(props);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date-time');

  return useField<
    PickerRangeValue,
    TEnableAccessibleFieldDOMStructure,
    DateTimeRangeValidationError,
    PickerManagerFieldInternalProps<typeof manager>,
    PickerManagerFieldInternalPropsWithDefaults<typeof manager>,
    typeof forwardedProps
  >({
    manager,
    forwardedProps,
    internalProps,
  });
};
