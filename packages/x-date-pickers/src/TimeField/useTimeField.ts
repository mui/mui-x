'use client';
import { useField } from '../internals/hooks/useField';
import { useTimeManager } from '../managers';
import { UseTimeFieldProps } from './TimeField.types';

export const useTimeField = <TProps extends UseTimeFieldProps>(props: TProps) => {
  const manager = useTimeManager(props);
  return useField({ manager, props });
};
