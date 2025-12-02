'use client';
import { useField } from '../internals/hooks/useField';
import { useTimeManager } from '../managers';
import { UseTimeFieldProps } from './TimeField.types';

export const useTimeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TProps extends UseTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TProps,
) => {
  const manager = useTimeManager(props);
  return useField({ manager, props });
};
