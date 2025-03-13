'use client';
import { useField } from '@mui/x-date-pickers/internals';
import { UseSingleInputDateRangeFieldProps } from './SingleInputDateRangeField.types';
import { useDateRangeManager } from '../managers';

export const useSingleInputDateRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useDateRangeManager(props);
  return useField({ manager, props });
};
