'use client';
import { useField } from '@mui/x-date-pickers/internals';
import { UseSingleInputDateTimeRangeFieldProps } from './SingleInputDateTimeRangeField.types';
import { useDateTimeRangeManager } from '../managers';

export const useSingleInputDateTimeRangeField = <
  TProps extends UseSingleInputDateTimeRangeFieldProps,
>(
  props: TProps,
) => {
  const manager = useDateTimeRangeManager(props);
  return useField({ manager, props });
};
