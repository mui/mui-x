'use client';
import { useField } from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.types';
import { useSplitFieldProps } from '../hooks';
import { useDateManager } from '../managers';
import {
  PickerManagerFieldInternalProps,
  PickerManagerFieldInternalPropsWithDefaults,
  PickerValue,
} from '../internals/models';
import { DateValidationError } from '../models/validation';

export const useDateField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useDateManager(props);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');

  return useField<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    DateValidationError,
    PickerManagerFieldInternalProps<typeof manager>,
    PickerManagerFieldInternalPropsWithDefaults<typeof manager>,
    typeof forwardedProps
  >({
    manager,
    forwardedProps,
    internalProps,
  });
};
