'use client';
import { useField } from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.types';
import { useDateManager } from '../managers';

export const useDateField = <TProps extends UseDateFieldProps>(props: TProps) => {
  const manager = useDateManager();
  return useField({ manager, props });
};
