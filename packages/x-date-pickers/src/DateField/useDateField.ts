'use client';
import { useField } from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.types';
import { useDateManager } from '../managers';

export const useDateField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useDateManager(props);
  return useField({ manager, props });
};
