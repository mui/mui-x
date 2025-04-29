'use client';
import { useField } from '@mui/x-date-pickers/internals';
import { UseSingleInputDateRangeFieldProps } from './SingleInputDateRangeField.types';
import { useDateRangeManager } from '../managers';

export const useSingleInputDateRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TProps extends UseSingleInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TProps,
) => {
  const manager = useDateRangeManager(props);
  return useField({ manager, props });
};
