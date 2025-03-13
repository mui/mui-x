'use client';
import { useField } from '../internals/hooks/useField';
import { UseDateTimeFieldProps } from './DateTimeField.types';
import { useDateTimeManager } from '../managers';

export const useDateTimeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useDateTimeManager(props);
  return useField({ manager, props });
};
