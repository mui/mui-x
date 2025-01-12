'use client';
import { useField } from '../internals/hooks/useField';
import { UseDateTimeFieldProps } from './DateTimeField.types';
import { useSplitFieldProps } from '../hooks';
import { useDateTimeManager } from '../managers';
import {
  PickerManagerFieldInternalProps,
  PickerManagerFieldInternalPropsWithDefaults,
  PickerValue,
} from '../internals/models';
import { DateTimeValidationError } from '../models/validation';

export const useDateTimeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useDateTimeManager(props);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date-time');

  return useField<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    DateTimeValidationError,
    PickerManagerFieldInternalProps<typeof manager>,
    PickerManagerFieldInternalPropsWithDefaults<typeof manager>,
    typeof forwardedProps
  >({
    manager,
    forwardedProps,
    internalProps,
  });
};
