'use client';
import { useField } from '../internals/hooks/useField';
import { UseTimeFieldProps } from './TimeField.types';
import { useSplitFieldProps } from '../hooks';
import { useTimeManager } from '../managers';

export const useTimeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useTimeManager(props);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'time');
  return useField({ manager, forwardedProps, internalProps });
};
