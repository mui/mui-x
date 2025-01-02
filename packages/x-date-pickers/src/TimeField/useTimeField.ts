'use client';
import { useField } from '../internals/hooks/useField';
import { UseTimeFieldProps } from './TimeField.types';
import { useSplitFieldProps } from '../hooks';
import { useTimeManager } from '../managers';
import {
  PickerManagerFieldInternalProps,
  PickerManagerFieldInternalPropsWithDefaults,
  PickerValue,
} from '../internals/models';
import { TimeValidationError } from '../models/validation';

export const useTimeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useTimeManager(props);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'time');

  return useField<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    TimeValidationError,
    PickerManagerFieldInternalProps<typeof manager>,
    PickerManagerFieldInternalPropsWithDefaults<typeof manager>,
    typeof forwardedProps
  >({
    manager,
    forwardedProps,
    internalProps,
  });
};
