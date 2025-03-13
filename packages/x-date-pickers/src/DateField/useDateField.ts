'use client';
import { useField } from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.types';
import { useSplitFieldProps } from '../hooks';
import { useDateManager } from '../managers';

export const useDateField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useDateManager(props);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');
  return useField({ manager, forwardedProps, internalProps });
};
