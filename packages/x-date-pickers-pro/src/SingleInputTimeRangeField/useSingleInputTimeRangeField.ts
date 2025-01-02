'use client';
import {
  useField,
  PickerRangeValue,
  PickerManagerFieldInternalProps,
  PickerManagerFieldInternalPropsWithDefaults,
} from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { UseSingleInputTimeRangeFieldProps } from './SingleInputTimeRangeField.types';
import { useTimeRangeManager } from '../managers';
import { TimeRangeValidationError } from '../models';

export const useSingleInputTimeRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useTimeRangeManager(props);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'time');

  return useField<
    PickerRangeValue,
    TEnableAccessibleFieldDOMStructure,
    TimeRangeValidationError,
    PickerManagerFieldInternalProps<typeof manager>,
    PickerManagerFieldInternalPropsWithDefaults<typeof manager>,
    typeof forwardedProps
  >({
    manager,
    forwardedProps,
    internalProps,
  });
};
