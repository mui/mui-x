'use client';
import { useField } from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.types';
import { useDateManager } from '../managers';

export const useDateField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TProps extends UseDateFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TProps,
) => {
  const manager = useDateManager(props);
  return useField({ manager, props });
};
