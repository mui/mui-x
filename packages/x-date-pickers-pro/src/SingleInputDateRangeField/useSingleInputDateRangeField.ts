'use client';
import {
  useField,
  PickerRangeValue,
  PickerManagerFieldInternalProps,
  PickerManagerFieldInternalPropsWithDefaults,
} from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { UseSingleInputDateRangeFieldProps } from './SingleInputDateRangeField.types';
import { useDateRangeManager } from '../managers';
import { DateRangeValidationError } from '../models';

export const useSingleInputDateRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useDateRangeManager(props);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');

  return useField<
    PickerRangeValue,
    TEnableAccessibleFieldDOMStructure,
    DateRangeValidationError,
    PickerManagerFieldInternalProps<typeof manager>,
    PickerManagerFieldInternalPropsWithDefaults<typeof manager>,
    typeof forwardedProps
  >({
    manager,
    forwardedProps,
    internalProps,
  });
};
