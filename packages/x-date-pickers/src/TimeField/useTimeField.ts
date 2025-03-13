'use client';
import { useField } from '../internals/hooks/useField';
import { useTimeManager } from '../managers';
import { UseTimeFieldProps } from './TimeField.types';

export const useTimeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useTimeManager(props);
  return useField({ manager, props });
};
