'use client';
import { useField } from '@mui/x-date-pickers/internals';
import { UseSingleInputDateTimeRangeFieldProps } from './SingleInputDateTimeRangeField.types';
import { useDateTimeRangeManager } from '../managers';

export const useSingleInputDateTimeRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TProps extends UseSingleInputDateTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TProps,
) => {
  const manager = useDateTimeRangeManager(props);
  return useField({ manager, props });
};
