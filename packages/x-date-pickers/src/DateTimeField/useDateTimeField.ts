'use client';
import { useField } from '../internals/hooks/useField';
import { UseDateTimeFieldProps } from './DateTimeField.types';
import { useDateTimeManager } from '../managers';

export const useDateTimeField = <TProps extends UseDateTimeFieldProps>(props: TProps) => {
  const manager = useDateTimeManager();
  return useField({ manager, props });
};
